import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ReminderSettings from '../components/ReminderSettings';

const Settings = () => {
  const { user, loadUser } = useAuth();
  const [society, setSociety] = useState(null);
  const [loadingSociety, setLoadingSociety] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('fixed');
  const [upgrading, setUpgrading] = useState(false);
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

  const fetchSocietyDetails = async () => {
    try {
      const sid = user?.societyId?._id || user?.societyId;
      if (sid) {
        const data = await api.get(`/api/society/${sid}`);
        setSociety(data);
      }
    } catch (err) {
      console.error('Failed to fetch society:', err);
    } finally {
      setLoadingSociety(false);
    }
  };

  useEffect(() => {
    fetchSocietyDetails();
  }, [user]);

  const getPricing = (total) => {
    let sizeGroup = 'Small';
    let fixedAnnual = 4999;
    let fixedMonthly = 416;
    let perFlatAnnualRate = 120;
    let perFlatMonthlyRate = 10;

    if (total <= 50) {
      sizeGroup = 'Small (20-50 Flats)';
      fixedAnnual = 4999;
      fixedMonthly = 416;
      perFlatAnnualRate = 120;
      perFlatMonthlyRate = 10;
    } else if (total <= 120) {
      sizeGroup = 'Medium (51-120 Flats)';
      fixedAnnual = 7999;
      fixedMonthly = 666;
      perFlatAnnualRate = 144;
      perFlatMonthlyRate = 12;
    } else if (total <= 250) {
      sizeGroup = 'Large (121-250 Flats)';
      fixedAnnual = 13999;
      fixedMonthly = 1166;
      perFlatAnnualRate = 120;
      perFlatMonthlyRate = 10;
    } else {
      sizeGroup = 'Mega (250+ Flats)';
      fixedAnnual = 19999;
      fixedMonthly = 1666;
      perFlatAnnualRate = 96;
      perFlatMonthlyRate = 8;
    }

    return {
      sizeGroup,
      fixedAnnual,
      fixedMonthly,
      perFlatAnnualRate,
      perFlatMonthlyRate,
      totalPerFlatAnnual: total * perFlatAnnualRate
    };
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        return;
      }

      const total = society?.totalFlats || 54;
      const pricing = getPricing(total);
      const planAmount = selectedPlan === 'fixed' ? pricing.fixedAnnual : pricing.totalPerFlatAnnual;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_SomWJwwuGM6Xet',
        amount: planAmount * 100, // in paise
        currency: 'INR',
        name: 'SocietySync Premium',
        description: `${selectedPlan === 'fixed' ? 'Fixed Annual Plan' : 'Per-Flat Annual Plan'} - ${total} Flats`,
        image: 'https://cdn-icons-png.flaticon.com/512/1040/1040993.png',
        handler: async function (response) {
          try {
            const sid = user?.societyId?._id || user?.societyId;
            await api.put(`/api/society/${sid}`, {
              subscriptionTier: 'premium',
              subscriptionPlan: selectedPlan,
              subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              razorpayPaymentId: response.razorpay_payment_id
            });
            alert('🎉 Congratulation! Your society has successfully upgraded to SocietySync Premium!');
            loadUser();
            fetchSocietyDetails();
          } catch (err) {
            alert('Error updating subscription status: ' + err.message);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#4338ca'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert('Checkout error: ' + err.message);
    } finally {
      setUpgrading(false);
    }
  };

  const getTrialDaysLeft = () => {
    if (!society) return 30;
    const createdAtTime = new Date(society.createdAt).getTime();
    const expiryTime = society.trialExpiry ? new Date(society.trialExpiry).getTime() : createdAtTime + 30 * 24 * 60 * 60 * 1000;
    const diff = expiryTime - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const sid = user?.societyId?._id || user?.societyId;
      await api.put(`/api/society/${sid}`, societyForm);
      setMessage('Settings saved successfully!');
      loadUser();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const sid = user?.societyId?._id || user?.societyId;
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      await api.put(`/api/society/${sid}`, { inviteCode: code });
      loadUser();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage society settings</p>
        </div>
        {user?.role === 'admin' && (
          <div className="invite-box" style={{ 
            background: 'var(--primary-glow)', 
            padding: '1rem', 
            borderRadius: '12px',
            border: '1px solid var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 'bold' }}>SOCIETY INVITE CODE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {user?.societyId?.inviteCode ? (
                <>
                  <span style={{ fontSize: '1.3rem', fontWeight: '900', letterSpacing: '0.1rem', wordBreak: 'break-all' }}>{user.societyId.inviteCode}</span>
                  <button className="btn btn--primary btn--sm" onClick={() => {
                    const link = `${window.location.origin}/join/${user.societyId.inviteCode}`;
                    navigator.clipboard.writeText(link);
                    alert('Invite link copied to clipboard!');
                  }}>🔗 Copy Link</button>
                </>
              ) : (
                <button className="btn btn--primary btn--sm" onClick={handleGenerateCode}>✨ Generate Invite Code</button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="settings-grid">
        {user?.role === 'admin' && (
          <div className="card">
            <h3 className="card-title" style={{ padding: '1.5rem 1.5rem 0' }}>Society Information</h3>
            <form onSubmit={handleSubmit} className="settings-form">
              {message && <div className={`alert ${message.includes('success') ? 'alert--success' : 'alert--error'}`}>{message}</div>}

              <div className="form-group">
                <label htmlFor="set-name">Society Name</label>
                <input type="text" id="set-name" value={societyForm.name}
                  onChange={e => setSocietyForm({ ...societyForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="set-address">Address</label>
                <input type="text" id="set-address" value={societyForm.address}
                  onChange={e => setSocietyForm({ ...societyForm, address: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="set-maintenance">Maintenance Amount (₹)</label>
                  <input type="number" id="set-maintenance" value={societyForm.maintenanceAmount}
                    onChange={e => setSocietyForm({ ...societyForm, maintenanceAmount: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label htmlFor="set-billing">Billing Day</label>
                  <input type="number" id="set-billing" min="1" max="28" value={societyForm.billingDay}
                    onChange={e => setSocietyForm({ ...societyForm, billingDay: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="set-contact">Contact Number</label>
                  <input type="text" id="set-contact" value={societyForm.contactNumber}
                    onChange={e => setSocietyForm({ ...societyForm, contactNumber: e.target.value })} placeholder="e.g. 9876543210" />
                </div>
                <div className="form-group">
                  <label htmlFor="set-upi">UPI ID (for payments)</label>
                  <input type="text" id="set-upi" value={societyForm.upiId}
                    onChange={e => setSocietyForm({ ...societyForm, upiId: e.target.value })} placeholder="e.g. society@upi" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="set-latefee">Late Fee/Day (₹)</label>
                  <input type="number" id="set-latefee" value={societyForm.lateFeePerDay}
                    onChange={e => setSocietyForm({ ...societyForm, lateFeePerDay: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label htmlFor="set-latedays">Late Fee After Days</label>
                  <input type="number" id="set-latedays" value={societyForm.lateFeeAfterDays}
                    onChange={e => setSocietyForm({ ...societyForm, lateFeeAfterDays: parseInt(e.target.value) })} />
                </div>
              </div>
              <button type="submit" className="btn btn--primary" disabled={saving} id="save-settings-btn">
                {saving ? <span className="btn-spinner"></span> : '💾 Save Settings'}
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 👑 Upgrade to Premium Card (HIDDEN) */}
          <div className="card" style={{ 
            display: 'none',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.98), rgba(67, 56, 202, 0.98))', 
            color: '#fff',
            border: '2px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 12px 30px -5px rgba(245, 158, 11, 0.25)',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '16px'
          }}>
            {/* Sparkles / crown backdrop icon */}
            <div style={{ position: 'absolute', right: '-15px', top: '-15px', fontSize: '6rem', opacity: 0.12, userSelect: 'none', transform: 'rotate(15deg)' }}>👑</div>
            
            <h3 className="card-title" style={{ padding: '1.5rem 1.5rem 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>👑</span> Upgrade to Premium
            </h3>
            
            <div style={{ padding: '1.5rem' }}>
              {society?.subscriptionTier === 'premium' ? (
                <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>✨</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fbbf24', letterSpacing: '0.05rem' }}>PREMIUM ACTIVE</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      <strong>Plan:</strong> {society.subscriptionPlan === 'fixed' ? 'Fixed Annual Plan 🏢' : 'Per-Flat Annual Plan 🔢'}
                    </p>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      <strong>Expires:</strong> {society.subscriptionExpiry ? new Date(society.subscriptionExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                    </p>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: '0.75rem', wordBreak: 'break-all', marginTop: '4px' }}>
                      Ref: {society.razorpayPaymentId}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {getTrialDaysLeft() > 0 ? (
                    /* Active Free Trial Status Box */
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))', 
                      padding: '1.05rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      marginBottom: '1.25rem'
                    }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span>⏳</span> 30-Day Free Trial Active
                      </p>
                      <p style={{ fontSize: '0.78rem', margin: '6px 0 0 0', opacity: 0.9, lineHeight: '1.45' }}>
                        Your society is currently enjoying full access to all premium features! <strong>{getTrialDaysLeft()} Days remaining</strong>.
                      </p>
                    </div>
                  ) : (
                    /* Expired Free Trial Status Box */
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))', 
                      padding: '1.05rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      marginBottom: '1.25rem'
                    }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <span>⚠️</span> Free Trial Expired
                      </p>
                      <p style={{ fontSize: '0.78rem', margin: '6px 0 0 0', opacity: 0.9, lineHeight: '1.45' }}>
                        Your 30-day free trial has ended. Please choose one of the plans below and upgrade to continue using premium features.
                      </p>
                    </div>
                  )}

                  <p style={{ fontSize: '0.85rem', opacity: 0.85, marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    अपनी सोसाइटी के लिए सबसे उपयुक्त सालाना प्लान चुनें। 1-क्लिक Razorpay भुगतान के साथ तुरंत प्रीमियम फीचर्स अनलॉक करें।
                  </p>

                  {/* Society Stats Row */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.06)', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '10px', 
                    marginBottom: '1.25rem', 
                    fontSize: '0.85rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🏢</span> <strong>{society?.totalFlats || 54} Flats</strong>
                    </span>
                    <span style={{ 
                      background: 'rgba(245, 158, 11, 0.2)', 
                      color: '#fbbf24', 
                      padding: '3px 10px', 
                      borderRadius: '6px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {getPricing(society?.totalFlats || 54).sizeGroup}
                    </span>
                  </div>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {/* Option A: Fixed Plan */}
                    <div 
                      onClick={() => setSelectedPlan('fixed')}
                      style={{
                        background: selectedPlan === 'fixed' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: selectedPlan === 'fixed' ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                        padding: '1rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        boxShadow: selectedPlan === 'fixed' ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="pricing-plan"
                        checked={selectedPlan === 'fixed'}
                        onChange={() => setSelectedPlan('fixed')}
                        style={{ cursor: 'pointer', width: '18px', height: '18px', marginTop: '3px', accentColor: '#fbbf24' }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>🏢 Fixed Annual Plan</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginBottom: '2px' }}>
                          ₹{getPricing(society?.totalFlats || 54).fixedAnnual.toLocaleString('en-IN')}
                          <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.8, color: '#fff' }}> / Year</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.75, display: 'block', lineHeight: '1.3' }}>
                          (₹{getPricing(society?.totalFlats || 54).fixedMonthly} per month fix for entire society)
                        </span>
                      </div>
                    </div>

                    {/* Option B: Per-Flat Plan */}
                    <div 
                      onClick={() => setSelectedPlan('per_flat')}
                      style={{
                        background: selectedPlan === 'per_flat' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: selectedPlan === 'per_flat' ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                        padding: '1rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        boxShadow: selectedPlan === 'per_flat' ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="pricing-plan"
                        checked={selectedPlan === 'per_flat'}
                        onChange={() => setSelectedPlan('per_flat')}
                        style={{ cursor: 'pointer', width: '18px', height: '18px', marginTop: '3px', accentColor: '#fbbf24' }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>🔢 Per-Flat Annual Plan</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginBottom: '2px' }}>
                          ₹{getPricing(society?.totalFlats || 54).totalPerFlatAnnual.toLocaleString('en-IN')}
                          <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.8, color: '#fff' }}> / Year</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.75, display: 'block', lineHeight: '1.3' }}>
                          (₹{getPricing(society?.totalFlats || 54).perFlatAnnualRate} per flat/year — ₹{getPricing(society?.totalFlats || 54).perFlatMonthlyRate} flat/month)
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn--full"
                    disabled={upgrading}
                    onClick={handleUpgrade}
                    style={{
                      background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                      color: '#1e1b4b',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      border: 'none',
                      boxShadow: '0 6px 20px 0 rgba(245, 158, 11, 0.45)',
                      padding: '12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {upgrading ? (
                      <span className="btn-spinner" style={{ borderColor: '#1e1b4b transparent transparent transparent', width: '18px', height: '18px' }}></span>
                    ) : (
                      <>
                        <span>⚡</span> Pay & Upgrade with Razorpay
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ padding: '1.5rem 1.5rem 0' }}>App Preferences</h3>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Need help understanding the app? You can replay the guided tour anytime.
              </p>
              <button 
                className="btn btn--outline btn--full" 
                onClick={() => window.triggerTour && window.triggerTour()}
              >
                ✨ Show App Tour Again
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ padding: '1.5rem 1.5rem 0' }}>Auto Reminders</h3>
            <div style={{ padding: '1.5rem' }}>
              <ReminderSettings />
            </div>
          </div>

          <div className="card" style={{ height: 'fit-content' }}>
            <h3 className="card-title" style={{ padding: '1.5rem 1.5rem 0' }}>About & Support</h3>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Support</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>For any technical issues or feature requests, reach out to us at:</p>
                <a href="mailto:funkariya.shop@gmail.com" style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'block',
                  marginTop: '0.5rem'
                }}>funkariya.shop@gmail.com</a>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Version 1.0.0 (Production)</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Powered by <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Funkariya</span>
                </p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.5 }}>
                  © 2026 All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
