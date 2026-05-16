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
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      console.log('Fetching sheet status...');
      const data = await api.get('/api/sheets/status');
      console.log('Status response:', data);
      setStatus(data);
      if (!data.sheetEnabled) {
        setMessage('Google Sheets backup is not enabled for this society');
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      setMessage('Unable to connect to server. Please make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const createSheet = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await api.post('/api/sheets/create-sheet');
      if (result.success) {
        setMessage('Google Sheet created successfully!');
        fetchStatus();
      } else {
        setMessage(result.error || 'Failed to create sheet');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#000', background: '#fff', minHeight: '100vh' }}>
        Loading...
      </div>
    );
  }

  // If no status, show error state
  if (!status && !message) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#000', background: '#fff', minHeight: '100vh' }}>
        <h2>Unable to load backup status</h2>
        <p>Please make sure you are logged in as admin and try again.</p>
        <button onClick={() => { setLoading(true); fetchStatus(); }} style={{ padding: '10px 20px', marginTop: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
          Google Sheets Backup
        </h1>
        <p style={{ color: '#666' }}>Automatic backup system for SocietySync data</p>
      </div>

      {message && (
        <div style={{ 
          padding: '12px 16px', 
          marginBottom: '20px', 
          borderRadius: '8px',
          background: message.includes('success') || message.includes('started') ? '#d4edda' : '#f8d7da',
          color: message.includes('success') || message.includes('started') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        background: 'var(--card-bg, #fff)', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            padding: '8px 16px', 
            borderRadius: '20px',
            background: status?.sheetEnabled ? '#d4edda' : '#fff3cd',
            color: status?.sheetEnabled ? '#155724' : '#856404',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            {status?.sheetEnabled ? 'Active' : 'Not Enabled'}
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0' }}>Backup Status</h3>
            {status?.sheetEnabled && status?.lastSyncedAt && (
              <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                Last synced: {new Date(status.lastSyncedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {status?.sheetEnabled && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={openSheet}
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Open Google Sheet
            </button>
            <button 
              onClick={syncNow} 
              disabled={syncing}
              style={{
                padding: '10px 20px',
                background: syncing ? '#6c757d' : '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: syncing ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        )}
      </div>

      {!status?.sheetEnabled && (
        <div style={{ 
          background: 'var(--card-bg, #fff)', 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>Enable Automatic Backup</h3>
          <p>Create a dedicated Google Sheet for your society with automatic data sync.</p>
          <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
            <li>Auto-created tabs: Members, Flats, Payments, Maintenance, Expenses, Funds</li>
            <li>Real-time data sync when data changes</li>
            <li>Monthly reports and exports</li>
            <li>Stored in "SocietySync Backups" folder</li>
          </ul>
          <button 
            onClick={createSheet}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#6c757d' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            {loading ? 'Creating...' : 'Create Backup Sheet'}
          </button>
        </div>
      )}

      {status?.sheetEnabled && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div style={{ 
              background: 'var(--card-bg, #fff)', 
              borderRadius: '12px', 
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0 }}>Export Options</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                  onClick={exportExcel}
                  disabled={exporting}
                  style={{
                    padding: '10px 20px',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: exporting ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {exporting ? 'Exporting...' : 'Download Excel (.xlsx)'}
                </button>
                <div>
                  <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '8px' }}>
                    Export individual sheets as PDF:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Members', 'Flats', 'Payments', 'Maintenance', 'Expenses', 'Funds'].map(sheet => (
                      <button
                        key={sheet}
                        onClick={() => exportPDF(sheet)}
                        disabled={exporting}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          color: '#007bff',
                          border: '1px solid #007bff',
                          borderRadius: '4px',
                          cursor: exporting ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        {sheet}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'var(--card-bg, #fff)', 
              borderRadius: '12px', 
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginTop: 0 }}>Monthly Report</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <select 
                  value={reportMonth} 
                  onChange={(e) => setReportMonth(parseInt(e.target.value))}
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
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
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button 
                  onClick={generateReport}
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Generate Report
                </button>
              </div>

              {report && (
                <div>
                  <h4 style={{ marginBottom: '12px' }}>
                    {report.month} {report.year} Summary
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Total Members</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>{report.memberCount}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Total Flats</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>{report.flatCount}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Maintenance Billed</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>₹{report.totalMaintenanceBilled?.toLocaleString()}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Collected</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>₹{report.totalMaintenanceCollected?.toLocaleString()}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Outstanding</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: '#dc3545' }}>₹{report.outstanding?.toLocaleString()}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Total Expenses</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>₹{report.totalExpenses?.toLocaleString()}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: '#666' }}>Funds Collected</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>₹{report.totalFundsCollected?.toLocaleString()}</span>
                    </div>
                    <div style={{ background: '#007bff', padding: '12px', borderRadius: '8px', color: '#fff' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', opacity: 0.8 }}>Net Balance</span>
                      <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold' }}>₹{report.netBalance?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ 
            background: 'var(--card-bg, #fff)', 
            borderRadius: '12px', 
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0 }}>Data Sync Information</h3>
            <p>Data is automatically synced to Google Sheets when:</p>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li>New member registered or approved</li>
              <li>Payment recorded or updated</li>
              <li>Expense added, updated, or deleted</li>
              <li>Fund created or payment approved</li>
            </ul>
            <p style={{ color: '#666', fontSize: '0.85rem' }}>
              <small>Main database remains in MongoDB. Google Sheets serves as backup and reporting layer.</small>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleSheetsBackup;