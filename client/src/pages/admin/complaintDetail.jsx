import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getAdminComplaintById,
  updateComplaint,
  assignComplaint,
  addComment,
  resolveComplaint,
  closeComplaint,
  deleteComplaint,
} from '../../services/adminService';
import { useSocket } from '../../store/socketContext';
import { PRIORITIES, STATUSES } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge';
import ComplaintTimeline from '../../components/ComplaintTimeline/ComplaintTimeline';
import CommentBox from '../../components/CommentBox/CommentBox';
import AssignmentPanel from '../../components/AssignmentPanel/AssignmentPanel';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import LoadingState from '../../components/LoadingState/LoadingState';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import {
  ArrowLeft,
  Building,
  User,
  MapPin,
  Calendar,
  Paperclip,
  CheckCircle2,
  XCircle,
  Trash2,
  UserCheck,
  Download,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Flag,
} from 'lucide-react';

export const AdminComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [resolveText, setResolveText] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCloseOpen, setIsCloseOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getAdminComplaintById(id);
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

  // Live updates
  useEffect(() => {
    if (!socket || !data?.complaint?._id) return;
    socket.emit('join_complaint', data.complaint._id);

    const handleLiveEvent = () => fetchDetails();
    socket.on('complaint_updated', handleLiveEvent);
    socket.on('comment_added', handleLiveEvent);
    socket.on('complaint_resolved', handleLiveEvent);
    socket.on('complaint_closed', handleLiveEvent);

    return () => {
      socket.off('complaint_updated', handleLiveEvent);
      socket.off('comment_added', handleLiveEvent);
      socket.off('complaint_resolved', handleLiveEvent);
      socket.off('complaint_closed', handleLiveEvent);
    };
  }, [socket, data?.complaint?._id]);

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      setActionLoading(true);
      await updateComplaint(data.complaint._id, { priority: newPriority });
      showNotification(`Priority updated to ${newPriority.toUpperCase()}`);
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update priority');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      await updateComplaint(data.complaint._id, { status: newStatus });
      showNotification(`Status updated to ${newStatus.replace('_', ' ')}`);
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid status transition');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (assignData) => {
    try {
      setActionLoading(true);
      await assignComplaint(data.complaint._id, assignData);
      setIsAssignOpen(false);
      showNotification('Department and staff successfully assigned');
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      setActionLoading(true);
      await addComment(data.complaint._id, commentData);
      showNotification('Progress update posted');
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolveText.trim()) return;
    try {
      setActionLoading(true);
      await resolveComplaint(data.complaint._id, { description: resolveText.trim() });
      setIsResolveOpen(false);
      setResolveText('');
      showNotification('Complaint successfully marked as Resolved');
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    try {
      setActionLoading(true);
      await closeComplaint(data.complaint._id);
      setIsCloseOpen(false);
      showNotification('Complaint officially closed');
      await fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteComplaint(data.complaint._id);
      navigate('/admin/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete complaint');
      setIsDeleteOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading administrative complaint details..." />;
  }

  if (error && !data?.complaint) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
        <AlertCircle size={40} className="text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Complaint Not Found</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Back to Complaints</span>
        </Link>
      </div>
    );
  }

  const { complaint, comments, history } = data;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Complaints Management</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-indigo-400">
            #{complaint.complaintId}
          </span>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Complaint"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Details Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card shadow-2xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                    {complaint.category}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">
                    Submitted {formatDate(complaint.createdAt)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white mt-1.5">{complaint.title}</h1>
              </div>

              <div className="flex items-center gap-2">
                <PriorityBadge priority={complaint.priority} size="md" />
                <StatusBadge status={complaint.status} size="md" />
              </div>
            </div>

            {/* Resolution Banner if present */}
            {complaint.resolutionDetails?.description && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                  <CheckCircle2 size={16} />
                  <span>Recorded Resolution</span>
                </div>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {complaint.resolutionDetails.description}
                </p>
                {complaint.resolvedAt && (
                  <p className="text-[11px] text-slate-400 pt-1">
                    Resolved on {formatDate(complaint.resolvedAt)} by{' '}
                    {complaint.resolvedBy?.name || 'Admin'}
                  </p>
                )}
              </div>
            )}

            {/* Problem Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Student Report
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                {complaint.description}
              </p>
            </div>

            {/* Student & Location Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <User size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase">Student Details</p>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    {complaint.student?.name || 'Unknown'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {complaint.student?.email} • ID: {complaint.student?.studentId || 'N/A'}
                  </p>
                  {complaint.student?.phone && (
                    <p className="text-[11px] text-slate-400">Phone: {complaint.student?.phone}</p>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <MapPin size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase">Location</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{complaint.location}</p>
                  <p className="text-[11px] text-slate-400">Branch: {complaint.student?.department}</p>
                </div>
              </div>
            </div>

            {/* Attachment preview if present */}
            {complaint.attachment?.url && (
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Paperclip size={18} className="text-indigo-400" />
                  <div>
                    <p className="text-xs font-semibold text-white truncate max-w-xs">
                      {complaint.attachment.originalName || complaint.attachment.filename}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {complaint.attachment.fileType} •{' '}
                      {((complaint.attachment.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <a
                  href={complaint.attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </div>
            )}
          </div>

          {/* Comment Box */}
          <CommentBox
            onSubmit={handleAddComment}
            currentStatus={complaint.status}
            loading={actionLoading}
            isAdmin={true}
          />

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card shadow-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Full Lifecycle History</h2>
              <p className="text-xs text-slate-400">Complete audit trail for accountability</p>
            </div>
            <ComplaintTimeline history={history} comments={comments} />
          </div>
        </div>

        {/* Right Column: Administrative Actions & Controls */}
        <div className="space-y-6">
          {/* Action Hub Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 glass-card shadow-2xl space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-purple-400" />
              Administrative Actions
            </h3>

            {/* Assignment Section */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Assigned Department & Staff
              </label>
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Department:</span>
                  <span className="text-xs font-semibold text-purple-300">
                    {complaint.assignedDepartment || 'Not Assigned'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Staff Member:</span>
                  <span className="text-xs font-medium text-slate-200">
                    {complaint.assignedStaff?.name || 'None (Dept Pool)'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAssignOpen(true)}
                className="w-full py-2 px-3 rounded-xl border border-indigo-500/30 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck size={14} />
                <span>{complaint.assignedDepartment ? 'Re-Assign Department' : 'Assign Department'}</span>
              </button>
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Change Priority Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePriorityChange(p.value)}
                    disabled={actionLoading || complaint.priority === p.value}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider border text-center transition-all ${
                      complaint.priority === p.value
                        ? `${p.color} ring-2 ring-indigo-500/40 shadow-sm`
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Status Progression Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Status Lifecycle Control
              </label>
              <div className="space-y-2">
                {complaint.status === 'submitted' && (
                  <button
                    onClick={() => handleStatusChange('under_review')}
                    disabled={actionLoading}
                    className="w-full py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-600/30 transition-all"
                  >
                    Mark as Under Review
                  </button>
                )}

                {['submitted', 'under_review', 'assigned'].includes(complaint.status) && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={actionLoading}
                    className="w-full py-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-600/30 transition-all"
                  >
                    Mark as In Progress
                  </button>
                )}

                {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                  <button
                    onClick={() => setIsResolveOpen(true)}
                    disabled={actionLoading}
                    className="w-full py-2 rounded-xl gradient-brand text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <CheckCircle2 size={14} />
                    <span>Record Resolution & Resolve</span>
                  </button>
                )}

                {complaint.status === 'resolved' && (
                  <button
                    onClick={() => setIsCloseOpen(true)}
                    disabled={actionLoading}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                  >
                    <XCircle size={14} />
                    <span>Finalize and Close Complaint</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <AssignmentPanel
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onAssign={handleAssign}
        currentDepartment={complaint.assignedDepartment}
        currentStaffId={complaint.assignedStaff?._id}
        loading={actionLoading}
      />

      {/* Resolve Modal */}
      {isResolveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsResolveOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <h3 className="text-base font-semibold text-white">Record Issue Resolution</h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Resolution Summary / Action Taken <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={resolveText}
                onChange={(e) => setResolveText(e.target.value)}
                placeholder="Explain the steps taken to fix the issue, parts replaced, technician remarks..."
                className="w-full glass-input text-xs"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsResolveOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolve}
                disabled={actionLoading || !resolveText.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                <span>{actionLoading ? 'Saving...' : 'Confirm Resolution'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCloseOpen}
        onClose={() => setIsCloseOpen(false)}
        onConfirm={handleClose}
        title="Close Complaint"
        message="Are you sure you want to officially close this complaint? Once closed, the complaint lifecycle is finalized."
        confirmText="Confirm & Close"
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Complaint"
        message="Are you sure you want to permanently delete this complaint and all associated history? This action cannot be undone."
        confirmText="Delete Complaint"
        isDestructive={true}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminComplaintDetailPage;
