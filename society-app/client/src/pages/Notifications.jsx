import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ notifications: [], unreadCount: 0 });
  const [loading, setLoading] = useState(true);

  const typeIcons = {
    payment: '💰',
    announcement: '📢',
    maintenance: '🛠️',
    event: '🎉',
    warning: '🚨'
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`);
      setData(res.data);
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`);
      fetchNotifications();
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="animate-up">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p className="page-subtitle uppercase tracking-widest mb-1">Inbox</p>
          <h1 className="page-title">Notifications</h1>
        </div>
        {data.unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2 border-b-2 border-indigo-100 pb-1">
            Mark all read
          </button>
        )}
      </header>

      {/* Unread Highlight */}
      {data.unreadCount > 0 && (
        <div className="bg-indigo-600 text-white rounded-3xl p-6 mb-8 flex items-center justify-between shadow-xl shadow-indigo-900/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🔔</div>
            <div>
              <p className="font-black text-lg">{data.unreadCount} New Alerts</p>
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Action items for you</p>
            </div>
          </div>
        </div>
      )}

      {/* Notification List */}
      <div className="flex flex-col gap-4">
        {data.notifications.map(notif => {
          const isRead = notif.readBy?.includes(user?.id || user?._id);
          return (
            <div key={notif._id} 
              className={`
                card group transition-all cursor-pointer p-0 overflow-hidden
                ${isRead ? 'opacity-70 grayscale-[0.5]' : 'ring-2 ring-indigo-500/10 shadow-lg'}
              `}
              onClick={() => !isRead && markAsRead(notif._id)}>
              <div className="p-6 flex gap-5 relative">
                {!isRead && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>}
                
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0
                  ${isRead ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}
                `}>
                  {typeIcons[notif.type] || '📌'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-black truncate pr-4 ${isRead ? 'text-secondary' : 'text-slate-900'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[9px] font-black text-slate-400 whitespace-nowrap uppercase tracking-tighter">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  
                  <p className={`text-xs leading-relaxed mb-3 ${isRead ? 'text-secondary' : 'text-slate-600 font-medium'}`}>
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      {notif.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {data.notifications.length === 0 && (
          <div className="card text-center py-24">
            <div className="text-6xl mb-6">🏝️</div>
            <h2 className="text-xl font-black mb-2">Inbox is Empty</h2>
            <p className="text-secondary font-medium">You're all caught up with your society updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
