import { useState, useEffect } from 'react';
import api from '../utils/api';

const ACTION_ICONS = {
  payment_approved: '✅',
  payment_rejected: '❌',
  payment_edited: '✏️',
  payment_deleted: '🗑️',
  expense_created: '💸',
  expense_updated: '📝',
  expense_deleted: '🗑️',
  fund_created: '💰',
  fund_updated: '📝',
  fund_deleted: '🗑️',
  member_approved: '👤',
  member_rejected: '🚫',
  member_removed: '👋',
  admin_created: '🛡️',
  admin_removed: '⬇️',
  admin_role_changed: '🔄',
  maintenance_updated: '🏠',
  society_settings_updated: '⚙️',
  block_created: '🏢',
  block_deleted: '🗑️',
  flat_updated: '🏠',
  other: '📋'
};

const ACTION_COLORS = {
  payment_approved: '#10b981',
  payment_rejected: '#ef4444',
  payment_edited: '#6366f1',
  expense_created: '#f59e0b',
  expense_updated: '#6366f1',
  expense_deleted: '#ef4444',
  fund_created: '#10b981',
  admin_created: '#8b5cf6',
  admin_removed: '#ef4444',
  member_approved: '#10b981',
  member_rejected: '#ef4444',
  other: '#64748b'
};

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let url = `/api/admin/activity-log?page=${page}&limit=30`;
      if (filter) url += `&actionType=${filter}`;
      const data = await api.get(url);
      setLogs(data.logs || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Failed to load activity log:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 172800000) return 'Yesterday';

    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const uniqueActionTypes = [...new Set(logs.map(l => l.actionType))];

  return (
    <div className="activity-log">
      <div className="activity-log__header">
        <h1>📋 Activity Log</h1>
        <p>Track all admin actions and changes in your society</p>
      </div>

      {/* Filter */}
      <div className="activity-log__filter">
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="activity-filter-select"
        >
          <option value="">All Activities</option>
          <option value="payment_approved">✅ Payment Approved</option>
          <option value="payment_edited">✏️ Payment Edited</option>
          <option value="expense_created">💸 Expense Created</option>
          <option value="expense_updated">📝 Expense Updated</option>
          <option value="expense_deleted">🗑️ Expense Deleted</option>
          <option value="fund_created">💰 Fund Created</option>
          <option value="admin_created">🛡️ Admin Created</option>
          <option value="admin_removed">⬇️ Admin Removed</option>
          <option value="member_approved">👤 Member Approved</option>
          <option value="member_rejected">🚫 Member Rejected</option>
        </select>
        <span className="activity-log__count">
          {pagination.total || 0} activities
        </span>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="page-loader"><div className="spinner"></div></div>
      ) : logs.length === 0 ? (
        <div className="activity-empty">
          <span className="activity-empty__icon">📋</span>
          <h3>No activity logs yet</h3>
          <p>Admin actions will appear here once tracked</p>
        </div>
      ) : (
        <div className="activity-timeline">
          {logs.map((log, i) => (
            <div key={log._id || i} className="activity-item" style={{ animationDelay: `${i * 0.03}s` }}>
              <div
                className="activity-item__icon"
                style={{ background: ACTION_COLORS[log.actionType] || '#64748b' }}
              >
                {ACTION_ICONS[log.actionType] || '📋'}
              </div>
              <div className="activity-item__content">
                <p className="activity-item__desc">{log.description}</p>
                <div className="activity-item__meta">
                  <span className="activity-item__admin">
                    👤 {log.adminName}
                  </span>
                  <span className="activity-item__time">
                    🕐 {formatDate(log.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="activity-pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="activity-page-btn"
          >
            ← Previous
          </button>
          <span className="activity-page-info">
            Page {page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage(p => p + 1)}
            className="activity-page-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
