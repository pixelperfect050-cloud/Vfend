import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Maintenance', date: new Date().toISOString().split('T')[0], description: ''
  });

  const categories = ['All', 'Electricity', 'Water', 'Security', 'Cleaning', 'Maintenance', 'Plumbing', 'Gardening', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error('Fetch expenses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/expenses`, formData);
      setShowModal(false);
      fetchExpenses();
      setFormData({ title: '', amount: '', category: 'Maintenance', date: new Date().toISOString().split('T')[0], description: '' });
    } catch (err) {
      alert('Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amt || 0);
  };

  const filteredExpenses = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Accounts</p>
        <h1 className="page-title">Expenses</h1>
        <p className="text-secondary font-medium">Track and manage society spending</p>
      </header>

      <button onClick={() => setShowModal(true)} className="btn btn--primary btn--full shadow-xl mb-8">
        ➕ Add New Expense
      </button>

      {/* Modern Filter Tabs */}
      <div className="card mb-8">
        <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">Filter by Category</p>
        <div className="filter-tabs">
          {categories.map(c => (
            <button 
              key={c} 
              className={`filter-tab ${filter === c ? 'active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="card bg-slate-900 text-white border-none shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Total {filter} Expenses</p>
            <h2 className="text-3xl font-black text-white">{formatCurrency(totalAmount)}</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1">{filteredExpenses.length} Transactions</p>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">📉</div>
        </div>
      </div>

      {/* Expense List */}
      <div className="section-header">
        <h2 className="section-title">Expense History</h2>
      </div>

      <div className="space-y-4">
        {filteredExpenses.map(exp => (
          <div key={exp._id} className="card p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                  {exp.category === 'Electricity' ? '⚡' : exp.category === 'Water' ? '💧' : '📋'}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 truncate max-w-[150px]">{exp.title}</h3>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{exp.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-rose-500 text-lg">{formatCurrency(exp.amount)}</p>
                <p className="text-[10px] font-bold text-secondary">{new Date(exp.date).toLocaleDateString()}</p>
              </div>
            </div>
            {exp.description && (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                {exp.description}
              </p>
            )}
            <div className="mt-4 flex gap-3">
              <button className="btn btn--secondary flex-1 py-2 text-xs">✏️ Edit</button>
              <button className="btn bg-rose-50 text-rose-500 border border-rose-100 flex-1 py-2 text-xs">🗑️ Delete</button>
            </div>
          </div>
        ))}

        {filteredExpenses.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">📂</div>
            <p className="font-black text-slate-900">No expenses recorded</p>
            <p className="text-xs text-secondary font-bold">Start tracking by adding your first expense.</p>
          </div>
        )}
      </div>

      {/* Modern Expense Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Expense">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="form-group">
            <label className="form-label">Expense Title</label>
            <input type="text" className="form-input" placeholder="e.g. Electricity Bill Mar" required
              value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input type="number" className="form-input" placeholder="0.00" required
                value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" required
              value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea className="form-input" rows={3} placeholder="Additional details..."
              value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn--secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn--primary flex-1">
              {saving ? 'Saving...' : '💾 Save Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
