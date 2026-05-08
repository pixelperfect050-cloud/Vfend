import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPending, setSelectedPending] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/society/stats`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/payments/pending`)
      ]);
      setStats(statsRes.data);
      setPendingPayments(pendingRes.data);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Overview</p>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-secondary font-medium">Welcome back, {user?.name}</p>
      </header>

      {/* Admin Action Alerts */}
      {isAdmin && stats?.pendingVerifications > 0 && (
        <div className="card bg-indigo-600 text-white border-none shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold opacity-90 mb-1">Verification Required</p>
              <h3 className="text-xl font-black">{stats.pendingVerifications} payments waiting</h3>
            </div>
            <Link to="/verify-payments" className="btn bg-white text-indigo-600 px-6 py-3 rounded-xl font-black shadow-xl shadow-indigo-900/20 active:scale-95 transition-transform">
              Review
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid - Premium Layout */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Collection</span>
            <span className="stat-value">{formatCurrency(stats?.totalCollection)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>📉</div>
          <div className="stat-info">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value">{formatCurrency(stats?.totalExpenses)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>💎</div>
          <div className="stat-info">
            <span className="stat-label">Net Balance</span>
            <span className="stat-value">{formatCurrency(stats?.balance)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>📅</div>
          <div className="stat-info">
            <span className="stat-label">This Month</span>
            <span className="stat-value">{formatCurrency(stats?.thisMonthCollection)}</span>
          </div>
        </div>
      </div>

      {/* Funds Progress */}
      <div className="section-header">
        <h2 className="section-title">Active Fund Targets</h2>
        <Link to="/funds" className="text-sm font-bold text-primary">View All</Link>
      </div>

      <div className="grid-2">
        {stats?.activeFunds?.map(fund => {
          const progress = (fund.collectedAmount / fund.targetAmount) * 100;
          return (
            <div key={fund._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-slate-900">{fund.name}</h3>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{fund.category}</p>
                </div>
                <span className={`status-badge ${progress >= 100 ? 'status-badge--success' : 'status-badge--warning'}`}>
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase">Collected</p>
                  <p className="font-black text-indigo-600">{formatCurrency(fund.collectedAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-secondary uppercase">Target</p>
                  <p className="font-bold text-slate-900">{formatCurrency(fund.targetAmount)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Tasks / Quick Actions */}
      <div className="section-header">
        <h2 className="section-title">Pending Payments</h2>
      </div>

      <div className="space-y-4">
        {pendingPayments.length > 0 ? (
          pendingPayments.slice(0, 3).map(pay => (
            <div key={pay._id} className="card card--interactive flex items-center justify-between p-5 border-l-4 border-l-amber-400">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⏳</div>
                <div>
                  <h3 className="font-black text-slate-900">Maintenance • Flat {pay.flatId?.number}</h3>
                  <p className="text-xs font-bold text-secondary">{pay.month}/{pay.year} • {formatCurrency(pay.amount)}</p>
                </div>
              </div>
              <button 
                className="btn btn--secondary btn--sm py-2 px-4 rounded-xl text-xs"
                onClick={() => { setSelectedPending(pay); setShowPayModal(true); }}
              >
                Pay Now
              </button>
            </div>
          ))
        ) : (
          <div className="card text-center py-10">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-black text-slate-900">All clear!</p>
            <p className="text-xs text-secondary font-bold">No pending maintenance payments found.</p>
          </div>
        )}
      </div>

      {/* Pay Modal - Simplified for Mobile */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Quick Payment">
        {selectedPending && (
          <div className="p-4">
            <div className="bg-slate-50 rounded-2xl p-6 mb-6 text-center">
              <p className="text-xs font-black text-secondary uppercase tracking-widest mb-2">Total Amount Due</p>
              <h2 className="text-3xl font-black text-indigo-600">{formatCurrency(selectedPending.amount)}</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Maintenance for {selectedPending.month}/{selectedPending.year}</p>
            </div>

            <div className="space-y-4">
              <div className="card border-primary bg-primary-light/30">
                <p className="text-[10px] font-black text-primary uppercase mb-3">Choose Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl flex flex-col items-center gap-2">
                    <span className="text-xl">📱</span>
                    <span className="text-[10px] font-black uppercase">UPI App</span>
                  </button>
                  <button className="btn bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl flex flex-col items-center gap-2">
                    <span className="text-xl">🏦</span>
                    <span className="text-[10px] font-black uppercase">Bank Trf</span>
                  </button>
                </div>
              </div>

              <button className="btn btn--primary btn--full py-5 rounded-2xl shadow-xl">
                CONTINUE TO PAYMENT
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
