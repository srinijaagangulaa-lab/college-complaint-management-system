import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import PriorityBadge from '../PriorityBadge/PriorityBadge';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { ArrowUpDown, ArrowRight, Paperclip } from 'lucide-react';

export const ComplaintTable = ({ complaints, isAdmin = false, onSort, currentSort = {} }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 glass-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort?.('complaintId')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Complaint ID</span>
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5">Title & Category</th>
              {isAdmin && <th scope="col" className="px-4 py-3.5">Student</th>}
              <th scope="col" className="px-4 py-3.5">Department / Location</th>
              <th scope="col" className="px-4 py-3.5">Priority</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5">
                <button
                  onClick={() => onSort?.('createdAt')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Submitted</span>
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {complaints.map((c) => {
              const detailLink = isAdmin
                ? `/admin/complaints/${c._id || c.complaintId}`
                : `/complaints/${c._id || c.complaintId}`;

              return (
                <tr
                  key={c._id}
                  className="hover:bg-slate-850/60 transition-colors group"
                >
                  {/* ID */}
                  <td className="px-4 py-3.5 font-mono font-bold text-indigo-400">
                    <Link to={detailLink} className="hover:underline">
                      #{c.complaintId}
                    </Link>
                  </td>

                  {/* Title & Category */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={detailLink}
                        className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate block"
                      >
                        {c.title}
                      </Link>
                      {c.attachment?.url && (
                        <Paperclip size={12} className="text-slate-400 shrink-0" />
                      )}
                    </div>
                    <span className="inline-block mt-0.5 text-[10px] text-slate-400">
                      {c.category}
                    </span>
                  </td>

                  {/* Student (Admin only) */}
                  {isAdmin && (
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-200 truncate">
                        {c.student?.name || 'Unknown'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {c.student?.studentId || c.student?.department || ''}
                      </p>
                    </td>
                  )}

                  {/* Dept / Location */}
                  <td className="px-4 py-3.5 max-w-xs truncate">
                    {c.assignedDepartment ? (
                      <span className="font-medium text-purple-300 block">
                        {c.assignedDepartment}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic block">Unassigned</span>
                    )}
                    <span className="text-[10px] text-slate-400 truncate block">{c.location}</span>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3.5">
                    <PriorityBadge priority={c.priority} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={c.status} size="sm" />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap" title={formatDate(c.createdAt)}>
                    {formatRelativeTime(c.createdAt)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to={detailLink}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 rounded-lg p-1.5 hover:bg-slate-800 transition-colors"
                    >
                      <span className="hidden sm:inline text-xs">Manage</span>
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
