import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const YEARS = [2024, 2025, 2026];

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/society/report`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setData(res.data);
    } catch (err) {
      console.error('Fetch report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amt || 0);
  };

  if (loading && !data) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Financials</p>
        <h1 className="page-title">Accounts Report</h1>
        <p className="text-secondary font-medium">Monthly statement of income and expenses</p>
      </header>

      {/* Modern Filter Selection */}
      <div className="card mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group mb-0">
            <label className="form-label">Report Month</label>
            <select className="form-input" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Report Year</label>
            <select className="form-input" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="card bg-slate-900 text-white border-none p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Net Surplus / Deficit</span>
              <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">📊</span>
            </div>
            <h2 className={`text-4xl font-black ${data?.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(data?.netBalance)}
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-2">Statement for {MONTHS[selectedMonth-1]} {selectedYear}</p>
          </div>
        </div>

        <div className="grid-2">
           <div className="card p-6 border-l-4 border-l-emerald-500">
             <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl mb-4">📥</div>
             <p className="text-[10px] font-black text-secondary uppercase mb-1">Total Income</p>
             <h3 className="text-xl font-black text-emerald-600">{formatCurrency(data?.totalIncome)}</h3>
           </div>
           <div className="card p-6 border-l-4 border-l-rose-500">
             <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-xl mb-4">📤</div>
             <p className="text-[10px] font-black text-secondary uppercase mb-1">Total Expenses</p>
             <h3 className="text-xl font-black text-rose-500">{formatCurrency(data?.totalExpenses)}</h3>
           </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="section-header">
        <h2 className="section-title">Expense Breakdown</h2>
        <span className="text-xs font-black text-secondary">{data?.expensesByCategory?.length || 0} Categories</span>
      </div>

      <div className="space-y-4">
        {data?.expensesByCategory?.map((cat, i) => (
          <div key={i} className="card p-5 group hover:border-indigo-200 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  {cat._id.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{cat._id}</h3>
                  <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${(cat.total / data.totalExpenses) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">{formatCurrency(cat.total)}</p>
                <p className="text-[9px] font-black text-secondary uppercase">
                  {Math.round((cat.total / data.totalExpenses) * 100)}% of total
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {(!data?.expensesByCategory || data.expensesByCategory.length === 0) && (
          <div className="card text-center py-12">
            <p className="text-secondary font-bold italic">No expenses recorded for this period.</p>
          </div>
        )}
      </div>

      {/* Quick Action Button */}
      <div className="mt-10">
        <button className="btn btn--primary btn--full py-5 rounded-2xl shadow-2xl">
          📥 DOWNLOAD PDF STATEMENT
        </button>
      </div>
    </div>
  );
};

export default Reports;
