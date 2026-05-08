import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Modal from '../components/Modal';
import api from '../utils/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PaymentVerification = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: 'approved', adminNotes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchRequests(); }, [filter]);

  useEffect(() => {
    if (socket) {
      const refresh = () => fetchRequests();
      socket.on('payment_request_submitted', refresh);
      return () => socket.off('payment_request_submitted', refresh);
    }
  }, [socket]);

  const fetchRequests = async () => {
    try {
      const sid = user?.societyId?._id || user?.societyId;
      if (!sid) return;
      const url = filter === 'all'
        ? `/api/payment-requests/society/${sid}`
        : `/api/payment-requests/society/${sid}?status=${filter}`;
      const data = await api.get(url);
      setRequests(data);
    } catch (err) {
      console.error(err);
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
      await api.put(`/api/payment-requests/${selectedReq._id}/review`, reviewForm);
      setShowReviewModal(false);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

  const statusColors = {
    pending_verification: 'warning',
    approved: 'success',
    rejected: 'danger',
    correction_needed: 'info'
  };

  const statusLabels = {
    pending_verification: '⏳ Pending Verification',
    approved: '✅ Approved',
    rejected: '❌ Rejected',
    correction_needed: '🔄 Correction Needed'
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Verification</h1>
          <p className="page-subtitle">Review member payment submissions</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
        {[
          { key: 'all', label: '📋 All' },
          { key: 'pending_verification', label: '⏳ Pending' },
          { key: 'approved', label: '✅ Approved' },
          { key: 'rejected', label: '❌ Rejected' },
          { key: 'correction_needed', label: '🔄 Correction' }
        ].map(f => (
          <button key={f.key}
            className={`filter-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => { setFilter(f.key); setLoading(true); }}
          >{f.label}</button>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No {filter.replace('_', ' ')} requests</h2>
          <p>All payment requests of this type will appear here</p>
        </div>
      ) : (
        <div className="verification-grid">
          {requests.map(req => (
            <div key={req._id} className={`card verification-card verification-card--${req.status}`}>
              <div className="vc-header">
                <div className="vc-flat-info">
                  <span className="vc-flat-number">🏠 {req.flatId?.number || 'N/A'}</span>
                  <span className="vc-member-name">{req.submittedBy?.name}</span>
                </div>
                <span className={`status-badge status-badge--${statusColors[req.status]}`}>
                  {statusLabels[req.status]}
                </span>
              </div>

              <div className="vc-details">
                <div className="vc-detail-row">
                  <span className="vc-label">Amount</span>
                  <span className="vc-value vc-amount">{formatCurrency(req.amount)}</span>
                </div>
                <div className="vc-detail-row">
                  <span className="vc-label">Period</span>
                  <span className="vc-value">{MONTHS[req.month - 1]} {req.year}</span>
                </div>
                <div className="vc-detail-row">
                  <span className="vc-label">Method</span>
                  <span className="vc-value">{req.paymentMethod?.replace('_', ' ').toUpperCase()}</span>
                </div>
                {req.transactionId && (
                  <div className="vc-detail-row">
                    <span className="vc-label">Txn ID</span>
                    <span className="vc-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{req.transactionId}</span>
                  </div>
                )}
                {req.notes && (
                  <div className="vc-detail-row">
                    <span className="vc-label">Notes</span>
                    <span className="vc-value">{req.notes}</span>
                  </div>
                )}
                <div className="vc-detail-row">
                  <span className="vc-label">Submitted</span>
                  <span className="vc-value">{new Date(req.createdAt).toLocaleString('en-IN')}</span>
                </div>
                {req.adminNotes && (
                  <div className="vc-detail-row">
                    <span className="vc-label">Admin Notes</span>
                    <span className="vc-value" style={{ color: 'var(--warning)' }}>{req.adminNotes}</span>
                  </div>
                )}
              </div>

              {req.screenshotUrl && (
                <div className="vc-screenshot">
                  <a href={req.screenshotUrl} target="_blank" rel="noreferrer" className="btn btn--sm btn--outline">
                    🖼️ View Screenshot
                  </a>
                </div>
              )}

              {req.status === 'pending_verification' && (
                <div className="vc-actions">
                  <button className="btn btn--sm btn--success" onClick={() => { setSelectedReq(req); setReviewForm({ status: 'approved', adminNotes: '' }); setShowReviewModal(true); }}>
                    ✅ Approve
                  </button>
                  <button className="btn btn--sm btn--outline" onClick={() => { setSelectedReq(req); setReviewForm({ status: 'correction_needed', adminNotes: '' }); setShowReviewModal(true); }}>
                    🔄 Correction
                  </button>
                  <button className="btn btn--sm btn--danger" onClick={() => { setSelectedReq(req); setReviewForm({ status: 'rejected', adminNotes: '' }); setShowReviewModal(true); }}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Review Payment">
        {selectedReq && (
          <form onSubmit={submitReview} className="modal-form">
            <div className="payment-info-box">
              <p><strong>Flat:</strong> {selectedReq.flatId?.number}</p>
              <p><strong>Member:</strong> {selectedReq.submittedBy?.name}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedReq.amount)}</p>
              <p><strong>Method:</strong> {selectedReq.paymentMethod?.replace('_', ' ')}</p>
              {selectedReq.transactionId && <p><strong>Txn ID:</strong> {selectedReq.transactionId}</p>}
            </div>

            <div className="form-group">
              <label>Decision</label>
              <select value={reviewForm.status} onChange={e => setReviewForm({ ...reviewForm, status: e.target.value })}>
                <option value="approved">✅ Approve Payment</option>
                <option value="correction_needed">🔄 Ask for Correction</option>
                <option value="rejected">❌ Reject Payment</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes {reviewForm.status !== 'approved' ? '(Required)' : '(Optional)'}</label>
              <textarea
                value={reviewForm.adminNotes}
                onChange={e => setReviewForm({ ...reviewForm, adminNotes: e.target.value })}
                placeholder={reviewForm.status === 'rejected' ? 'Reason for rejection...' : reviewForm.status === 'correction_needed' ? 'What needs to be corrected...' : 'Optional notes...'}
                rows={3}
                required={reviewForm.status !== 'approved'}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn--ghost" onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button type="submit" className={`btn ${reviewForm.status === 'approved' ? 'btn--primary' : reviewForm.status === 'rejected' ? 'btn--danger' : 'btn--outline'}`} disabled={saving}>
                {saving ? <span className="btn-spinner"></span> : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default PaymentVerification;
