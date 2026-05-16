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
      const data = await api.get('/api/sheets/status');
      setStatus(data);
    } catch (err) {
      setMessage(err.message);
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
      <div className="page-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Google Sheets Backup</h1>
        <p className="text-muted">Automatic backup system for SocietySync data</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') || message.includes('started') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="backup-status-card">
        <div className="status-header">
          <div className="status-icon">
            {status?.sheetEnabled ? (
              <span className="badge badge-success">Active</span>
            ) : (
              <span className="badge badge-warning">Not Enabled</span>
            )}
          </div>
          <div className="status-info">
            <h3>Backup Status</h3>
            {status?.sheetEnabled && (
              <p className="text-muted">
                Last synced: {status.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleString() : 'Never'}
              </p>
            )}
          </div>
        </div>

        {status?.sheetEnabled && (
          <div className="status-actions">
            <button className="btn btn-primary" onClick={openSheet}>
              Open Google Sheet
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={syncNow} 
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        )}
      </div>

      {!status?.sheetEnabled && (
        <div className="enable-backup-section">
          <div className="card">
            <h3>Enable Automatic Backup</h3>
            <p>Create a dedicated Google Sheet for your society with automatic data sync.</p>
            <ul className="feature-list">
              <li>Auto-created tabs: Members, Flats, Payments, Maintenance, Expenses, Funds</li>
              <li>Real-time data sync when data changes</li>
              <li>Monthly reports and exports</li>
              <li>Stored in "SocietySync Backups" folder</li>
            </ul>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={createSheet}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Backup Sheet'}
            </button>
          </div>
        </div>
      )}

      {status?.sheetEnabled && (
        <>
          <div className="backup-sections">
            <div className="card">
              <h3>Export Options</h3>
              <div className="export-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={exportExcel}
                  disabled={exporting}
                >
                  {exporting ? 'Exporting...' : 'Download Excel (.xlsx)'}
                </button>
                <div className="pdf-exports">
                  <p className="text-muted">Export individual sheets as PDF:</p>
                  <div className="pdf-buttons">
                    {['Members', 'Flats', 'Payments', 'Maintenance', 'Expenses', 'Funds'].map(sheet => (
                      <button
                        key={sheet}
                        className="btn btn-outline"
                        onClick={() => exportPDF(sheet)}
                        disabled={exporting}
                      >
                        {sheet}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Monthly Report</h3>
              <div className="report-filters">
                <select 
                  value={reportMonth} 
                  onChange={(e) => setReportMonth(parseInt(e.target.value))}
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
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={generateReport}>
                  Generate Report
                </button>
              </div>

              {report && (
                <div className="report-details">
                  <h4>{report.month} {report.year} Summary</h4>
                  <div className="report-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Members</span>
                      <span className="stat-value">{report.memberCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Flats</span>
                      <span className="stat-value">{report.flatCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Maintenance Billed</span>
                      <span className="stat-value">₹{report.totalMaintenanceBilled?.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Maintenance Collected</span>
                      <span className="stat-value">₹{report.totalMaintenanceCollected?.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Outstanding</span>
                      <span className="stat-value">₹{report.outstanding?.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Expenses</span>
                      <span className="stat-value">₹{report.totalExpenses?.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Funds Collected</span>
                      <span className="stat-value">₹{report.totalFundsCollected?.toLocaleString()}</span>
                    </div>
                    <div className="stat-item highlight">
                      <span className="stat-label">Net Balance</span>
                      <span className="stat-value">₹{report.netBalance?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card sync-info">
            <h3>Data Sync Information</h3>
            <p>Data is automatically synced to Google Sheets when:</p>
            <ul>
              <li>New member registered or approved</li>
              <li>Payment recorded or updated</li>
              <li>Expense added, updated, or deleted</li>
              <li>Fund created or payment approved</li>
            </ul>
            <p className="text-muted">
              <small>Main database remains in MongoDB. Google Sheets serves as backup and reporting layer.</small>
            </p>
          </div>
        </>
      )}

      <style>{`
        .backup-status-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .status-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .status-icon {
          font-size: 2rem;
        }
        .status-info h3 {
          margin: 0;
        }
        .status-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .enable-backup-section {
          margin-bottom: 20px;
        }
        .feature-list {
          margin: 15px 0;
          padding-left: 20px;
        }
        .feature-list li {
          margin: 8px 0;
        }
        .backup-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        @media (max-width: 768px) {
          .backup-sections {
            grid-template-columns: 1fr;
          }
        }
        .export-buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .pdf-exports {
          margin-top: 10px;
        }
        .pdf-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .report-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }
        .report-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .stat-item {
          background: var(--bg-secondary);
          padding: 12px;
          border-radius: 8px;
        }
        .stat-item.highlight {
          background: var(--primary-color);
          color: white;
        }
        .stat-label {
          display: block;
          font-size: 0.85rem;
          opacity: 0.8;
        }
        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: bold;
        }
        .sync-info ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .badge {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .badge-success {
          background: #d4edda;
          color: #155724;
        }
        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default GoogleSheetsBackup;