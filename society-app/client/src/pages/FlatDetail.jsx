import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const FlatDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [saving, setSaving] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    paidAmount: '', lateFee: 0, paymentMethod: 'cash', transactionId: ''
  });

  const [editForm, setEditForm] = useState({});

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    fetchFlatData();
  }, [id]);

  const fetchFlatData = async () => {
    try {
      const [flatRes, paymentsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/flats/${id}`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/payments/flat/${id}`)
      ]);
      setFlat(flatRes.data);
      setPayments(paymentsRes.data);
      setEditForm(flatRes.data);
    } catch (err) {
      console.error('Fetch flat details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = (p) => {
    setSelectedPayment(p);
    setPaymentForm({
      paidAmount: p.amount - p.paidAmount,
      lateFee: 0,
      paymentMethod: 'cash',
      transactionId: ''
    });
    setShowPaymentModal(true);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/payments/${selectedPayment._id}/pay`, paymentForm);
      setShowPaymentModal(false);
      fetchFlatData();
    } catch (err) {
      alert('Payment failed');
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/flats/${id}`, editForm);
      setShowEditModal(false);
      fetchFlatData();
    } catch (err) {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amt || 0);
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!flat) return <div className="p-10 text-center font-black">Flat not found</div>;

  const isAdmin = user?.role === 'admin';
  const totalDue = payments.reduce((sum, p) => sum + (p.status !== 'paid' ? (p.amount - p.paidAmount) : 0), 0);

  return (
    <div className="animate-up">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">
            <span className="cursor-pointer" onClick={() => navigate(-1)}>← Back</span>
            <span>/</span>
            <span>Unit Details</span>
          </div>
          <h1 className="page-title">Flat {flat.number}</h1>
        </div>
        {isAdmin && (
          <button onClick={() => setShowEditModal(true)} className="btn btn--secondary py-2 px-4 rounded-xl text-xs">
            ✏️ Edit Profile
          </button>
        )}
      </header>

      {/* Resident Profile Section */}
      <div className="card mb-8 p-0 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full -mr-24 -mt-24"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-black">
              {flat.ownerName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black">{flat.ownerName}</h2>
              <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Primary Resident</p>
            </div>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Contact Details</p>
            <div className="space-y-3">
              <p className="font-bold text-sm">📱 {flat.ownerPhone || 'No phone'}</p>
              <p className="font-bold text-sm">📧 {flat.ownerEmail || 'No email'}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Unit Information</p>
            <div className="space-y-3">
              <p className="font-bold text-sm">🏠 Type: {flat.type}</p>
              <p className="font-bold text-sm">📐 Area: {flat.area} sq.ft</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Payment Status</p>
            <span className={`status-badge status-badge--${flat.currentMonthStatus}`}>
              Current: {flat.currentMonthStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid-2 mb-8">
        <div className="card bg-rose-50 border-rose-100">
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Total Outstanding</p>
          <h3 className="text-3xl font-black text-rose-500">{formatCurrency(totalDue)}</h3>
          {totalDue > 0 && !isAdmin && (
             <button className="btn btn--primary btn--full mt-6 py-4 rounded-2xl">
               PAY NOW 💳
             </button>
          )}
        </div>

        <div className="card">
          <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4 text-center">Scan to Pay UPI</p>
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=society@upi&am=${totalDue}&tn=Maint_${flat.number}`}
                alt="QR" className="w-32 h-32"
              />
            </div>
            <p className="text-[10px] font-bold text-slate-400">society@upi • {flat.number}</p>
          </div>
        </div>
      </div>

      {/* Payment History Card List */}
      <div className="section-header">
        <h2 className="section-title">Billing History</h2>
      </div>

      <div className="flex flex-col gap-4">
        {payments.map((p, i) => (
          <div key={i} className="card p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-slate-900">{MONTHS[p.month - 1]} {p.year}</h3>
                <p className="text-[10px] font-bold text-secondary uppercase">Maintenance Bill</p>
              </div>
              <span className={`status-badge status-badge--${p.status}`}>{p.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
              <div>
                <p className="text-[9px] font-black text-secondary uppercase mb-1">Bill Amount</p>
                <p className="font-black">{formatCurrency(p.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-secondary uppercase mb-1">Paid On</p>
                <p className="font-bold text-sm">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'Pending'}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="btn btn--secondary flex-1 py-2.5 text-xs">📥 Receipt</button>
              {isAdmin && p.status !== 'paid' && (
                <button className="btn btn--primary flex-1 py-2.5 text-xs" onClick={() => handleRecordPayment(p)}>💰 Record</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Optimized Modals */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Record Payment">
        <form onSubmit={submitPayment} className="p-4 space-y-6">
           <div className="bg-indigo-50 p-6 rounded-2xl text-center">
             <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Collecting for</p>
             <h2 className="text-xl font-black text-indigo-600">{MONTHS[(selectedPayment?.month || 1) - 1]} {selectedPayment?.year}</h2>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="form-group">
               <label className="form-label">Amount Paid</label>
               <input type="number" className="form-input" required
                 value={paymentForm.paidAmount} onChange={e => setPaymentForm({ ...paymentForm, paidAmount: e.target.value })} />
             </div>
             <div className="form-group">
               <label className="form-label">Method</label>
               <select className="form-input" value={paymentForm.paymentMethod} onChange={e => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}>
                 <option value="cash">Cash</option>
                 <option value="upi">UPI</option>
                 <option value="bank_transfer">Bank</option>
               </select>
             </div>
           </div>

           <div className="form-group">
             <label className="form-label">Reference (Txn ID)</label>
             <input type="text" className="form-input" placeholder="Optional"
               value={paymentForm.transactionId} onChange={e => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} />
           </div>

           <button type="submit" disabled={saving} className="btn btn--primary btn--full py-4">
             {saving ? 'Processing...' : '✅ Confirm Payment'}
           </button>
        </form>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Resident Profile">
        <form onSubmit={submitEdit} className="p-4 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
           <div className="form-group">
             <label className="form-label">Owner Name</label>
             <input type="text" className="form-input"
               value={editForm.ownerName || ''} onChange={e => setEditForm({ ...editForm, ownerName: e.target.value })} />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div className="form-group">
               <label className="form-label">Phone Number</label>
               <input type="text" className="form-input"
                 value={editForm.ownerPhone || ''} onChange={e => setEditForm({ ...editForm, ownerPhone: e.target.value })} />
             </div>
             <div className="form-group">
               <label className="form-label">Email Address</label>
               <input type="email" className="form-input"
                 value={editForm.ownerEmail || ''} onChange={e => setEditForm({ ...editForm, ownerEmail: e.target.value })} />
             </div>
           </div>

           <button type="submit" disabled={saving} className="btn btn--primary btn--full py-4">
             {saving ? 'Saving...' : '💾 Update Profile'}
           </button>
        </form>
      </Modal>
    </div>
  );
};

export default FlatDetail;
