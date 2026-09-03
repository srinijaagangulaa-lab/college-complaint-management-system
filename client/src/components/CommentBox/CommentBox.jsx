import React, { useState } from 'react';
import { STATUSES } from '../../utils/constants';
import { MessageSquare, Send, CheckCircle2, Lock } from 'lucide-react';

export const CommentBox = ({ onSubmit, currentStatus, loading = false, isAdmin = false }) => {
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmit({
      comment: comment.trim(),
      status: newStatus || undefined,
      isInternal,
    });

    setComment('');
    setNewStatus('');
    setIsInternal(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 glass-card">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-indigo-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
          Post Progress Update
        </h4>
      </div>

      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter progress remarks, status changes, or actions taken..."
        className="w-full glass-input text-xs"
        required
      />

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          {/* Optional Status Transition */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Update Status to:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs outline-none"
              >
                <option value="">(Keep current: {currentStatus})</option>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Internal note checkbox (admin only) */}
          {isAdmin && (
            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-slate-800 text-indigo-600 focus:ring-0"
              />
              <Lock size={12} className="text-amber-400" />
              <span>Internal staff note</span>
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="px-4 py-2 rounded-xl gradient-brand text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send size={13} />
          <span>{loading ? 'Posting...' : 'Post Update'}</span>
        </button>
      </div>
    </form>
  );
};

export default CommentBox;
