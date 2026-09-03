import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComplaintById } from '../../services/complaintService';
import { useSocket } from '../../store/socketContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge';
import ComplaintTimeline from '../../components/ComplaintTimeline/ComplaintTimeline';
import LoadingState from '../../components/LoadingState/LoadingState';
import { formatDate } from '../../utils/helpers';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  User,
  Paperclip,
  CheckCircle2,
  Download,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getComplaintById(id);
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load complaint details. Please check the ID.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!socket || !data?.complaint?._id) return;

    socket.emit('join_complaint', data.complaint._id);

    const handleUpdate = () => {
      fetchDetails();
    };

    socket.on('complaint_updated', handleUpdate);
    socket.on('comment_added', handleUpdate);
    socket.on('complaint_resolved', handleUpdate);
    socket.on('complaint_closed', handleUpdate);

    return () => {
      socket.off('complaint_updated', handleUpdate);
      socket.off('comment_added', handleUpdate);
      socket.off('complaint_resolved', handleUpdate);
      socket.off('complaint_closed', handleUpdate);
    };
  }, [socket, data?.complaint?._id]);

  if (loading) {
    return <LoadingState message="Loading complaint details..." />;
  }

  if (error || !data?.complaint) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
        <ShieldAlert size={40} className="text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Complaint Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This complaint may not exist or you lack permission to view it.'}</p>
        <Link
          to="/complaints"
          className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Back to My Complaints</span>
        </Link>
      </div>
    );
  }

  const { complaint, comments, history } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/complaints"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Complaints</span>
        </Link>
        <span className="font-mono text-xs font-bold text-indigo-400">
          #{complaint.complaintId}
        </span>
      </div>

      {/* Main Details Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 glass-card shadow-2xl space-y-6">
        {/* Header Title & Badges */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1.5 flex-1 min-w-[280px]">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                {complaint.category}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Submitted {formatDate(complaint.createdAt)}</span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-snug">{complaint.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} size="md" />
            <StatusBadge status={complaint.status} size="md" />
          </div>
        </div>

        {/* Resolution Banner (if resolved/closed) */}
        {complaint.resolutionDetails?.description && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
              <CheckCircle2 size={16} />
              <span>Official Resolution Details</span>
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
              {complaint.resolutionDetails.description}
            </p>
            {complaint.resolvedAt && (
              <p className="text-[11px] text-slate-400 pt-1">
                Resolved on {formatDate(complaint.resolvedAt)} by{' '}
                {complaint.resolvedBy?.name || 'Administrator'}
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Problem Description
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            {complaint.description}
          </p>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
            <MapPin size={18} className="text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase">Issue Location</p>
              <p className="text-xs font-semibold text-white mt-0.5">{complaint.location}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
            <Building size={18} className="text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase">Assigned Department</p>
              <p className="text-xs font-semibold text-purple-300 mt-0.5">
                {complaint.assignedDepartment || 'Pending Assignment'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
            <Calendar size={18} className="text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase">Last Updated</p>
              <p className="text-xs font-semibold text-white mt-0.5">{formatDate(complaint.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Attachment (if present) */}
        {complaint.attachment?.url && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Attached Evidence / Document
            </h3>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Paperclip size={20} className="text-indigo-400" />
                <div>
                  <p className="text-xs font-semibold text-white truncate max-w-sm">
                    {complaint.attachment.originalName || complaint.attachment.filename}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {complaint.attachment.fileType || 'File'} •{' '}
                    {complaint.attachment.fileSize
                      ? `${(complaint.attachment.fileSize / (1024 * 1024)).toFixed(2)} MB`
                      : 'Attachment'}
                  </p>
                </div>
              </div>

              <a
                href={complaint.attachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <Download size={14} />
                <span>View / Download</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Audit History & Updates Timeline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 glass-card shadow-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">Complaint Lifecycle Timeline</h2>
          <p className="text-xs text-slate-400">
            Real-time audit log of all transitions, department assignments, and progress notes
          </p>
        </div>

        <ComplaintTimeline history={history} comments={comments} />
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
