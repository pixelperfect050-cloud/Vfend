import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const SetupSociety = () => {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', state: '', pincode: '',
    maintenanceAmount: 3000, lateFeePerDay: 50, lateFeeAfterDays: 15, billingDay: 1
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/society', formData);
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (user?.societyId) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="page">
      <div className="setup-container">
        <div className="card setup-card">
          <div className="setup-header">
            <div className="setup-icon">🏘️</div>
            <h1>Setup Your Society</h1>
            <p>Let's get your society configured</p>
          </div>

          <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-group">
              <label htmlFor="soc-name">Society Name</label>
              <input type="text" id="soc-name" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sunrise Heights" required />
            </div>
            <div className="form-group">
              <label htmlFor="soc-address">Address</label>
              <input type="text" id="soc-address" value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address" required />
            </div>
            <div className="form-row form-row--3">
              <div className="form-group">
                <label htmlFor="soc-city">City</label>
                <input type="text" id="soc-city" value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="soc-state">State</label>
                <input type="text" id="soc-state" value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="soc-pin">Pincode</label>
                <input type="text" id="soc-pin" value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="soc-maintenance">Monthly Maintenance (₹)</label>
                <input type="number" id="soc-maintenance" value={formData.maintenanceAmount}
                  onChange={e => setFormData({ ...formData, maintenanceAmount: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label htmlFor="soc-billing">Billing Day</label>
                <input type="number" id="soc-billing" min="1" max="28" value={formData.billingDay}
                  onChange={e => setFormData({ ...formData, billingDay: parseInt(e.target.value) })} />
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={saving} id="setup-btn">
              {saving ? <span className="btn-spinner"></span> : '🚀 Setup Society'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupSociety;
