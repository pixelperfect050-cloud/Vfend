import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import api from '../utils/api';

const CATEGORIES = [
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'lift', label: 'Lift', icon: '🛗' },
  { value: 'security', label: 'Security', icon: '🛡️' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'gardening', label: 'Gardening', icon: '🌿' },
  { value: 'repairs', label: 'Repairs', icon: '🔨' },
  { value: 'water', label: 'Water', icon: '💧' },
  { value: 'misc', label: 'Miscellaneous', icon: '📦' }
];

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: 'electricity', description: '', amount: '', date: new Date().toISOString().split('T')[0], vendor: ''
  });
  const [saving, setSaving] = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const sid = user?.societyId?._id || user?.societyId;
      if (!sid) return;
      const data = await api.get(`/api/expenses/society/${sid}`);
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sid = user?.societyId?._id || user?.societyId;
      if (editingExpense) {
        await api.put(`/api/expenses/${editingExpense._id}`, formData);
      } else {
        await api.post('/api/expenses', { ...formData, societyId: sid });
      }
      setShowModal(false);
      setEditingExpense(null);
      setFormData({ category: 'electricity', description: '', amount: '', date: new Date().toISOString().split('T')[0], vendor: '' });
      fetchExpenses();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0],
      vendor: expense.vendor || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/api/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt || 0);

  const filtered = catFilter === 'all' ? expenses : expenses.filter(e => e.category === catFilter);
  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);

  const getCategoryInfo = (cat) => CATEGORIES.find(c => c.value === cat) || { icon: '📦', label: cat };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track society expenses</p>
        </div>
        {isAdmin && (
          <button className="btn btn--primary" onClick={() => { setEditingExpense(null); setShowModal(true); }} id="add-expense-btn">
            + Add Expense
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="category-pills">
        <button className={`pill ${catFilter === 'all' ? 'active' : ''}`} onClick={() => setCatFilter('all')}>All</button>
        {CATEGORIES.map(cat => (
          <button key={cat.value} className={`pill ${catFilter === cat.value ? 'active' : ''}`}
            onClick={() => setCatFilter(cat.value)}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="expense-total-bar">
        <span>Total: <strong>{formatCurrency(totalAmount)}</strong></span>
        <span>{filtered.length} expenses</span>
      </div>

      {/* Expense List */}
      <div className="expense-list">
        {filtered.map(expense => {
          const catInfo = getCategoryInfo(expense.category);
          return (
            <div key={expense._id} className="expense-card">
              <div className="expense-card__icon">{catInfo.icon}</div>
              <div className="expense-card__content">
                <div className="expense-card__title">{expense.description}</div>
                <div className="expense-card__meta">
                  <span className="expense-card__cat">{catInfo.label}</span>
                  <span>•</span>
                  <span>{new Date(expense.date).toLocaleDateString('en-IN')}</span>
                  {expense.vendor && <><span>•</span><span>{expense.vendor}</span></>}
                </div>
              </div>
              <div className="expense-card__amount">{formatCurrency(expense.amount)}</div>
              {isAdmin && (
                <div className="expense-card__actions">
                  <button className="btn btn--icon" onClick={() => handleEdit(expense)} title="Edit">✏️</button>
                  <button className="btn btn--icon btn--danger" onClick={() => handleDelete(expense._id)} title="Delete">🗑️</button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No expenses found</h2>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingExpense(null); }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="exp-cat">Category</label>
            <select id="exp-cat" value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="exp-desc">Description</label>
            <input type="text" id="exp-desc" value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Common area electricity bill" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exp-amount">Amount (₹)</label>
              <input type="number" id="exp-amount" min="1" value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="exp-date">Date</label>
              <input type="date" id="exp-date" value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="exp-vendor">Vendor (Optional)</label>
            <input type="text" id="exp-vendor" value={formData.vendor}
              onChange={e => setFormData({ ...formData, vendor: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? <span className="btn-spinner"></span> : (editingExpense ? 'Update' : 'Add Expense')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
