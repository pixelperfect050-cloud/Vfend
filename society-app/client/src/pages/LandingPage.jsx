import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const observerRef = useRef(null);

  // --- INTERACTIVE SIMULATOR STATE ---
  const [simTab, setSimTab] = useState('flatGrid');
  const [selectedFlat, setSelectedFlat] = useState({
    num: 'A-201',
    owner: 'Rahul Sharma',
    phone: '+91 98765 43210',
    status: 'Paid',
    type: 'Owner',
    balance: '₹0'
  });
  const [mockCollected, setMockCollected] = useState(452000);
  const [approvedList, setApprovedList] = useState({
    'B-104': false,
    'A-302': false
  });

  // --- PRICING CALCULATOR STATE ---
  const [flatCount, setFlatCount] = useState(60);

  const getPricingInfo = (flats) => {
    if (flats <= 50) {
      return {
        tier: 'Small (1-50 Flats)',
        fixedAnnual: 4999,
        fixedMonthly: 416,
        perFlatAnnualRate: 120,
        perFlatMonthlyRate: 10,
        totalPerFlatAnnual: flats * 120
      };
    } else if (flats <= 120) {
      return {
        tier: 'Medium (51-120 Flats)',
        fixedAnnual: 7999,
        fixedMonthly: 666,
        perFlatAnnualRate: 144,
        perFlatMonthlyRate: 12,
        totalPerFlatAnnual: flats * 144
      };
    } else {
      return {
        tier: 'Large (121+ Flats)',
        fixedAnnual: 14999,
        fixedMonthly: 1249,
        perFlatAnnualRate: 180,
        perFlatMonthlyRate: 15,
        totalPerFlatAnnual: flats * 180
      };
    }
  };

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for reveal animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Auto-play carousel slides
  const screenshots = [
    { title: 'Dashboard Overview', desc: 'Real-time analytics, status grids, and collection progress.', emoji: '📊' },
    { title: 'Payment Verification', desc: 'Verify and approve member transactions in 1-click.', emoji: '💳' },
    { title: 'Flat Management', desc: 'Interactive color-coded block grids and resident history.', emoji: '🏢' },
    { title: 'Expense Reports', desc: 'Detailed expense category breakdown with ledger logs.', emoji: '📋' },
    { title: 'Google Sheet Backups', desc: 'Automated real-time multi-tenant backup with Master Directory.', emoji: '📑' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % screenshots.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  const features = [
    { icon: '🧾', title: 'Automated Billing', desc: 'Generate and distribute standard maintenance bills for every flat with customizable due dates.' },
    { icon: '✅', title: 'Instant Verification', desc: 'Members upload receipts and admins verify in real-time, completely eliminating paper tracking.' },
    { icon: '🏢', title: 'Flat Grid Management', desc: 'A rich visual layout of blocks, floors, and occupancy status with instant history access.' },
    { icon: '💰', title: 'Community Funds', desc: 'Create target-oriented funds for society events or renovations with live progress tracking.' },
    { icon: '📋', title: 'Expense Analytics', desc: 'Beautiful pie charts and expense categories showing exactly where society funds are spent.' },
    { icon: '📈', title: 'Downloadable PDF Reports', desc: 'Generate professional financial audit sheets and invoices instantly in one click.' },
    { icon: '🔔', title: 'Automated Notifications', desc: 'Send smart reminders for pending dues, successful approvals, and announcements.' },
    { icon: '🔐', title: 'Role-Based Access', desc: 'Secure boundaries for system super-admins, society managers, and general flat owners.' },
  ];

  const benefits = [
    { icon: '🔍', title: '100% Financial Transparency', desc: 'Every rupee logged, verified, and audited. Members see live balance ledgers.' },
    { icon: '👥', title: 'Seamless Member Integration', desc: 'Fast, secure registration with admin invite codes preventing data leakages.' },
    { icon: '⚡', title: '70% Faster Collections', desc: 'Automated reminder sequences and quick approvals drive immediate compliance.' },
    { icon: '📑', title: 'Auto Google Sheets Backup', desc: 'Double data redundancy on MongoDB Atlas and a beautiful multi-tenant Google Drive system.' }
  ];

  const stats = [
    { value: '500+', label: 'Active Societies' },
    { value: '15K+', label: 'Flats Managed' },
    { value: '₹2.5Cr+', label: 'Payments Tracked' },
    { value: '99.99%', label: 'Uptime SLA' }
  ];

  const handleSimFlatClick = (num, owner, status, type, balance) => {
    setSelectedFlat({ num, owner, status, type, balance, phone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000) });
  };

  const handleSimApprove = (flat, amount) => {
    if (approvedList[flat]) return;
    setApprovedList(prev => ({ ...prev, [flat]: true }));
    setMockCollected(prev => prev + amount);
  };

  return (
    <div className="landing" data-theme={theme}>
      {/* ═══════════ NAVIGATION ═══════════ */}
      <nav className={`landing-nav ${scrollY > 50 ? 'landing-nav--scrolled' : ''}`}>
        <div className="landing-nav__inner">
          <Link to="/" className="landing-nav__logo">
            <span className="landing-nav__logo-icon">🏘️</span>
            <span className="landing-nav__logo-text">SocietySync</span>
          </Link>

          <div className={`landing-nav__links ${menuOpen ? 'open' : ''}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#demo" onClick={() => setMenuOpen(false)}>Demo</a>
            <a href="#benefits" onClick={() => setMenuOpen(false)}>Benefits</a>
            <a href="/SocietySync.apk" download onClick={() => setMenuOpen(false)}>Download APK 📱</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>

          <div className="landing-nav__actions">
            <button className="landing-nav__theme" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link to="/login" className="landing-btn landing-btn--ghost" id="nav-login-btn">Login</Link>
            <Link to="/register" className="landing-btn landing-btn--primary" id="nav-signup-btn">Get Started</Link>
          </div>

          <button
            className={`landing-nav__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {menuOpen && (
          <div className="landing-mobile-menu">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#demo" onClick={() => setMenuOpen(false)}>Demo</a>
            <a href="#benefits" onClick={() => setMenuOpen(false)}>Benefits</a>
            <a href="/SocietySync.apk" download onClick={() => setMenuOpen(false)}>Download APK 📱</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <div className="landing-mobile-menu__actions">
              <Link to="/login" className="landing-btn landing-btn--ghost" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="landing-btn landing-btn--primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="landing-hero" id="home">
        <div className="landing-hero__bg">
          <div className="landing-hero__orb landing-hero__orb--1" style={{ transform: `translateY(${scrollY * 0.12}px)` }} />
          <div className="landing-hero__orb landing-hero__orb--2" style={{ transform: `translateY(${scrollY * -0.08}px)` }} />
          <div className="landing-hero__orb landing-hero__orb--3" style={{ transform: `translateY(${scrollY * 0.05}px)` }} />
          <div className="landing-hero__grid" />
        </div>

        <div className="landing-hero__content">
          <div className="landing-hero__badge">
            <span className="landing-hero__badge-dot" />
            🏘️ Ultimate Housing Society Operating System
          </div>
          <h1 className="landing-hero__title">
            The Modern Way to Manage <br />
            <span className="landing-hero__title-gradient">Society Maintenance</span>
          </h1>
          <p className="landing-hero__subtitle">
            Say goodbye to paper ledger books. SocietySync automates billing, tracks payments with 1-click approvals, 
            monitors expenses, and backs up your records automatically to secure Google Sheets.
          </p>
          <div className="landing-hero__cta">
            <Link to="/register" className="landing-btn landing-btn--primary landing-btn--lg" id="hero-start-btn">
              Get Started for Free →
            </Link>
            <a href="/SocietySync.apk" download className="landing-btn landing-btn--outline landing-btn--lg" id="hero-apk-btn">
              Download Android App 📱
            </a>
            <a href="#demo" className="landing-btn landing-btn--ghost landing-btn--lg" id="hero-demo-btn" style={{ border: '1px solid rgba(79, 70, 229, 0.15)' }}>
              Explore Interactive Demo
            </a>
          </div>

          <div className="landing-hero__stats">
            {stats.map((stat, i) => (
              <div key={i} className="landing-hero__stat">
                <span className="landing-hero__stat-value">{stat.value}</span>
                <span className="landing-hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════ INTERACTIVE HERO MOCKUP SIMULATOR ═══════════ */}
        <div className="landing-hero__mockup">
          <div className="landing-hero__mockup-frame">
            <div className="landing-hero__mockup-bar">
              <div className="mockup-dots">
                <span /><span /><span />
              </div>
              <div className="mockup-title-badge">
                <span>⚡</span> Interactive Live Demo
              </div>
            </div>
            <div className="landing-hero__mockup-screen">
              <div className="interactive-mock">
                {/* Simulated Tabs */}
                <div className="interactive-mock__tabs">
                  <button
                    className={`interactive-mock__tab ${simTab === 'flatGrid' ? 'interactive-mock__tab--active' : ''}`}
                    onClick={() => setSimTab('flatGrid')}
                  >
                    🏢 Visual Flat Grid
                  </button>
                  <button
                    className={`interactive-mock__tab ${simTab === 'approvals' ? 'interactive-mock__tab--active' : ''}`}
                    onClick={() => setSimTab('approvals')}
                  >
                    🔔 Real-time Approvals
                  </button>
                  <button
                    className={`interactive-mock__tab ${simTab === 'analytics' ? 'interactive-mock__tab--active' : ''}`}
                    onClick={() => setSimTab('analytics')}
                  >
                    📊 Dynamic Analytics
                  </button>
                </div>

                {/* Tab 1: Visual Flat Grid */}
                {simTab === 'flatGrid' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div className="mock-flat-grid">
                      <div className="mock-flat-item mock-flat-item--paid" onClick={() => handleSimFlatClick('A-101', 'Amit Patel', 'Paid', 'Owner', '₹0')}>
                        <span className="mock-flat-item__num">A-101</span>
                        <span className="mock-flat-item__status">Paid</span>
                      </div>
                      <div className="mock-flat-item mock-flat-item--pending" onClick={() => handleSimFlatClick('A-102', 'Vikram Singh', 'Pending', 'Tenant', '₹4,500')}>
                        <span className="mock-flat-item__num">A-102</span>
                        <span className="mock-flat-item__status">Dues</span>
                      </div>
                      <div className="mock-flat-item mock-flat-item--paid" onClick={() => handleSimFlatClick('A-201', 'Rahul Sharma', 'Paid', 'Owner', '₹0')}>
                        <span className="mock-flat-item__num">A-201</span>
                        <span className="mock-flat-item__status">Paid</span>
                      </div>
                      <div className="mock-flat-item mock-flat-item--partial" onClick={() => handleSimFlatClick('B-101', 'Soniya Sen', 'Partial', 'Tenant', '₹1,500')}>
                        <span className="mock-flat-item__num">B-101</span>
                        <span className="mock-flat-item__status">Partial</span>
                      </div>
                      <div className="mock-flat-item mock-flat-item--paid" onClick={() => handleSimFlatClick('B-102', 'Karan Johar', 'Paid', 'Owner', '₹0')}>
                        <span className="mock-flat-item__num">B-102</span>
                        <span className="mock-flat-item__status">Paid</span>
                      </div>
                      <div className="mock-flat-item mock-flat-item--pending" onClick={() => handleSimFlatClick('B-201', 'Rohit Sen', 'Pending', 'Owner', '₹4,500')}>
                        <span className="mock-flat-item__num">B-201</span>
                        <span className="mock-flat-item__status">Dues</span>
                      </div>
                      <div className="mock-flat-item mock-flat-item--paid" onClick={() => handleSimFlatClick('B-202', 'Nisha Verma', 'Paid', 'Owner', '₹0')}>
                        <span className="mock-flat-item__num">B-202</span>
                        <span className="mock-flat-item__status">Paid</span>
                      </div>
                      <div className="mock-flat-item mock-flat-item--paid" onClick={() => handleSimFlatClick('B-301', 'Anuj Singhal', 'Paid', 'Tenant', '₹0')}>
                        <span className="mock-flat-item__num">B-301</span>
                        <span className="mock-flat-item__status">Paid</span>
                      </div>
                    </div>

                    {selectedFlat && (
                      <div className="mock-detail-card">
                        <div className="mock-detail-row">
                          <span style={{ fontWeight: 800 }}>Flat Details ({selectedFlat.num})</span>
                          <span style={{
                            padding: '0.1rem 0.5rem',
                            fontSize: '0.62rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            background: selectedFlat.status === 'Paid' ? '#d1fae5' : selectedFlat.status === 'Pending' ? '#fee2e2' : '#fef3c7',
                            color: selectedFlat.status === 'Paid' ? '#065f46' : selectedFlat.status === 'Pending' ? '#991b1b' : '#92400e'
                          }}>{selectedFlat.status}</span>
                        </div>
                        <div className="mock-detail-row" style={{ marginTop: '0.4rem' }}>
                          <span style={{ color: '#64748b' }}>Occupant:</span>
                          <strong>{selectedFlat.owner} ({selectedFlat.type})</strong>
                        </div>
                        <div className="mock-detail-row">
                          <span style={{ color: '#64748b' }}>Mobile No:</span>
                          <span>{selectedFlat.phone}</span>
                        </div>
                        <div className="mock-detail-row">
                          <span style={{ color: '#64748b' }}>Pending Balance:</span>
                          <strong style={{ color: selectedFlat.balance !== '₹0' ? '#ef4444' : 'inherit' }}>{selectedFlat.balance}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Real-time Approvals */}
                {simTab === 'approvals' && (
                  <div className="mock-approvals-list">
                    <div className="mock-approval-item">
                      <div className="mock-approval-info">
                        <div className="mock-approval-avatar" style={{ background: '#ec4899' }}>VP</div>
                        <div className="mock-approval-text">
                          <span className="mock-approval-name">Vijay Prasad (B-104)</span>
                          <span className="mock-approval-meta">UPI Payment • ₹4,500 • May Bill</span>
                        </div>
                      </div>
                      <button
                        className={`mock-approval-action ${approvedList['B-104'] ? 'mock-approval-action--approved' : ''}`}
                        onClick={() => handleSimApprove('B-104', 4500)}
                        disabled={approvedList['B-104']}
                      >
                        {approvedList['B-104'] ? 'Approved ✓' : 'Approve ✅'}
                      </button>
                    </div>

                    <div className="mock-approval-item">
                      <div className="mock-approval-info">
                        <div className="mock-approval-avatar" style={{ background: '#3b82f6' }}>AS</div>
                        <div className="mock-approval-text">
                          <span className="mock-approval-name">Aditi Singh (A-302)</span>
                          <span className="mock-approval-meta">Net Banking • ₹4,500 • May Bill</span>
                        </div>
                      </div>
                      <button
                        className={`mock-approval-action ${approvedList['A-302'] ? 'mock-approval-action--approved' : ''}`}
                        onClick={() => handleSimApprove('A-302', 4500)}
                        disabled={approvedList['A-302']}
                      >
                        {approvedList['A-302'] ? 'Approved ✓' : 'Approve ✅'}
                      </button>
                    </div>

                    <div style={{
                      textAlign: 'center',
                      fontSize: '0.72rem',
                      color: '#64748b',
                      padding: '0.4rem',
                      background: 'rgba(79, 70, 229, 0.04)',
                      borderRadius: '8px',
                      marginTop: '0.5rem'
                    }}>
                      💡 <strong>Try it!</strong> Click "Approve ✅" to verify transaction screenshots and instantly update balances.
                    </div>
                  </div>
                )}

                {/* Tab 3: Dynamic Analytics */}
                {simTab === 'analytics' && (
                  <div className="mock-ledger-card">
                    <div className="mock-ledger-metrics">
                      <div className="mock-ledger-metric">
                        <h4>Total Collected</h4>
                        <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>₹{mockCollected.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="mock-ledger-metric">
                        <h4>Dues Recovery</h4>
                        <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4f46e5' }}>88.4%</p>
                      </div>
                    </div>
                    {/* Simulated bar chart visual */}
                    <div className="mock-chart-visual">
                      <div className="mock-chart-bar" style={{ height: '48%' }} data-month="Dec" />
                      <div className="mock-chart-bar" style={{ height: '62%' }} data-month="Jan" />
                      <div className="mock-chart-bar" style={{ height: '70%' }} data-month="Feb" />
                      <div className="mock-chart-bar" style={{ height: '88%' }} data-month="Mar" />
                      <div className="mock-chart-bar" style={{ height: '94%' }} data-month="Apr" />
                      <div className="mock-chart-bar" style={{ height: `${(mockCollected / 480000) * 100}%` }} data-month="May" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="landing-hero__glow" />
        </div>
      </section>

      {/* ═══════════ EVERYTHING YOU NEED ═══════════ */}
      <section className="landing-section landing-intro" id="intro" data-animate>
        <div className={`landing-section__inner ${visibleSections.intro ? 'animate-in' : ''}`}>
          <div className="landing-section__header">
            <span className="landing-section__tag">Everything in one place</span>
            <h2 className="landing-section__title">Say Goodbye to Messy Ledgers</h2>
            <p className="landing-section__desc">
              Designed specifically for housing society admins. Easily manage maintenance payments, track block-wise flats, 
              generate reports, and synchronize backups seamlessly.
            </p>
          </div>

          <div className="landing-intro__grid">
            {[
              { emoji: '⚡', title: 'Instant Online Verification', desc: 'No more physical checks. Residents submit digital transaction screenshots which admins can approve in a single tap.' },
              { emoji: '🏢', title: 'Color-Coded Status Grid', desc: 'A rich visual grid displaying the payment status of every block and floor. Track dues, paid flats, and partial balances at a glance.' },
              { emoji: '📊', title: 'Interactive Ledgers & Charts', desc: 'Track where every single rupee goes. Categorize society expenses, log community welfare funds, and visual audits.' }
            ].map((item, i) => (
              <div key={i} className="landing-intro__card" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="landing-intro__card-emoji">{item.emoji}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CORE FEATURES ═══════════ */}
      <section className="landing-section landing-features" id="features" data-animate>
        <div className={`landing-section__inner ${visibleSections.features ? 'animate-in' : ''}`}>
          <div className="landing-section__header">
            <span className="landing-section__tag">Core Modules</span>
            <h2 className="landing-section__title">Automated Society Management</h2>
            <p className="landing-section__desc">
              Every tool and module built to maximize transparency, prevent accounting fraud, and increase audit safety.
            </p>
          </div>

          <div className="landing-features__grid">
            {features.map((feature, i) => (
              <div key={i} className="landing-feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="landing-feature-card__icon">{feature.icon}</div>
                <h3 className="landing-feature-card__title">{feature.title}</h3>
                <p className="landing-feature-card__desc">{feature.desc}</p>
                <div className="landing-feature-card__shine" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DEMO CAROUSEL ═══════════ */}
      <section className="landing-section landing-demo" id="demo" data-animate>
        <div className={`landing-section__inner ${visibleSections.demo ? 'animate-in' : ''}`}>
          <div className="landing-section__header">
            <span className="landing-section__tag">Feature Walkthrough</span>
            <h2 className="landing-section__title">Take a Closer Look Inside</h2>
            <p className="landing-section__desc">
              Experience the design aesthetics and advanced modules that make SocietySync so beautiful.
            </p>
          </div>

          <div className="landing-demo__carousel">
            <div className="landing-demo__slides">
              {screenshots.map((slide, i) => (
                <div
                  key={i}
                  className={`landing-demo__slide ${i === activeSlide ? 'active' : ''}`}
                >
                  <div className="landing-demo__slide-visual">
                    <div className="landing-demo__slide-emoji">{slide.emoji}</div>
                    <div className="landing-demo__slide-mockup">
                      <div className="slide-mock-header">
                        <span className="slide-mock-dot" /><span className="slide-mock-dot" /><span className="slide-mock-dot" />
                      </div>
                      <div className="slide-mock-content">
                        <div className="slide-mock-sidebar">
                          {['📊','🏢','💳','📋','📑'].map((e,j) => (
                            <div key={j} className={`slide-mock-nav ${j === i ? 'active' : ''}`}>{e}</div>
                          ))}
                        </div>
                        <div className="slide-mock-main">
                          <div className="slide-mock-title">{slide.title}</div>
                          <div className="slide-mock-cards">
                            <div className="slide-mock-card" /><div className="slide-mock-card" /><div className="slide-mock-card" />
                          </div>
                          <div className="slide-mock-chart">
                            {[40,65,50,80,60,75,55].map((h,k) => (
                              <div key={k} className="slide-mock-bar" style={{height:`${h}%`}} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3>{slide.title}</h3>
                  <p>{slide.desc}</p>
                </div>
              ))}
            </div>

            <div className="landing-demo__dots">
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  className={`landing-demo__dot ${i === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING CALCULATOR SECTION (HIDDEN) ═══════════ */}
      <section className="landing-section landing-pricing" id="pricing" data-animate style={{ display: 'none', background: 'var(--card-bg, rgba(255,255,255,0.01))', padding: '5rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className={`landing-section__inner ${visibleSections.pricing ? 'animate-in' : ''}`} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="landing-section__header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="landing-section__tag" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#6366f1', padding: '6px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>Simple & Transparent Pricing</span>
            <h2 className="landing-section__title" style={{ fontSize: '2.5rem', marginTop: '1rem', fontWeight: 'bold' }}>Choose the Plan That Fits Your Society Size</h2>
            <p className="landing-section__desc" style={{ maxWidth: '600px', margin: '1rem auto 0 auto', opacity: 0.8, lineHeight: '1.6' }}>
              अपनी सोसाइटी के कुल फ्लैट्स डालकर देखें कि आपके लिए कौन सा प्लान सबसे अच्छा रहेगा। मुफ़्त 30-दिन के ट्रायल के साथ तुरंत शुरुआत करें!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '3rem 2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative'
          }}>
            {/* Left side: Interactive Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', opacity: 0.9 }}>🏢 Society Size</span>
                <span style={{ 
                  background: 'linear-gradient(90deg, #4f46e5, #6366f1)', 
                  color: '#fff', 
                  padding: '6px 16px', 
                  borderRadius: '30px', 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
                }}>
                  {flatCount} Flats
                </span>
              </div>

              {/* Slider Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  value={flatCount} 
                  onChange={(e) => setFlatCount(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '5px',
                    background: 'rgba(255,255,255,0.1)',
                    outline: 'none',
                    accentColor: '#4f46e5',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.5, marginTop: '2px' }}>
                  <span>10 Flats</span>
                  <span>120 Flats</span>
                  <span>250 Flats</span>
                  <span>500 Flats</span>
                </div>
              </div>

              {/* Dynamic Size Tier Badge */}
              <div style={{ 
                background: 'rgba(79, 70, 229, 0.08)', 
                border: '1px solid rgba(79, 70, 229, 0.2)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ opacity: 0.8 }}>🏷️ Pricing Tier:</span>
                <strong style={{ color: '#818cf8', fontWeight: 'bold' }}>{getPricingInfo(flatCount).tier}</strong>
              </div>

              {/* 🎁 Free Trial Badge */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))', 
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '1.25rem',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🎁</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#10b981', fontWeight: 'bold' }}>30 Days Free Trial Available</h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.78rem', opacity: 0.8, lineHeight: '1.45' }}>
                    Try all premium features free for 30 days. No credit card required. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Dynamic Packages Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              {/* Option A: Fixed Plan */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.04), rgba(99, 102, 241, 0.04))',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                padding: '1.25rem',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '4rem', opacity: 0.05, userSelect: 'none' }}>🏢</div>
                <span style={{ background: '#4f46e5', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>Option A</span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.15rem', fontWeight: 'bold' }}>🏢 Fixed Annual Plan</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', opacity: 0.75 }}>पूरी सोसाइटी का एक दाम, चाहे जितने भी फ्लैट्स हों।</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#818cf8' }}>₹{getPricingInfo(flatCount).fixedAnnual.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>/ Year</span>
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.55, display: 'block', marginTop: '4px' }}>(Approx. ₹{getPricingInfo(flatCount).fixedMonthly}/month for whole society)</span>
              </div>

              {/* Option B: Per-Flat Plan */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.04), rgba(217, 119, 6, 0.04))',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '1.25rem',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '4rem', opacity: 0.05, userSelect: 'none' }}>🔢</div>
                <span style={{ background: '#f59e0b', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>Option B</span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.15rem', fontWeight: 'bold' }}>🔢 Per-Flat Annual Plan</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', opacity: 0.75 }}>प्रति फ्लैट के हिसाब से भुगतान करें। छोटे साइज के लिए बेस्ट।</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#fbbf24' }}>₹{getPricingInfo(flatCount).totalPerFlatAnnual.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>/ Year</span>
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.55, display: 'block', marginTop: '4px' }}>(₹{getPricingInfo(flatCount).perFlatAnnualRate}/flat/year — approx. ₹{getPricingInfo(flatCount).perFlatMonthlyRate}/flat/month)</span>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link 
              to="/register" 
              className="landing-btn landing-btn--primary landing-btn--lg" 
              style={{ 
                background: 'linear-gradient(90deg, #4f46e5, #6366f1)',
                border: 'none',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.45)',
                padding: '14px 32px',
                borderRadius: '30px'
              }}
            >
              🎁 Start Your 30-Day Free Trial Now
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ BENEFITS ═══════════ */}
      <section className="landing-section landing-benefits" id="benefits" data-animate>
        <div className={`landing-section__inner ${visibleSections.benefits ? 'animate-in' : ''}`}>
          <div className="landing-section__header">
            <span className="landing-section__tag">Why Choose Us</span>
            <h2 className="landing-section__title">The Safest Operating System</h2>
            <p className="landing-section__desc">
              Built with industry-leading practices to protect your data, secure finances, and coordinate communication.
            </p>
          </div>

          <div className="landing-benefits__grid">
            {benefits.map((benefit, i) => (
              <div key={i} className="landing-benefit-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="landing-benefit-card__icon">{benefit.icon}</div>
                <div className="landing-benefit-card__content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="landing-benefits__cta">
            <Link to="/register" className="landing-btn landing-btn--primary landing-btn--lg">
              Start Your Free Society Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA BANNER SECTION ═══════════ */}
      <section className="landing-cta-section" data-animate id="cta-section">
        <div className={`landing-cta-section__inner ${visibleSections['cta-section'] ? 'animate-in' : ''}`}>
          <div className="landing-cta__bg-orbs">
            <div className="landing-cta__orb" />
            <div className="landing-cta__orb" />
          </div>
          <h2>Ready to Modernize Your Housing Society?</h2>
          <p>Join over 500+ societies who have digitised their records, automated collections, and verified balances with SocietySync.</p>
          <div className="landing-cta__actions">
            <Link to="/register" className="landing-btn landing-btn--white landing-btn--lg">Get Started Free</Link>
            <a href="mailto:funkariya.shop@gmail.com" className="landing-btn landing-btn--outline-white landing-btn--lg">Contact Support</a>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="landing-footer" id="contact">
        <div className="landing-footer__inner">
          <div className="landing-footer__top">
            <div className="landing-footer__brand">
              <div className="landing-footer__logo">
                <span>🏘️</span>
                <span className="landing-footer__logo-text">SocietySync</span>
              </div>
              <p className="landing-footer__tagline">
                An ultra-premium, modern Operating System for Housing Societies. Automate bookkeeping, sync Google Sheets, and ensure transparent ledgers.
              </p>
              <div className="landing-footer__social">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">🔗</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶️</a>
              </div>
            </div>

            <div className="landing-footer__links-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#demo">Demo Carousel</a>
              <a href="#benefits">Key Benefits</a>
              <Link to="/register">Register New</Link>
            </div>

            <div className="landing-footer__links-group">
              <h4>Company</h4>
              <a href="#home">About SocietySync</a>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <a href="#contact">Terms of Service</a>
              <a href="mailto:funkariya.shop@gmail.com">Partner Program</a>
            </div>

            <div className="landing-footer__links-group">
              <h4>Support</h4>
              <a href="mailto:funkariya.shop@gmail.com">Help & Documentation</a>
              <a href="mailto:funkariya.shop@gmail.com">Developer API</a>
              <Link to="/login">Login Admin</Link>
              <Link to="/join">Join Society Portal</Link>
            </div>
          </div>

          <div className="landing-footer__bottom">
            <p>© {new Date().getFullYear()} SocietySync. All rights reserved.</p>
            <p>
              Powered by <a href="mailto:funkariya.shop@gmail.com" style={{ fontWeight: 800, color: '#a5b4fc', textDecoration: 'none' }}>Funkariya</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
