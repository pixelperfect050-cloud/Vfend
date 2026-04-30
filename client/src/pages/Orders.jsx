import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Download,
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import socket from '../services/socket';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusBadge = {
  processing: 'badge badge-progress',
  ready: 'badge badge-completed',
  delivered: 'badge badge-review',
  archived: 'badge badge-pending'
};

const paymentBadge = {
  unpaid: 'bg-red-50 text-red-600',
  pending: 'bg-amber-50 text-amber-600',
  paid: 'bg-green-50 text-green-600',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-purple-50 text-purple-600'
};

const paymentIcon = {
  unpaid: AlertCircle,
  pending: Clock,
  paid: CheckCircle2,
  failed: AlertCircle,
  refunded: AlertCircle
};

function Skeleton({ className }) {
  return <div className={`skeleton ${className}`} />;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, text: '' });
  const [paying, setPaying] = useState(null);

  useEffect(() => {
    api.get('/orders/user')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    socket.on('order-updated', (u) =>
      setOrders((p) => p.map((o) => (o._id === u._id ? u : o)))
    );
    return () => socket.off('order-updated');
  }, []);

  const handleDownload = async (orderId, filename) => {
    try {
      const r = await api.get(`/orders/${orderId}/download/${filename}`, {
        responseType: 'blob'
      });
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(r.data);
      a.download = filename;
      a.click();
      toast.success('Download started');
    } catch {
      toast.error('Download failed');
    }
  };

  const handleFeedback = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/feedback`, {
        rating: feedback.rating,
        feedback: feedback.text
      });

      toast.success('Thanks for your feedback!');
      setOrders((p) =>
        p.map((o) =>
          o._id === orderId ? { ...o, rating: feedback.rating } : o
        )
      );
      setExpanded(null);
    } catch {
      toast.error('Feedback failed');
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (orderId) => {
    setPaying(orderId);

    try {
      const { data } = await api.post('/payments/create-order', { orderId });

      // 🔥 Razorpay
      if (data.gateway === 'razorpay') {
        const loaded = await loadRazorpay();
        if (!loaded) return toast.error('Razorpay load failed');

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'ArtFlow Studio',
          description: 'Job Payment',
          order_id: data.razorpayOrderId,

          handler: async (response) => {
            try {
              const verifyRes = await api.post('/payments/verify', {
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                toast.success('Payment successful 🎉');
                setOrders((p) =>
                  p.map((o) =>
                    o._id === orderId
                      ? { ...o, paymentStatus: 'paid' }
                      : o
                  )
                );
              }
            } catch {
              toast.error('Verification failed');
            }
          },

          theme: { color: '#1E40AF' }
        };

        new window.Razorpay(options).open();
      }

      // 🔥 Demo Payment
      else if (data.gateway === 'demo') {
        const confirmPay = window.confirm(
          `Demo Payment\n₹${data.amount}\n\nOK = Success`
        );

        if (confirmPay) {
          const verifyRes = await api.post('/payments/verify', {
            orderId,
            demoPaymentId: data.demoPaymentId
          });

          if (verifyRes.data.success) {
            toast.success('Payment successful 🎉');
            setOrders((p) =>
              p.map((o) =>
                o._id === orderId
                  ? { ...o, paymentStatus: 'paid' }
                  : o
              )
            );
          }
        }
      }

      // 🔥 Free
      else {
        toast.success('Order marked as paid');
        setOrders((p) =>
          p.map((o) =>
            o._id === orderId
              ? { ...o, paymentStatus: 'paid' }
              : o
          )
        );
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {loading ? (
        <Skeleton className="h-20" />
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((o) => {
          const PayIcon = paymentIcon[o.paymentStatus] || AlertCircle;

          return (
            <div key={o._id} className="border p-4 mb-3 rounded">

              <div
                className="flex justify-between cursor-pointer"
                onClick={() =>
                  setExpanded(expanded === o._id ? null : o._id)
                }
              >
                <div>
                  <h3>{o.jobId?.title}</h3>
                  <p className="text-xs text-gray-400">
                    {format(new Date(o.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className={paymentBadge[o.paymentStatus]}>
                    <PayIcon className="inline w-3 h-3 mr-1" />
                    {o.paymentStatus}
                  </span>
                </div>
              </div>

              {expanded === o._id && (
                <div className="mt-3">

                  {/* Payment */}
                  {o.amount > 0 && o.paymentStatus !== 'paid' && (
                    <button
                      onClick={() => handlePayment(o._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      {paying === o._id ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}

                  {/* Paid */}
                  {o.paymentStatus === 'paid' && (
                    <p className="text-green-600">Paid ✅</p>
                  )}

                  {/* Files */}
                  {o.deliveryFiles?.map((f) => (
                    <button
                      key={f.filename}
                      onClick={() =>
                        handleDownload(o._id, f.filename)
                      }
                      className="block mt-2 text-blue-600"
                    >
                      Download {f.originalName}
                    </button>
                  ))}

                </div>
              )}
            </div>
          );
        })
      )}
    </motion.div>
  );
}