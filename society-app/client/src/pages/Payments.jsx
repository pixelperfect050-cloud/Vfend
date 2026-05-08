import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState({ collected: 0, pending: 0, records: 0 });

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const YEARS = [2024, 2025, 2026];

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, selectedYear]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/payments`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setPayments(res.data);
      
      const s = res.data.reduce((acc, p) => {
        acc.records++;
        if (p.status === 'paid') acc.collected += p.paidAmount;
        else if (p.status === 'partial') acc.collected += p.paidAmount;
        else acc.pending += p.amount;
        return acc;
      }, { collected: 0, pending: 0, records: 0 });
      setStats(s);
    } catch (err) {
      console.error('Fetch payments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/generate`, {
        month: selectedMonth,
        year: selectedYear
      });
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amt || 0);
  };

  const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  if (loading && payments.length === 0) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Billing</p>
        <h1 className="page-title">Maintenance</h1>
        <p className="text-secondary font-medium">Manage and track society bills</p>
      </header>

      {/* Admin Quick Actions */}
      {user?.role === 'admin' && (
        <div className="grid-2 mb-8">
          <button onClick={handleGenerate} disabled={generating} className="btn btn--primary shadow-xl">
            {generating ? '⚙️ Generating...' : '⚡ Generate Bills'}
          </button>
          <button className="btn btn--secondary">
            ➕ Manual Entry
          </button>
        </div>
      )}

      {/* Modern Stats Summary */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>📈</div>
          <div className="stat-info">
            <span className="stat-label">Collected</span>
            <span className="stat-value text-emerald-600">{formatCurrency(stats.collected)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>📉</div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value text-rose-600">{formatCurrency(stats.pending)}</span>
          </div>
        </div>
      </div>

      {/* Filter & Selection Bar */}
      <div className="card mb-8">
        <div className="grid-2 gap-4 mb-6">
          <div className="form-group mb-0">
            <label className="form-label">Month</label>
            <select className="form-input" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Year</label>
            <select className="form-input" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="filter-tabs">
          {['all', 'paid', 'pending', 'partial'].map(t => (
            <button 
              key={t} 
              className={`filter-tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Cards List (Mobile Optimized) */}
      <div className="section-header">
        <h2 className="section-title">Maintenance Records</h2>
        <span className="text-xs font-black text-secondary">{filteredPayments.length} Items</span>
      </div>

      <div className="flex flex-col gap-4">
        {filteredPayments.map(pay => (
          <div key={pay._id} className="card card--interactive p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
                  🏠
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Flat {pay.flatId?.number}</h3>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    {pay.flatId?.ownerName || 'Unknown Owner'}
                  </p>
                </div>
              </div>
              <span className={`status-badge status-badge--${pay.status}`}>
                {pay.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-black text-secondary uppercase mb-1">Amount Due</p>
                <p className="font-black text-slate-900">{formatCurrency(pay.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-secondary uppercase mb-1">Paid Amount</p>
                <p className="font-black text-emerald-600">{formatCurrency(pay.paidAmount)}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="btn btn--secondary flex-1 py-3 text-xs">
                📄 View Bill
              </button>
              <button className="btn btn--primary flex-1 py-3 text-xs">
                💰 Record
              </button>
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">🌫️</div>
            <p className="font-black text-slate-900">No records found</p>
            <p className="text-xs text-secondary font-bold">Try changing filters or select a different month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
