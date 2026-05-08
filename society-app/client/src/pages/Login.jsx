import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // error is handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[440px]">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-premium mx-auto flex items-center justify-center text-3xl mb-4 border border-slate-100">🏘️</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">SocietySync</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Resident Portal</p>
        </div>

        <div className="card p-10 bg-white shadow-premium border-none rounded-[2.5rem]">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-sm font-bold text-slate-400">Sign in to manage your home and stay updated with your society.</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6 border border-rose-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group mb-0">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn--primary btn--full py-5 rounded-2xl shadow-xl">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm font-bold text-slate-400">
                New resident? <Link to="/register" className="text-indigo-600 font-black hover:underline">Create Account</Link>
              </p>
            </div>
          </form>

          {/* Quick Access Info */}
          <div className="mt-10 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">🔑 DEMO CREDENTIALS</p>
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500">ADMIN: <span className="text-indigo-600 font-black select-all">admin@society.com</span> / admin123</p>
              <p className="text-[10px] font-bold text-slate-500">MEMBER: <span className="text-indigo-600 font-black select-all">member1@society.com</span> / member123</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/join" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">🏠 Join a New Society</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
