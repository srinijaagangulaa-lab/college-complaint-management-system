import React, { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import { formatRelativeTime } from '../../utils/helpers';
import { Bell, Check, CheckCheck, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ limit: 15 });
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="text-indigo-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              {notifications.some((n) => !n.isRead) && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium px-2 py-1 rounded-lg hover:bg-slate-800"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
                <p className="text-sm">Loading updates...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center px-4">
                <Bell size={36} className="mb-2 stroke-1" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs mt-1">You will receive updates when complaints change status.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    n.isRead
                      ? 'bg-slate-900/60 border-slate-800/60 text-slate-300'
                      : 'bg-indigo-950/20 border-indigo-500/30 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                        )}
                        <h4 className="text-sm font-medium">{n.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                        {n.complaint && (
                          <Link
                            to={`/complaints/${n.complaint._id || n.complaint.complaintId || n.complaint}`}
                            onClick={onClose}
                            className="text-[11px] text-indigo-400 hover:underline font-medium"
                          >
                            View Complaint &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                    {!n.isRead && (
                      <button
                        title="Mark as read"
                        onClick={(e) => handleMarkRead(n._id, e)}
                        className="text-slate-500 hover:text-indigo-400 p-1"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
