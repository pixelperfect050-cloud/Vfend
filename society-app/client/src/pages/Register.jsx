import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/setup');
    } catch (err) {
      // error set in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-shape shape-1"></div>
        <div className="auth-bg-shape shape-2"></div>
        <div className="auth-bg-shape shape-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🏘️</div>
            <h1 className="auth-title">SocietySync</h1>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="form-title">Create Account</h2>
            <p className="form-subtitle">Get started with SocietySync</p>

            {(error || formError) && <div className="alert alert--error">{formError || error}</div>}

            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input type="text" id="reg-name" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Enter your full name" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input type="email" id="reg-email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Enter your email" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input type="tel" id="reg-phone" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="Enter your phone" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input type="password" id="reg-password" name="password" value={formData.password}
                    onChange={handleChange} placeholder="Min 6 chars" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reg-confirm">Confirm</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input type="password" id="reg-confirm" name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} placeholder="Confirm" required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={loading} id="register-btn">
              {loading ? <span className="btn-spinner"></span> : 'Create Account'}
            </button>

            <p className="auth-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
