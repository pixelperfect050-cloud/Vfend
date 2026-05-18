import { useState, useEffect } from 'react';
import api from '../utils/api';

const GoogleSheetsBackup = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeBackup();
  }, []);

  const initializeBackup = async () => {
    try {
      console.log('Fetching sheet status...');
      const data = await api.get('/api/sheets/status');
      console.log('Status response:', data);
      setStatus(data);
      
      // Zero-Touch Automation: If sheet backup is not enabled, automatically create it in the background
      if (!data.sheetEnabled) {
        console.log('Sheet backup not enabled. Auto-activating sheets backup...');
        const result = await api.post('/api/sheets/create-sheet');
        if (result.success) {
          const updatedData = await api.get('/api/sheets/status');
          setStatus(updatedData);
        } else {
          setMessage(result.error || 'Failed to auto-create backup sheet');
        }
      }
    } catch (err) {
      console.error('Error initializing backup:', err);
      setMessage('Unable to connect to server. Please make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const data = await api.get('/api/sheets/status');
      setStatus(data);
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  const syncNow = async () => {
    setSyncing(true);
    setMessage('');
    try {
      await api.post('/api/sheets/sync');
      setMessage('All data synced successfully!');
      fetchStatus();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    setMessage('');
    try {
      const result = await api.post('/api/sheets/export/excel');
      if (result.success) {
        window.open(result.url, '_blank');
        setMessage('Excel export started!');
      } else {
        setMessage(result.error || 'Export failed');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setExporting(false);
    }
  };

  const exportPDF = async (sheetName) => {
    setExporting(true);
    setMessage('');
    try {
      const result = await api.post('/api/sheets/export/pdf', { sheetName });
      if (result.success) {
        window.open(result.url, '_blank');
        setMessage(`${sheetName} PDF export started!`);
      } else {
        setMessage(result.error || 'PDF export failed');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setExporting(false);
    }
  };

  const generateReport = async () => {
    setMessage('');
    try {
      const data = await api.get(`/api/sheets/report/${reportMonth}/${reportYear}`);
      setReport(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const openSheet = () => {
    if (status?.googleSheetUrl) {
      window.open(status.googleSheetUrl, '_blank');
    }
  };

  // Modern High-Fidelity Spinner for Auto-enabling backup background process
  if (loading || (status && !status.sheetEnabled)) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#fff', 
        background: 'linear-gradient(135deg, #09090e 0%, #111122 50%, #0d1527 100%)', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '45px 35px',
          borderRadius: '30px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center'
        }}>
          <div className="pulse-container" style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            margin: '0 auto 28px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid rgba(99, 102, 241, 0.15)',
              borderTopColor: '#6366f1',
              animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
            }} />
            <div style={{
              position: 'absolute',
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              border: '3px solid rgba(168, 85, 247, 0.1)',
              borderBottomColor: '#a855f7',
              animation: 'spin-reverse 1.8s linear infinite'
            }} />
            <svg style={{ width: '28px', height: '28px', color: '#6366f1' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Activating Auto Backup System
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            Syncing multi-tenant database records and initializing your secure Google Drive backup directory. This runs completely automatically...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spin-reverse {
              0% { transform: rotate(360deg); }
              100% { transform: rotate(0deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // If initialization failed
  if (!status && message) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#fff', 
        background: 'linear-gradient(135deg, #09090e 0%, #111122 50%, #0d1527 100%)', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          maxWidth: '480px',
          width: '90%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#ef4444'
          }}>
            <svg style={{ width: '30px', height: '30px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', color: '#f87171' }}>
            Unable to Connect
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
            {message}
          </p>
          <button 
            onClick={() => { setLoading(true); initializeBackup(); }} 
            style={{ 
              padding: '12px 30px', 
              background: 'linear-gradient(to right, #6366f1, #4f46e5)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '10px', 
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)'; }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px 20px', 
      maxWidth: '1280px', 
      margin: '0 auto', 
      color: '#1e293b', 
      background: '#f8fafc', 
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>
      {/* Title & Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '20px',
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '900', 
            letterSpacing: '-0.03em', 
            marginBottom: '6px',
            background: 'linear-gradient(to right, #1e1b4b, #4f46e5)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}>
            Google Sheets Directory
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontWeight: '500' }}>
            Enterprise multi-tenant cloud backup system
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(99, 102, 241, 0.06)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          padding: '8px 16px',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Auto Sync Active
          </span>
        </div>
      </div>

      {/* Global Toast Messages */}
      {message && (
        <div style={{ 
          padding: '14px 20px', 
          marginBottom: '28px', 
          borderRadius: '16px',
          background: message.includes('success') || message.includes('started') ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${message.includes('success') || message.includes('started') ? '#a7f3d0' : '#fca5a5'}`,
          color: message.includes('success') || message.includes('started') ? '#065f46' : '#991b1b',
          fontSize: '0.9rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
        }}>
          <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={message.includes('success') || message.includes('started') ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
          </svg>
          {message}
        </div>
      )}

      {/* Core Backup Directory Card */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '24px', 
        padding: '28px', 
        marginBottom: '28px',
        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.05)',
        border: '1px solid rgba(79, 70, 229, 0.05)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span style={{ 
              display: 'inline-block',
              padding: '6px 12px', 
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#047857',
              fontWeight: '700',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px'
            }}>
              Master Sheet Created
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>
              SocietySync - Master Directory
            </h2>
            {status?.lastSyncedAt && (
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                Automatic background synchronization is fully operational. Last updated: <strong style={{ color: '#334155' }}>{new Date(status.lastSyncedAt).toLocaleString()}</strong>
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={openSheet}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(to right, #4f46e5, #6366f1)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(79, 70, 229, 0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.25)'; }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Google Sheet
            </button>
            <button 
              onClick={syncNow} 
              disabled={syncing}
              style={{
                padding: '12px 24px',
                background: syncing ? '#e2e8f0' : 'linear-gradient(to right, #10b981, #059669)',
                color: syncing ? '#94a3b8' : '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: syncing ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '700',
                boxShadow: syncing ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => { if (!syncing) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(16, 185, 129, 0.35)'; } }}
              onMouseLeave={(e) => { if (!syncing) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.25)'; } }}
            >
              <svg style={{ width: '18px', height: '18px', animation: syncing ? 'spin 1s linear infinite' : 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
              {syncing ? 'Syncing...' : 'Sync Master Directory'}
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Smart Insights & Exports */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px', marginBottom: '28px' }}>
        
        {/* Left Side: Backup & PDF Generation Hub */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>
              Export & Downloads
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.5' }}>
              Instantly pull raw exports from your cloud backups. Select a tab below to generate an official right-aligned PDF report.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <button 
                onClick={exportExcel}
                disabled={exporting}
                style={{
                  padding: '12px 20px',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => { if (!exporting) { e.currentTarget.style.background = '#e2e8f0'; } }}
                onMouseLeave={(e) => { if (!exporting) { e.currentTarget.style.background = '#f1f5f9'; } }}
              >
                <svg style={{ width: '18px', height: '18px', color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {exporting ? 'Generating Excel...' : 'Download Master Directory (.xlsx)'}
              </button>

              <div>
                <p style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Generate PDF Reports:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {['Members', 'Flats', 'Payments', 'Maintenance', 'Expenses', 'Funds'].map(sheet => (
                    <button
                      key={sheet}
                      onClick={() => exportPDF(sheet)}
                      disabled={exporting}
                      style={{
                        padding: '10px 8px',
                        background: 'transparent',
                        color: '#4f46e5',
                        border: '1px solid rgba(79, 70, 229, 0.2)',
                        borderRadius: '10px',
                        cursor: exporting ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => { if (!exporting) { e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'; e.currentTarget.style.borderColor = '#4f46e5'; } }}
                      onMouseLeave={(e) => { if (!exporting) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.2)'; } }}
                    >
                      {sheet}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Intelligent Monthly Summary */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>
            Intelligent Monthly Summary
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
            Extract deep insights directly calculated from Google Sheets databases.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <select 
              value={reportMonth} 
              onChange={(e) => setReportMonth(parseInt(e.target.value))}
              style={{ 
                padding: '10px 16px', 
                borderRadius: '12px', 
                border: '1px solid #cbd5e1', 
                background: '#fff', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <select 
              value={reportYear} 
              onChange={(e) => setReportYear(parseInt(e.target.value))}
              style={{ 
                padding: '10px 16px', 
                borderRadius: '12px', 
                border: '1px solid #cbd5e1', 
                background: '#fff', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button 
              onClick={generateReport}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(to right, #4f46e5, #6366f1)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)'; }}
            >
              Generate Report
            </button>
          </div>

          {report ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Total Members</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>{report.memberCount}</span>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Total Flats</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>{report.flatCount}</span>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Maintenance Billed</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>₹{report.totalMaintenanceBilled?.toLocaleString()}</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Collected</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>₹{report.totalMaintenanceCollected?.toLocaleString()}</span>
              </div>

              <div style={{ background: '#fef2f2', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#b91c1c', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Outstanding</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#ef4444' }}>₹{report.outstanding?.toLocaleString()}</span>
              </div>

              <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#1e40af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '4px' }}>Expenses</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: '800', color: '#2563eb' }}>₹{report.totalExpenses?.toLocaleString()}</span>
              </div>

              <div style={{ 
                gridColumn: 'span 2', 
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', 
                padding: '16px', 
                borderRadius: '16px', 
                color: '#fff',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.25)'
              }}>
                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Net Cloud Balance</span>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '900' }}>₹{report.netBalance?.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              background: '#f8fafc', 
              borderRadius: '16px', 
              border: '1px dashed #cbd5e1',
              color: '#64748b',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              No summary compiled yet. Click "Generate Report" above.
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Box */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '20px', 
        padding: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
        border: '1px solid rgba(0,0,0,0.02)'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>
          Data Isolation & Security Details
        </h4>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 14px 0', lineHeight: '1.6' }}>
          Your data remains fully protected. Writes and revisions are safely tracked on-event when:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            'New member registered or approved',
            'Flat information updated or occupied',
            'Payments submitted or confirmed',
            'Expenses added or funds updated'
          ].map((text, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
              <div style={{ 
                width: '18px', 
                height: '18px', 
                borderRadius: '50%', 
                background: '#ecfdf5', 
                color: '#10b981', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                ✓
              </div>
              {text}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GoogleSheetsBackup;