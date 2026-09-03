import React from 'react';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import StatusBadge from '../StatusBadge/StatusBadge';

import {
  CheckCircle2,
  Clock,
  MessageSquare,
  UserCheck,
  Shield,
  XCircle,
  ArrowRight,
} from 'lucide-react';

const ACTION_ICONS = {
  created: Clock,
  status_change: ArrowRight,
  assigned: UserCheck,
  priority_change: Shield,
  comment_added: MessageSquare,
  resolved: CheckCircle2,
  closed: XCircle,
};

const formatStatus = (status) => {
  if (!status) return '';

  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getHistoryTitle = (history) => {
  switch (history.action) {
    case 'created':
      return 'Complaint Submitted';

    case 'status_change':
      return `Status changed to ${formatStatus(history.newStatus)}`;

    case 'assigned':
      return `Assigned to ${history.metadata?.department || 'Department'
        }`;

    case 'priority_change':
      return `Priority changed to ${history.metadata?.newPriority || 'New Priority'
        }`;

    case 'resolved':
      return 'Complaint Marked Resolved';

    case 'closed':
      return 'Complaint Officially Closed';

    default:
      return 'Activity Logged';
  }
};

const getHistoryDetails = (history) => {
  if (history.metadata?.note) {
    return history.metadata.note;
  }

  if (history.metadata?.description) {
    return history.metadata.description;
  }

  if (
    history.action === 'assigned' &&
    history.metadata?.staffName
  ) {
    return `Responsible Staff: ${history.metadata.staffName}`;
  }

  if (
    history.action === 'priority_change' &&
    history.metadata?.oldPriority
  ) {
    return `Previous priority: ${history.metadata.oldPriority}`;
  }

  return '';
};

export const ComplaintTimeline = ({
  history = [],
  comments = [],
}) => {
  /*
   * Make sure history/comments are always arrays.
   */
  const safeHistory = Array.isArray(history) ? history : [];
  const safeComments = Array.isArray(comments) ? comments : [];

  /*
   * Combine complaint history and comments.
   */
  const timelineItems = [
    ...safeHistory.map((item) => ({
      id: item._id || item.id,
      type: 'history',
      action: item.action || 'created',
      user: item.changedBy || item.user,
      date: item.createdAt || item.updatedAt,
      title: getHistoryTitle(item),
      details: getHistoryDetails(item),
      previousStatus: item.previousStatus,
      newStatus: item.newStatus,
      isInternal: false,
    })),

    ...safeComments.map((item) => ({
      id: item._id || item.id,
      type: 'comment',
      action: 'comment_added',
      user: item.author || item.user,
      date: item.createdAt || item.updatedAt,
      title: `Comment from ${item.author?.name || 'Staff'}`,
      details: item.comment || '',
      isInternal: item.isInternal || false,
      previousStatus: item.previousStatus,
      newStatus: item.newStatus,
    })),
  ]
    .filter((item) => item.date)
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

  /*
   * No timeline records.
   */
  if (timelineItems.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500">
        No lifecycle history recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {timelineItems.map((item, index) => {
        const IconComponent =
          ACTION_ICONS[item.action] || Clock;

        return (
          <div
            key={item.id || `${item.type}-${index}`}
            className="relative group"
          >
            {/* Timeline marker */}
            <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 ring-4 ring-slate-950 border border-indigo-500/50 group-hover:border-indigo-400">
              <IconComponent
                size={9}
                className="text-indigo-400"
              />
            </div>

            {/* Timeline card */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-colors group-hover:border-slate-700">

              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    {item.title}
                  </span>

                  {item.newStatus && (
                    <StatusBadge
                      status={item.newStatus}
                      size="sm"
                    />
                  )}

                  {item.isInternal && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                      Internal
                    </span>
                  )}
                </div>

                <span
                  className="text-[11px] text-slate-500"
                  title={formatDate(item.date)}
                >
                  {formatRelativeTime(item.date)}
                </span>
              </div>

              {/* Details */}
              {item.details && (
                <p className="mt-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40 leading-relaxed whitespace-pre-wrap">
                  {item.details}
                </p>
              )}

              {/* Status transition */}
              {item.previousStatus && item.newStatus && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="capitalize">
                    {formatStatus(item.previousStatus)}
                  </span>

                  <ArrowRight
                    size={12}
                    className="text-slate-600"
                  />

                  <span className="capitalize text-slate-300">
                    {formatStatus(item.newStatus)}
                  </span>
                </div>
              )}

              {/* Footer */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>
                  By:{' '}
                  <span className="text-slate-400">
                    {item.user?.name || 'System'}
                  </span>{' '}
                  ({item.user?.role || 'system'})
                </span>

                <span>{formatDate(item.date)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComplaintTimeline;