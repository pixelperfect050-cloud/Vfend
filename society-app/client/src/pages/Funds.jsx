import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const Funds = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', targetAmount: '', category: 'Maintenance', description: '', deadline: ''
  });

  const categories = ['Maintenance', 'Festival', 'Emergency', 'Improvement', 'Legal', 'Cultural', 'Other'];

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/funds`);
      setFunds(res.data);
    } catch (err) {
      console.error('Fetch funds error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/funds`, formData);
      setShowModal(false);
      fetchFunds();
      setFormData({ name: '', targetAmount: '', category: 'Maintenance', description: '', deadline: '' });
    } catch (err) {
      alert('Failed to create fund');
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
        <p className="page-subtitle uppercase tracking-widest mb-1">Collections</p>
        <h1 className="page-title">Society Funds</h1>
        <p className="text-secondary font-medium">Manage special collections and fund targets</p>
      </header>

      <button onClick={() => setShowModal(true)} className="btn btn--primary btn--full shadow-xl mb-8">
        ➕ Create New Fund
      </button>

      {/* Fund Grid */}
      <div className="flex flex-col gap-6">
        {funds.map(fund => {
          const progress = (fund.collectedAmount / fund.targetAmount) * 100;
          const isOverdue = fund.deadline && new Date(fund.deadline) < new Date();
          
          return (
            <div key={fund._id} className="card card--interactive p-6 overflow-hidden">
              {/* Overdue Badge */}
              {isOverdue && progress < 100 && (
                <div className="absolute top-4 right-[-30px] rotate-45 bg-rose-500 text-white text-[8px] font-black px-10 py-1 uppercase tracking-tighter shadow-lg">
                  Overdue
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-sm">
                    {fund.category === 'Festival' ? '🎡' : fund.category === 'Emergency' ? '🚨' : '🏦'}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{fund.name}</h3>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{fund.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`status-badge ${progress >= 100 ? 'status-badge--success' : 'status-badge--warning'}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              {/* Progress System */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] font-black text-secondary uppercase">Progress</p>
                  <p className="text-sm font-black text-indigo-600">
                    {formatCurrency(fund.collectedAmount)} <span className="text-slate-400 font-bold text-[10px]">/ {formatCurrency(fund.targetAmount)}</span>
                  </p>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-secondary uppercase mb-1">Target</p>
                  <p className="font-black text-slate-900">{formatCurrency(fund.targetAmount)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-secondary uppercase mb-1">Deadline</p>
                  <p className="font-black text-slate-900">
                    {fund.deadline ? new Date(fund.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No Limit'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn btn--secondary flex-1 py-3 text-xs">📊 Breakdown</button>
                <button className="btn btn--primary flex-1 py-3 text-xs">💳 Contribute</button>
              </div>
            </div>
          );
        })}

        {funds.length === 0 && (
          <div className="card text-center py-20">
            <div className="text-6xl mb-6">🏦</div>
            <h2 className="text-xl font-black mb-2">No Active Funds</h2>
            <p className="text-secondary font-medium">Create a fund to start collecting special contributions.</p>
          </div>
        )}
      </div>

      {/* Modern Fund Creation Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Special Fund">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="form-group">
            <label className="form-label">Fund Name</label>
            <input type="text" className="form-input" placeholder="e.g. Navratri 2024" required
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Target Amount</label>
              <input type="number" className="form-input" placeholder="0.00" required
                value={formData.targetAmount} onChange={e => setFormData({ ...formData, targetAmount: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Deadline (Optional)</label>
            <input type="date" className="form-input"
              value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} placeholder="Purpose of this collection..."
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn--secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn--primary flex-1">
              {saving ? 'Creating...' : '🚀 Create Fund'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Funds;
