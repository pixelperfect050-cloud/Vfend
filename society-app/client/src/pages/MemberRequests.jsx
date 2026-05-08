import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MemberRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/society/${user.societyId._id}/members?status=${filter}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, status) => {
    setProcessing(userId);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/society/member/${userId}/status`, { status });
      setRequests(requests.filter(r => r._id !== userId));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setProcessing(userId);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/society/member/${userId}`);
      setRequests(requests.filter(r => r._id !== userId));
    } catch (err) {
      alert('Failed to delete member');
    } finally {
      setProcessing(null);
    }
  };

  if (loading && requests.length === 0) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="animate-up">
      <header className="mb-8">
        <p className="page-subtitle uppercase tracking-widest mb-1">Residents</p>
        <h1 className="page-title">Member Requests</h1>
        <p className="text-secondary font-medium">Manage access and verify registrations</p>
      </header>

      {/* Filter Tabs */}
      <div className="card mb-8">
        <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">Verification Status</p>
        <div className="filter-tabs">
          {[
            { id: 'pending', label: '⏳ Pending' },
            { id: 'approved', label: '✅ Active' },
            { id: 'rejected', label: '❌ Rejected' },
            { id: 'suspended', label: '🚫 Suspended' }
          ].map(t => (
            <button key={t.id}
              className={`filter-tab ${filter === t.id ? 'active' : ''}`}
              onClick={() => setFilter(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <div key={req._id} className="card p-6">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl shrink-0">
                {req.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-black text-slate-900 truncate">{req.name}</h3>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">{req.residentType}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-600 px-2 py-0.5 rounded bg-indigo-50">Unit {req.flatId?.number || 'TBD'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex justify-between items-center text-xs">
                 <span className="font-bold text-secondary uppercase">Email</span>
                 <span className="font-black text-slate-700">{req.email}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-bold text-secondary uppercase">Phone</span>
                 <span className="font-black text-slate-700">{req.phone}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-bold text-secondary uppercase">Joined</span>
                 <span className="font-black text-slate-700">{new Date(req.createdAt).toLocaleDateString()}</span>
               </div>
            </div>

            <div className="flex gap-3">
              {filter === 'pending' && (
                <>
                  <button className="btn btn--primary flex-1 py-3 text-xs" 
                    onClick={() => handleAction(req._id, 'approved')} disabled={processing === req._id}>
                    {processing === req._id ? '...' : 'Approve'}
                  </button>
                  <button className="btn btn--secondary flex-1 py-3 text-xs text-rose-500" 
                    onClick={() => handleAction(req._id, 'rejected')} disabled={processing === req._id}>
                    Reject
                  </button>
                </>
              )}
              {filter === 'approved' && (
                <button className="btn btn--secondary w-full py-3 text-xs" 
                  onClick={() => handleAction(req._id, 'suspended')} disabled={processing === req._id}>
                  Suspend Member
                </button>
              )}
              {(filter === 'rejected' || filter === 'suspended') && (
                <>
                  <button className="btn btn--primary flex-1 py-3 text-xs" 
                    onClick={() => handleAction(req._id, 'approved')} disabled={processing === req._id}>
                    Restore
                  </button>
                  <button className="btn btn--secondary flex-1 py-3 text-xs text-rose-500" 
                    onClick={() => handleDelete(req._id)} disabled={processing === req._id}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {requests.length === 0 && !loading && (
          <div className="card text-center py-20">
            <div className="text-6xl mb-6">👥</div>
            <h2 className="text-xl font-black mb-2">No {filter} members</h2>
            <p className="text-secondary font-medium">Member list for this category is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRequests;
