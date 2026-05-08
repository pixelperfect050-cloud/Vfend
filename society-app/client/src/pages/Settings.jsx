import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { user, loadUser } = useAuth();
  const [societyForm, setSocietyForm] = useState({
    name: user?.societyId?.name || '',
    address: user?.societyId?.address || '',
    maintenanceAmount: user?.societyId?.maintenanceAmount || 3000,
    lateFeePerDay: user?.societyId?.lateFeePerDay || 50,
    lateFeeAfterDays: user?.societyId?.lateFeeAfterDays || 15,
    billingDay: user?.societyId?.billingDay || 1,
    contactNumber: user?.societyId?.contactNumber || '',
    upiId: user?.societyId?.upiId || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const sid = user?.societyId?._id || user?.societyId;
      await axios.put(`${import.meta.env.VITE_API_URL}/api/society/${sid}`, societyForm);
      setMessage('Settings saved successfully!');
      loadUser();
    } catch (err) {
      setMessage('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const sid = user?.societyId?._id || user?.societyId;
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await axios.put(`${import.meta.env.VITE_API_URL}/api/society/${sid}`, { inviteCode: code });
      loadUser();
    } catch (err) {
      alert('Failed to generate code');
    }
  };

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Configuration</p>
        <h1 className="page-title">Settings</h1>
        <p className="text-secondary font-medium">Manage your society parameters and access</p>
      </header>

      <div className="space-y-8">
        {/* Invite Code Card */}
        {user?.role === 'admin' && (
          <div className="card bg-slate-900 text-white border-none p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Registration & Onboarding</p>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-black mb-2">Society Invite Code</h2>
                <p className="text-xs text-slate-400 font-medium">Share this unique code with residents so they can join your society portal instantly.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[180px]">
                {user?.societyId?.inviteCode ? (
                  <>
                    <p className="text-3xl font-black tracking-[0.2em] mb-4 text-indigo-300">{user.societyId.inviteCode}</p>
                    <button onClick={() => {
                      navigator.clipboard.writeText(user.societyId.inviteCode);
                      alert('Code copied!');
                    }} className="btn btn--secondary btn--full py-2.5 text-[10px]">📋 COPY CODE</button>
                  </>
                ) : (
                  <button onClick={handleGenerateCode} className="btn btn--primary btn--full py-3">GENERATE CODE</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-sm">🏢</div>
            <h3 className="text-lg font-black text-slate-900">General Information</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-black ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {message.includes('success') ? '✅' : '⚠️'} {message}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Society Display Name</label>
              <input type="text" className="form-input" required
                value={societyForm.name} onChange={e => setSocietyForm({ ...societyForm, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Full Address</label>
              <textarea className="form-input" rows={2} required
                value={societyForm.address} onChange={e => setSocietyForm({ ...societyForm, address: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Billing Day</label>
                <input type="number" className="form-input" min="1" max="28"
                  value={societyForm.billingDay} onChange={e => setSocietyForm({ ...societyForm, billingDay: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Maintenance (₹)</label>
                <input type="number" className="form-input"
                  value={societyForm.maintenanceAmount} onChange={e => setSocietyForm({ ...societyForm, maintenanceAmount: Number(e.target.value) })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="form-group">
                 <label className="form-label">Late Fee (₹/Day)</label>
                 <input type="number" className="form-input"
                   value={societyForm.lateFeePerDay} onChange={e => setSocietyForm({ ...societyForm, lateFeePerDay: Number(e.target.value) })} />
               </div>
               <div className="form-group">
                 <label className="form-label">Grace Period (Days)</label>
                 <input type="number" className="form-input"
                   value={societyForm.lateFeeAfterDays} onChange={e => setSocietyForm({ ...societyForm, lateFeeAfterDays: Number(e.target.value) })} />
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-sm">📱</div>
                 <h3 className="text-lg font-black text-slate-900">Payment & Contact</h3>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="form-group">
                   <label className="form-label">Support Contact</label>
                   <input type="text" className="form-input" placeholder="9876543210"
                     value={societyForm.contactNumber} onChange={e => setSocietyForm({ ...societyForm, contactNumber: e.target.value })} />
                 </div>
                 <div className="form-group">
                   <label className="form-label">Society UPI ID</label>
                   <input type="text" className="form-input" placeholder="society@upi"
                     value={societyForm.upiId} onChange={e => setSocietyForm({ ...societyForm, upiId: e.target.value })} />
                 </div>
               </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn--primary btn--full py-4 rounded-2xl shadow-xl">
              {saving ? 'Saving...' : '💾 SAVE ALL CHANGES'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
