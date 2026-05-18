import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ReminderSettings = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingPayments, setPendingPayments] = useState([]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/reminders/user');
      setReminders(res.reminders || []);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const createBulkReminders = async (daysBefore = 3) => {
    setCreating(true);
    setMessage('');
    try {
      const res = await api.post('/api/reminders/create-all-pending-reminders', { daysBefore });
      setMessage(res.message);
      await fetchReminders();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create reminders');
    } finally {
      setCreating(false);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await api.delete(`/api/reminders/${id}`);
      setReminders(reminders.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Reminders</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Reminders are sent automatically before payment due dates. 
            As an admin, you can create bulk reminders for all pending payments.
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">Admin Actions</h4>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => createBulkReminders(3)}
                disabled={creating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {creating ? 'Creating...' : 'Create 3-Day Reminders'}
              </button>
              <button
                onClick={() => createBulkReminders(7)}
                disabled={creating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {creating ? 'Creating...' : 'Create 7-Day Reminders'}
              </button>
            </div>
            {message && (
              <p className="mt-2 text-sm text-green-700">{message}</p>
            )}
          </div>
        )}

        <h4 className="font-medium mb-3">Your Reminders</h4>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reminders yet. Reminders will appear here when created.
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{reminder.title}</h5>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(reminder.status)}`}>
                        {reminder.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{reminder.message}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>Scheduled: {new Date(reminder.scheduledDate).toLocaleDateString('en-IN')}</span>
                      {reminder.sentDate && (
                        <span>Sent: {new Date(reminder.sentDate).toLocaleDateString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                  {reminder.status === 'pending' && (
                    <button
                      onClick={() => deleteReminder(reminder._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderSettings;