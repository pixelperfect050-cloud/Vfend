import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SetupSociety = () => {
  const [formData, setFormData] = useState({
    name: '', address: '', maintenanceAmount: 3000, billingDay: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/society/setup`, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup society');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[540px]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-premium mx-auto flex items-center justify-center text-3xl mb-4 border border-slate-100">🏗️</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Society Setup</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Configuration</p>
        </div>

        <div className="card p-10 bg-white shadow-premium border-none rounded-[2.5rem]">
          <div className="mb-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">Getting Started</h2>
            <p className="text-xs text-indigo-400 font-medium leading-relaxed">Register your society to begin managing residents, billing, and expenses efficiently.</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100">
                {error}
              </div>
            )}

            <div className="form-group mb-0">
              <label className="form-label">Society Registered Name</label>
              <input type="text" className="form-input" placeholder="e.g. Green Valley Apartments" required
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Official Address</label>
              <textarea className="form-input" rows={2} placeholder="Full postal address" required
                value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label">Base Maintenance (₹)</label>
                <input type="number" className="form-input" placeholder="3000" required
                  value={formData.maintenanceAmount} onChange={(e) => setFormData({ ...formData, maintenanceAmount: Number(e.target.value) })} />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Billing Day</label>
                <input type="number" className="form-input" min="1" max="28" required
                  value={formData.billingDay} onChange={(e) => setFormData({ ...formData, billingDay: Number(e.target.value) })} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn--primary btn--full py-5 rounded-2xl shadow-xl mt-4">
              {loading ? 'Registering...' : 'Complete Registration 🚀'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupSociety;
