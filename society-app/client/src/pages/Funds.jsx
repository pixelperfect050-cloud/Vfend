import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Modal from '../components/Modal';
import api from '../utils/api';

const FUND_CATEGORIES = [
  { value: 'emergency', label: '🚨 Emergency', color: '#ef4444' },
  { value: 'festival', label: '🎉 Festival', color: '#f59e0b' },
  { value: 'repair', label: '🔧 Repair', color: '#3b82f6' },
  { value: 'water_tank', label: '💧 Water Tank', color: '#06b6d4' },
  { value: 'renovation', label: '🏗️ Renovation', color: '#8b5cf6' },
  { value: 'security', label: '🛡️ Security', color: '#10b981' },
  { value: 'special', label: '⭐ Special', color: '#f97316' },
  { value: 'other', label: '📦 Other', color: '#6b7280' }
];

const Funds = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [funds, setFunds] = useState([]);
  const [myFundPayments, setMyFundPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundDetail, setFundDetail] = useState(null);
  const [selectedFP, setSelectedFP] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: '', description: '', category: 'other', amountPerFlat: '',
    dueDate: '', applicableTo: 'all', applicableBlocks: []
  });
  const [payForm, setPayForm] = useState({
    amount: '', paymentMethod: 'upi', transactionId: '', notes: ''
  });
  const [manualForm, setManualForm] = useState({
    paidAmount: '', paymentMethod: 'cash', notes: ''
  });

  const isAdmin = user?.role === 'admin';
  const sid = user?.societyId?._id || user?.societyId;

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (socket) {
      const refresh = () => fetchData();
      socket.on('fund_created', refresh);
      socket.on('fund_payment_submitted', refresh);
      socket.on('fund_payment_approved', refresh);
      socket.on('fund_payment_rejected', refresh);
      socket.on('fund_payment_recorded', refresh);
      return () => {
        socket.off('fund_created', refresh);
        socket.off('fund_payment_submitted', refresh);
        socket.off('fund_payment_approved', refresh);
        socket.off('fund_payment_rejected', refresh);
        socket.off('fund_payment_recorded', refresh);
      };
    }
  }, [socket]);

  const fetchData = async () => {
    try {
      if (!sid) return;
      const [fundsData, blocksData] = await Promise.all([
        api.get(`/api/funds/society/${sid}`),
        isAdmin ? api.get(`/api/blocks/society/${sid}`) : Promise.resolve([])
      ]);
      setFunds(fundsData);
      setBlocks(blocksData);

      if (!isAdmin) {
        const myPays = await api.get('/api/funds/my-payments');
        setMyFundPayments(myPays);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createFund = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/funds', {
        ...createForm,
        amountPerFlat: parseFloat(createForm.amountPerFlat)
      });
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', category: 'other', amountPerFlat: '', dueDate: '', applicableTo: 'all', applicableBlocks: [] });
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const submitFundPayment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/api/funds/${selectedFund._id || selectedFund}/pay`, {
        ...payForm,
        amount: parseFloat(payForm.amount)
      });
      setShowPayModal(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const viewFundDetail = async (fund) => {
    try {
      const detail = await api.get(`/api/funds/${fund._id}`);
      setFundDetail(detail);
      setShowDetailModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const reviewFundPayment = async (fpId, status, adminNotes = '') => {
    try {
      await api.put(`/api/funds/payment/${fpId}/review`, { status, adminNotes });
      const detail = await api.get(`/api/funds/${fundDetail.fund._id}`);
      setFundDetail(detail);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const submitManualPayment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/funds/payment/${selectedFP._id}/manual`, {
        paidAmount: parseFloat(manualForm.paidAmount),
        paymentMethod: manualForm.paymentMethod,
        notes: manualForm.notes
      });
      setShowManualModal(false);
      const detail = await api.get(`/api/funds/${fundDetail.fund._id}`);
      setFundDetail(detail);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

  const getCatInfo = (cat) => FUND_CATEGORIES.find(c => c.value === cat) || FUND_CATEGORIES[7];

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Society Funds</h1>
          <p className="page-subtitle">{isAdmin ? 'Manage extra fund collections' : 'View & pay fund contributions'}</p>
        </div>
        {isAdmin && (
          <button className="btn btn--primary" onClick={() => setShowCreateModal(true)} id="create-fund-btn">
            ➕ Create Fund
          </button>
        )}
      </div>

      {/* Fund Cards */}
      {funds.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h2>No Funds Created</h2>
          <p>{isAdmin ? 'Create your first society fund to start collecting.' : 'No fund collections at the moment.'}</p>
        </div>
      ) : (
        <div className="funds-grid">
          {funds.map(fund => {
            const catInfo = getCatInfo(fund.category);
            const progress = fund.totalTarget > 0 ? ((fund.totalCollected / fund.totalTarget) * 100) : 0;
            const isOverdue = new Date(fund.dueDate) < new Date() && fund.status === 'active';
            const myPayment = myFundPayments.find(p => (p.fundId?._id || p.fundId) === fund._id);

            return (
              <div key={fund._id} className="card fund-card">
                <div className="fund-card-header">
                  <div className="fund-cat-badge" style={{ background: catInfo.color + '20', color: catInfo.color }}>
                    {catInfo.label}
                  </div>
                  {isOverdue && <span className="fund-overdue-badge">⚠️ Overdue</span>}
                  {fund.status === 'completed' && <span className="fund-completed-badge">✅ Completed</span>}
                </div>

                <h3 className="fund-name">{fund.name}</h3>
                {fund.description && <p className="fund-description">{fund.description}</p>}

                <div className="fund-stats-row">
                  <div className="fund-stat">
                    <span className="fund-stat-label">Per Flat</span>
                    <span className="fund-stat-value">{formatCurrency(fund.amountPerFlat)}</span>
                  </div>
                  <div className="fund-stat">
                    <span className="fund-stat-label">Collected</span>
                    <span className="fund-stat-value" style={{ color: 'var(--success)' }}>{formatCurrency(fund.totalCollected)}</span>
                  </div>
                  <div className="fund-stat">
                    <span className="fund-stat-label">Target</span>
                    <span className="fund-stat-value">{formatCurrency(fund.totalTarget)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="fund-progress">
                  <div className="fund-progress-bar" style={{ width: `${Math.min(progress, 100)}%`, background: catInfo.color }}></div>
                </div>
                <div className="fund-progress-info">
                  <span>{Math.round(progress)}% collected</span>
                  <span>Due: {new Date(fund.dueDate).toLocaleDateString('en-IN')}</span>
                </div>

                <div className="fund-meta-row">
                  <span>🏠 {fund.paidCount || 0}/{fund.totalFlats || 0} paid</span>
                  <span>⏳ {fund.pendingCount || 0} pending</span>
                </div>

                <div className="fund-actions">
                  {isAdmin && (
                    <button className="btn btn--sm btn--outline" onClick={() => viewFundDetail(fund)}>
                      📋 View Details
                    </button>
                  )}
                  {!isAdmin && myPayment && myPayment.status === 'pending' && (
                    <button className="btn btn--sm btn--primary" onClick={() => {
                      setSelectedFund(fund);
                      setPayForm({ amount: fund.amountPerFlat, paymentMethod: 'upi', transactionId: '', notes: '' });
                      setShowPayModal(true);
                    }}>
                      💰 Pay Now
                    </button>
                  )}
                  {!isAdmin && myPayment && myPayment.status === 'pending_verification' && (
                    <span className="status-badge status-badge--warning">⏳ Verification Pending</span>
                  )}
                  {!isAdmin && myPayment && myPayment.status === 'paid' && (
                    <span className="status-badge status-badge--paid">✅ Paid</span>
                  )}
                  {!isAdmin && myPayment && myPayment.status === 'rejected' && (
                    <button className="btn btn--sm btn--primary" onClick={() => {
                      setSelectedFund(fund);
                      setPayForm({ amount: fund.amountPerFlat, paymentMethod: 'upi', transactionId: '', notes: '' });
                      setShowPayModal(true);
                    }}>
                      🔄 Re-submit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Fund Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Fund">
        <form onSubmit={createFund} className="modal-form">
          <div className="form-group">
            <label>Fund Name *</label>
            <input type="text" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Diwali Festival Fund" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Purpose of this fund..." rows={2} style={{ width: '100%', resize: 'vertical' }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={createForm.category} onChange={e => setCreateForm({ ...createForm, category: e.target.value })}>
                {FUND_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Amount Per Flat (₹) *</label>
              <input type="number" min="1" value={createForm.amountPerFlat} onChange={e => setCreateForm({ ...createForm, amountPerFlat: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input type="date" value={createForm.dueDate} onChange={e => setCreateForm({ ...createForm, dueDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Applicable To</label>
              <select value={createForm.applicableTo} onChange={e => setCreateForm({ ...createForm, applicableTo: e.target.value })}>
                <option value="all">All Flats</option>
                <option value="specific_blocks">Specific Blocks</option>
              </select>
            </div>
          </div>
          {createForm.applicableTo === 'specific_blocks' && (
            <div className="form-group">
              <label>Select Blocks</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {blocks.map(b => (
                  <label key={b._id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '8px', background: createForm.applicableBlocks.includes(b._id) ? 'var(--primary-glow)' : 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    <input type="checkbox" checked={createForm.applicableBlocks.includes(b._id)}
                      onChange={e => {
                        if (e.target.checked) setCreateForm({ ...createForm, applicableBlocks: [...createForm.applicableBlocks, b._id] });
                        else setCreateForm({ ...createForm, applicableBlocks: createForm.applicableBlocks.filter(id => id !== b._id) });
                      }} />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? <span className="btn-spinner"></span> : 'Create Fund'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Pay Fund Modal (Member) */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title={`Pay: ${selectedFund?.name || 'Fund'}`}>
        <form onSubmit={submitFundPayment} className="modal-form">
          <div className="payment-info-box">
            <p><strong>Fund:</strong> {selectedFund?.name}</p>
            <p><strong>Amount:</strong> {formatCurrency(selectedFund?.amountPerFlat)}</p>
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" min="1" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={payForm.paymentMethod} onChange={e => setPayForm({ ...payForm, paymentMethod: e.target.value })}>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div className="form-group">
            <label>Transaction ID (Optional)</label>
            <input type="text" value={payForm.transactionId} onChange={e => setPayForm({ ...payForm, transactionId: e.target.value })} placeholder="UPI/Bank ref number" />
          </div>
          <div className="form-group">
            <label>Notes (Optional)</label>
            <input type="text" value={payForm.notes} onChange={e => setPayForm({ ...payForm, notes: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowPayModal(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? <span className="btn-spinner"></span> : 'Submit Payment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Fund Detail Modal (Admin) */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={fundDetail?.fund?.name || 'Fund Details'}>
        {fundDetail && (
          <div>
            <div className="payment-info-box" style={{ marginBottom: '1rem' }}>
              <p><strong>Target:</strong> {formatCurrency(fundDetail.fund.totalTarget)} | <strong>Collected:</strong> <span style={{ color: 'var(--success)' }}>{formatCurrency(fundDetail.totalCollected)}</span></p>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {fundDetail.payments?.map(fp => (
                <div key={fp._id} className="fund-detail-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid var(--border)', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ fontWeight: 600 }}>🏠 {fp.flatId?.number || 'N/A'}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{fp.flatId?.ownerName}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span className={`status-badge status-badge--${fp.status === 'paid' ? 'paid' : fp.status === 'pending_verification' ? 'warning' : fp.status === 'rejected' ? 'danger' : 'pending'}`}>
                      {fp.status === 'paid' ? '✅ Paid' : fp.status === 'pending_verification' ? '⏳ Verify' : fp.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {fp.status === 'pending_verification' && (
                      <>
                        <button className="btn btn--sm btn--success" onClick={() => reviewFundPayment(fp._id, 'paid')}>✅</button>
                        <button className="btn btn--sm btn--danger" onClick={() => reviewFundPayment(fp._id, 'rejected', 'Payment rejected')}>❌</button>
                      </>
                    )}
                    {(fp.status === 'pending' || fp.status === 'rejected') && (
                      <button className="btn btn--sm btn--outline" onClick={() => {
                        setSelectedFP(fp);
                        setManualForm({ paidAmount: fp.amount, paymentMethod: 'cash', notes: '' });
                        setShowManualModal(true);
                      }}>💰 Manual</button>
                    )}
                    {fp.status === 'paid' && <span style={{ color: 'var(--success)', fontWeight: 600 }}>{formatCurrency(fp.paidAmount)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Payment Modal (Admin) */}
      <Modal isOpen={showManualModal} onClose={() => setShowManualModal(false)} title="Manual Fund Payment">
        <form onSubmit={submitManualPayment} className="modal-form">
          <div className="payment-info-box">
            <p><strong>Flat:</strong> {selectedFP?.flatId?.number}</p>
            <p><strong>Amount Due:</strong> {formatCurrency(selectedFP?.amount)}</p>
          </div>
          <div className="form-group">
            <label>Paid Amount (₹)</label>
            <input type="number" min="1" value={manualForm.paidAmount} onChange={e => setManualForm({ ...manualForm, paidAmount: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={manualForm.paymentMethod} onChange={e => setManualForm({ ...manualForm, paymentMethod: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <input type="text" value={manualForm.notes} onChange={e => setManualForm({ ...manualForm, notes: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowManualModal(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? <span className="btn-spinner"></span> : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Funds;
