import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const JoinSociety = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [residentType, setResidentType] = useState('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/society/join`, { inviteCode, residentType });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join society');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-premium mx-auto flex items-center justify-center text-3xl mb-4 border border-slate-100">🏘️</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Join Society</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Connect with your home</p>
        </div>

        <div className="card p-10 bg-white shadow-premium border-none rounded-[2.5rem]">
          <form onSubmit={handleJoin} className="space-y-8">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100">
                {error}
              </div>
            )}

            <div className="form-group mb-0">
              <label className="form-label">Society Invite Code</label>
              <input 
                type="text" 
                className="form-input text-center text-2xl font-black tracking-widest uppercase placeholder:text-slate-200" 
                placeholder="ABCXYZ" 
                maxLength="6"
                required
                value={inviteCode} 
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())} 
              />
              <p className="text-[10px] text-center font-bold text-slate-400 mt-3 uppercase">Ask your society admin for the 6-digit code</p>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Resident Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setResidentType('owner')}
                  className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${residentType === 'owner' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Owner
                </button>
                <button 
                  type="button" 
                  onClick={() => setResidentType('tenant')}
                  className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${residentType === 'tenant' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Tenant
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn--primary btn--full py-5 rounded-2xl shadow-xl">
              {loading ? 'Joining...' : 'Link My Apartment'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs font-bold text-slate-400 mb-4">Are you a society administrator?</p>
            <Link to="/setup-society" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
              ✨ Register New Society
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSociety;
