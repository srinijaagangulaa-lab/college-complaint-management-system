import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { formatRelativeTime, formatDate } from '../utils/helpers';
import LoadingState from '../components/LoadingState/LoadingState';
import EmptyState from '../components/EmptyState/EmptyState';
import { Bell, Check, CheckCheck, FileText, ArrowRight } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ unreadOnly: filter === 'unread', limit: 50 });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell size={24} className="text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Notifications Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status updates and department communications regarding complaints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all' ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'unread' ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread Only
            </button>
          </div>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-medium text-indigo-400 hover:bg-slate-800"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingState message="Loading your notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! No notifications to display."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all glass-card ${
                n.isRead
                  ? 'bg-slate-900/60 border-slate-800/60 text-slate-300'
                  : 'bg-indigo-950/30 border-indigo-500/40 text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                    )}
                    <h3 className="text-sm font-semibold text-white">{n.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{n.message}</p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-2 text-[11px] text-slate-500">
                    <span>{formatDate(n.createdAt)} ({formatRelativeTime(n.createdAt)})</span>
                    {n.complaint && (
                      <Link
                        to={`/complaints/${n.complaint._id || n.complaint.complaintId || n.complaint}`}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
                      >
                        <span>View Ticket #{n.complaint.complaintId || ''}</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
