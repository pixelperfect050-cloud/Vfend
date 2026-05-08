import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/join');
    } catch (err) {
      // error is handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Create Account</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Start your journey</p>
        </div>

        <div className="card p-10 bg-white shadow-premium border-none rounded-[2.5rem]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100">
                {error}
              </div>
            )}

            <div className="form-group mb-0">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="John Doe" required
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="name@example.com" required
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="9876543210" required
                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" required
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="btn btn--primary btn--full py-5 rounded-2xl shadow-xl mt-4">
              {loading ? 'Creating Account...' : 'Continue to Society Setup'}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm font-bold text-slate-400">
                Already have an account? <Link to="/login" className="text-indigo-600 font-black hover:underline">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
