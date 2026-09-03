import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../services/dashboardService';
import MetricCard from '../../components/MetricCard/MetricCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge/PriorityBadge';
import LoadingState from '../../components/LoadingState/LoadingState';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import {
  FileText,
  Clock,
  UserCheck,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Users,
  Percent,
  ArrowRight,
  ShieldCheck,
  Building,
  BarChart3,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      setData(res.data);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Loading administrative analytics..." />;
  }

  const { metrics, recentActivity, categoryBreakdown, priorityBreakdown, statusBreakdown, departmentBreakdown } = data || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              CAMPUS ADMINISTRATION PORTAL
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Complaint Analytics & Operations
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Real-time monitoring across college departments, urgent issues, and resolution performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/complaints"
              className="inline-flex items-center gap-2 rounded-2xl gradient-brand px-5 py-3 text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              <ShieldCheck size={16} />
              <span>Manage All Complaints</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Total Complaints"
          value={metrics?.total || 0}
          icon={FileText}
          color="indigo"
        />
        <MetricCard
          title="New / Submitted"
          value={metrics?.newSubmitted || 0}
          icon={Clock}
          color="slate"
        />
        <MetricCard
          title="Assigned"
          value={metrics?.assigned || 0}
          icon={UserCheck}
          color="purple"
        />
        <MetricCard
          title="In Progress"
          value={metrics?.inProgress || 0}
          icon={PlayCircle}
          color="amber"
        />
        <MetricCard
          title="Critical Issues"
          value={metrics?.criticalPriority || 0}
          icon={Flame}
          color="rose"
        />
        <MetricCard
          title="Resolution Rate"
          value={`${metrics?.resolutionRate || 0}%`}
          icon={Percent}
          color="emerald"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 glass-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-400" />
              Complaints by Category
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {categoryBreakdown?.length || 0} categories
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {categoryBreakdown?.map((cat) => {
              const percentage = metrics?.total > 0 ? Math.round((cat.count / metrics.total) * 100) : 0;
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate">{cat.category}</span>
                    <span className="text-slate-400 font-mono">
                      {cat.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Status Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 glass-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Priority & Status Spread
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                By Priority
              </p>
              <div className="grid grid-cols-2 gap-2">
                {priorityBreakdown?.map((p) => (
                  <div
                    key={p.priority}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between"
                  >
                    <PriorityBadge priority={p.priority} size="sm" />
                    <span className="font-mono text-xs font-bold text-white">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                By Status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {statusBreakdown?.map((s) => (
                  <div
                    key={s.status}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between"
                  >
                    <StatusBadge status={s.status} size="sm" />
                    <span className="font-mono text-xs font-bold text-white">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department Workload */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 glass-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building size={16} className="text-purple-400" />
              Department Workload
            </h3>
            <Link to="/admin/departments" className="text-[11px] text-purple-400 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {departmentBreakdown?.map((dept) => {
              const percentage = metrics?.total > 0 ? Math.round((dept.count / metrics.total) * 100) : 0;
              return (
                <div key={dept.department} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate">{dept.department}</span>
                    <span className="text-slate-400 font-mono">
                      {dept.count} complaints
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Complaint Operations</h2>
            <p className="text-xs text-slate-400">
              Latest complaints filed across campus requiring review or dispatch
            </p>
          </div>
          <Link
            to="/admin/complaints"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>View All Operations</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Complaint</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentActivity?.map((c) => (
                <tr key={c._id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-400">
                    <Link to={`/admin/complaints/${c._id}`}>#{c.complaintId}</Link>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-semibold text-white truncate">{c.title}</p>
                    <span className="text-[10px] text-slate-400">{c.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-200">{c.student?.name}</p>
                    <span className="text-[10px] text-slate-400">{c.student?.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    {c.assignedDepartment ? (
                      <span className="text-purple-300 font-medium">{c.assignedDepartment}</span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={c.priority} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-slate-400" title={formatDate(c.updatedAt)}>
                    {formatRelativeTime(c.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/complaints/${c._id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg gradient-brand text-[11px] font-semibold"
                    >
                      <span>Manage</span>
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
