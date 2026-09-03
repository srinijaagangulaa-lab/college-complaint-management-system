import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { getStudentDashboard } from '../services/dashboardService';
import MetricCard from '../components/MetricCard/MetricCard';
import ComplaintCard from '../components/ComplaintCard/ComplaintCard';
import LoadingState from '../components/LoadingState/LoadingState';
import EmptyState from '../components/EmptyState/EmptyState';
import {
  FileText,
  Clock,
  PlayCircle,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getStudentDashboard();
      setStats(res.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Loading your student portal dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              STUDENT DASHBOARD
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Department of {user?.department || 'General Studies'} • ID: {user?.studentId || 'N/A'}
            </p>
          </div>

          <Link
            to="/complaints/new"
            className="inline-flex items-center gap-2 rounded-2xl gradient-brand px-5 py-3 text-xs font-semibold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            <PlusCircle size={16} />
            <span>Submit New Complaint</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Total Filed"
          value={stats?.total || 0}
          icon={FileText}
          color="slate"
        />
        <MetricCard
          title="Submitted"
          value={stats?.submitted || 0}
          icon={Clock}
          color="slate"
        />
        <MetricCard
          title="Under Review"
          value={stats?.underReview || 0}
          icon={ShieldAlert}
          color="blue"
        />
        <MetricCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={PlayCircle}
          color="amber"
        />
        <MetricCard
          title="Resolved"
          value={stats?.resolved || 0}
          icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          title="Closed"
          value={stats?.closed || 0}
          icon={XCircle}
          color="purple"
        />
      </div>

      {/* Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Complaints</h2>
            <p className="text-xs text-slate-400">
              Track real-time progress and administrator feedback on your latest reports
            </p>
          </div>
          <Link
            to="/complaints"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>View All ({stats?.total || 0})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recentComplaints?.length === 0 ? (
          <EmptyState
            title="No complaints filed yet"
            description="Have an issue with classroom equipment, lab instruments, Wi-Fi, or hostel facilities? Submit a ticket to notify the campus administration."
            actionText="Submit Your First Complaint"
            actionLink="/complaints/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.recentComplaints?.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
