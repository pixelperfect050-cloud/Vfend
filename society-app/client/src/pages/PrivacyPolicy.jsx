import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="auth-page" style={{ overflowY: 'auto', padding: '2rem 1rem' }}>
      <div className="auth-container" style={{ maxWidth: '800px' }}>
        <div className="auth-card" style={{ textAlign: 'left', padding: '2rem' }}>
          <h1 className="auth-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Privacy Policy</h1>
          <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>Last updated: May 09, 2026</p>

          <div className="policy-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6', opacity: 0.9 }}>
            <section>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including your name, email address, mobile number, and flat details when you register for a SocietySync account.</p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Provide, maintain, and improve our services.</li>
                <li>Process payment transactions and send receipts.</li>
                <li>Send technical notices, updates, and security alerts.</li>
                <li>Respond to your comments and questions.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>3. Data Security</h2>
              <p>We use MongoDB Atlas cloud storage with encryption to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
            </section>

            <section>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>4. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Email: funkariya.shop@gmail.com</p>
              <p>Powered by Funkariya</p>
            </section>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to="/login" className="btn btn--primary">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
