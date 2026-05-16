import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminManagement = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('admins');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminsData, membersData] = await Promise.all([
        api.get('/api/admin/list'),
        api.get('/api/admin/members')
      ]);
      setAdmins(adminsData);
      setMembers(membersData);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePromote = async (userId, userName) => {
    if (!window.confirm(`Promote ${userName} to Admin?`)) return;
    setActionLoading(userId);
    try {
      await api.post(`/api/admin/promote/${userId}`);
      showToast(`${userName} promoted to Admin! 🎉`);
      fetchData();
    } catch (error) {
      showToast(error.message || 'Failed to promote', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId, userName) => {
    if (!window.confirm(`Demote ${userName} to Member? This will remove their admin access.`)) return;
    setActionLoading(userId);
    try {
      await api.post(`/api/admin/demote/${userId}`);
      showToast(`${userName} demoted to Member`);
      fetchData();
    } catch (error) {
      showToast(error.message || 'Failed to demote', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-mgmt">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <div className="admin-mgmt__header">
        <h1>👑 Admin Management</h1>
        <p>Manage admin roles and permissions for your society</p>
      </div>

      {/* Stats */}
      <div className="admin-mgmt__stats">
        <div className="admin-stat-card">
          <span className="admin-stat-card__icon">🛡️</span>
          <div>
            <span className="admin-stat-card__value">{admins.length}</span>
            <span className="admin-stat-card__label">Active Admins</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__icon">👥</span>
          <div>
            <span className="admin-stat-card__value">{members.length}</span>
            <span className="admin-stat-card__label">Members</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-mgmt__tabs">
        <button
          className={`admin-tab ${tab === 'admins' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('admins')}
        >
          🛡️ Admins ({admins.length})
        </button>
        <button
          className={`admin-tab ${tab === 'members' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('members')}
        >
          👥 Members ({members.length})
        </button>
      </div>

      {/* Admins List */}
      {tab === 'admins' && (
        <div className="admin-mgmt__list">
          {admins.length === 0 ? (
            <div className="admin-empty">No admins found</div>
          ) : (
            admins.map(admin => (
              <div key={admin._id} className="admin-card">
                <div className="admin-card__avatar">
                  {admin.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="admin-card__info">
                  <h3>{admin.name} {admin._id === user?._id && <span className="admin-you-badge">You</span>}</h3>
                  <p>{admin.email}</p>
                  <p className="admin-card__phone">📱 {admin.phone}</p>
                  <span className="admin-card__joined">Joined: {new Date(admin.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="admin-card__actions">
                  {admin._id !== user?._id && (
                    <button
                      className="admin-action-btn admin-action-btn--demote"
                      onClick={() => handleDemote(admin._id, admin.name)}
                      disabled={actionLoading === admin._id}
                    >
                      {actionLoading === admin._id ? '⏳' : '⬇️'} Demote
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Members List (for promotion) */}
      {tab === 'members' && (
        <div className="admin-mgmt__list">
          {members.length === 0 ? (
            <div className="admin-empty">No members available for promotion</div>
          ) : (
            members.map(member => (
              <div key={member._id} className="admin-card">
                <div className="admin-card__avatar admin-card__avatar--member">
                  {member.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="admin-card__info">
                  <h3>{member.name}</h3>
                  <p>{member.email}</p>
                  <p className="admin-card__phone">📱 {member.phone}</p>
                </div>
                <div className="admin-card__actions">
                  <button
                    className="admin-action-btn admin-action-btn--promote"
                    onClick={() => handlePromote(member._id, member.name)}
                    disabled={actionLoading === member._id}
                  >
                    {actionLoading === member._id ? '⏳' : '⬆️'} Make Admin
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
