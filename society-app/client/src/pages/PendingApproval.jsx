import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const { user, logout, loadUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      loadUser();
    }, 10000);

    if (user?.status === 'approved') {
      navigate('/dashboard');
    }

    return () => clearInterval(interval);
  }, [user, navigate, loadUser]);

  return (
    <div className="auth-page bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[500px]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-premium mx-auto flex items-center justify-center text-4xl mb-6 border border-slate-100">⏳</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Approval Pending</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Verification in progress</p>
        </div>

        <div className="card p-10 bg-white shadow-premium border-none rounded-[2.5rem] text-center">
          <div className="mb-8">
            <p className="text-slate-600 font-medium leading-relaxed">
              Your request to join <span className="text-indigo-600 font-black">{user?.societyId?.name || 'the society'}</span> is currently waiting for administrator review.
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-8 text-left">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Your Application Details</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">Unit Number</span>
                <span className="font-black text-slate-700">Flat {user?.flatId?.number || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">Resident Type</span>
                <span className="font-black text-slate-700 uppercase">{user?.residentType}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={logout} className="btn btn--secondary flex-1 py-4 rounded-2xl">Logout</button>
            <button onClick={loadUser} className="btn btn--primary flex-1 py-4 rounded-2xl shadow-lg">Refresh Status</button>
          </div>

          <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
            Security verification usually takes 24-48 hours.<br />Please contact the society office for urgent access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
