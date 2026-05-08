import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const PaymentVerification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviewForm, setReviewForm] = useState({ status: 'approved', adminNotes: '' });

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments/verification-requests`);
      setRequests(res.data);
    } catch (err) {
      console.error('Fetch requests error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReview = (req) => {
    setSelectedReq(req);
    setReviewForm({ status: 'approved', adminNotes: '' });
    setShowReviewModal(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/payments/verify/${selectedReq._id}`, reviewForm);
      setShowReviewModal(false);
      fetchRequests();
    } catch (err) {
      alert('Review submission failed');
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

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Administrative</p>
        <h1 className="page-title">Verification Queue</h1>
        <p className="text-secondary font-medium">Verify member-submitted payment records</p>
      </header>

      {/* Task Counter Card */}
      <div className="card bg-indigo-600 text-white border-none p-6 mb-8 shadow-xl shadow-indigo-900/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">⏳</div>
          <div>
            <h2 className="text-2xl font-black">{requests.length} Requests Pending</h2>
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Awaiting admin review</p>
          </div>
        </div>
      </div>

      {/* Request List */}
      <div className="flex flex-col gap-6">
        {requests.map(req => (
          <div key={req._id} className="card p-0 overflow-hidden group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                    💰
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Flat {req.flatId?.number}</h3>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
                      {req.submittedBy?.name} • {MONTHS[req.month - 1]} {req.year}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-indigo-600">{formatCurrency(req.amount)}</p>
                  <p className="text-[10px] font-bold text-secondary uppercase">{req.paymentMethod?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-secondary uppercase mb-1">Reference ID</p>
                  <p className="font-mono font-black text-xs text-slate-700">{req.transactionId || 'NOT PROVIDED'}</p>
                </div>
                {req.screenshotUrl && (
                  <a href={req.screenshotUrl} target="_blank" rel="noreferrer" className="btn btn--secondary py-2 px-3 rounded-xl text-[10px]">
                    🖼️ VIEW PROOF
                  </a>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => openReview(req)} className="btn btn--primary flex-1 py-3.5 rounded-2xl shadow-lg">
                  SUBMIT REVIEW
                </button>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="card text-center py-24">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-xl font-black mb-2">Queue is Clear</h2>
            <p className="text-secondary font-medium">No pending payments to verify right now.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Verify Submission">
        {selectedReq && (
          <form onSubmit={submitReview} className="p-4 space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl text-center">
              <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Amount to Verify</p>
              <h2 className="text-3xl font-black text-indigo-600">{formatCurrency(selectedReq.amount)}</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Flat {selectedReq.flatId?.number} • {selectedReq.paymentMethod?.toUpperCase()}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Review Decision</label>
              <select className="form-input" value={reviewForm.status} onChange={e => setReviewForm({ ...reviewForm, status: e.target.value })}>
                <option value="approved">✅ Approve Payment</option>
                <option value="correction_needed">🔄 Request Correction</option>
                <option value="rejected">❌ Reject Record</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Remarks</label>
              <textarea className="form-input" rows={3} placeholder="Notes for the member..."
                value={reviewForm.adminNotes} onChange={e => setReviewForm({ ...reviewForm, adminNotes: e.target.value })}
                required={reviewForm.status !== 'approved'} />
            </div>

            <div className="flex gap-4 pt-4">
               <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn--secondary flex-1">Cancel</button>
               <button type="submit" disabled={saving} className={`btn flex-1 ${reviewForm.status === 'approved' ? 'btn--primary' : 'bg-rose-500 text-white'}`}>
                 {saving ? 'Processing...' : 'Submit Decision'}
               </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PaymentVerification;
