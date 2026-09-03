import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import PriorityBadge from '../PriorityBadge/PriorityBadge';
import { formatDate, formatRelativeTime, truncateText } from '../../utils/helpers';
import { MapPin, Calendar, ArrowRight, User, Paperclip, Building } from 'lucide-react';

export const ComplaintCard = ({ complaint, isAdmin = false }) => {
  const detailLink = isAdmin
    ? `/admin/complaints/${complaint._id || complaint.complaintId}`
    : `/complaints/${complaint._id || complaint.complaintId}`;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 glass-card glass-card-hover transition-all duration-200">
      <div>
        {/* Top Header: ID, Category, Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-400">
              #{complaint.complaintId}
            </span>
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
              {complaint.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={complaint.priority} size="sm" />
            <StatusBadge status={complaint.status} size="sm" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-3.5">
          <Link to={detailLink}>
            <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              {complaint.title}
            </h3>
          </Link>
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {truncateText(complaint.description, 120)}
          </p>
        </div>

        {/* Location & Metadata */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-slate-500 shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </div>

          {complaint.assignedDepartment && (
            <div className="flex items-center gap-1.5">
              <Building size={13} className="text-purple-400 shrink-0" />
              <span className="text-purple-300 font-medium">{complaint.assignedDepartment}</span>
            </div>
          )}

          {isAdmin && complaint.student && (
            <div className="flex items-center gap-1.5">
              <User size={13} className="text-indigo-400 shrink-0" />
              <span className="text-slate-300 truncate">
                {complaint.student.name} ({complaint.student.studentId || complaint.student.department || 'Student'})
              </span>
            </div>
          )}

          {complaint.attachment?.url && (
            <div className="flex items-center gap-1 text-[11px] text-indigo-400">
              <Paperclip size={12} />
              <span>Attachment included</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Date & Link */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5 text-xs">
        <div className="flex items-center gap-1 text-slate-400" title={formatDate(complaint.createdAt)}>
          <Calendar size={13} />
          <span>{formatRelativeTime(complaint.createdAt)}</span>
        </div>

        <Link
          to={detailLink}
          className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
