import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  BellRing,
  Building2,
  FileText,
  UserCheck,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const steps = [
    {
      number: '01',
      title: 'Submit Issue',
      desc: 'Submit complaints with category, location, priority & attachments.',
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      number: '02',
      title: 'Admin Review',
      desc: 'Central administrators evaluate urgency and verify details.',
      icon: ShieldCheck,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      number: '03',
      title: 'Department Assignment',
      desc: 'Assigned directly to IT, Hostel, Maintenance or Housekeeping staff.',
      icon: UserCheck,
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '04',
      title: 'Resolution & Audit',
      desc: 'Staff records resolution proof, closes issue, and preserves audit trail.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-600/30">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                CCMS <span className="text-indigo-400 font-medium text-xs">PORTAL</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider">
                COLLEGE COMPLAINT MANAGEMENT SYSTEM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl gradient-brand px-4 py-2 text-xs font-semibold"
                >
                  Student Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300">
            <Sparkles size={14} className="text-indigo-400" />
            <span>Digital Campus Governance Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Digital Complaint Tracking & Resolution for{' '}
            <span className="gradient-text">Modern Colleges</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Replace manual paper logs with a transparent, centralized system. Students submit and
            track campus issues in real time while college departments collaborate to resolve them
            quickly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl gradient-brand px-6 py-3.5 text-sm font-semibold shadow-xl shadow-indigo-600/30"
            >
              <span>Access Portal (Demo Logins Included)</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              <span>New Student Registration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-16 px-6 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              END-TO-END LIFECYCLE
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              How Complaints Are Resolved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card relative group hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-700 group-hover:text-indigo-400 transition-colors">
                      {step.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              SYSTEM CAPABILITIES
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Engineered For Complete Accountability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 glass-card">
              <Clock className="text-indigo-400 mb-3" size={24} />
              <h3 className="text-base font-semibold text-white">Live Status Timelines</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Full chronological activity tracking from submission to review, assignment, progress updates, and resolution closure.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 glass-card">
              <Building2 className="text-purple-400 mb-3" size={24} />
              <h3 className="text-base font-semibold text-white">Department Routing</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Support for 10 campus departments including IT, Hostel, Maintenance, Transportation, Library, and Cleanliness.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 glass-card">
              <BarChart3 className="text-emerald-400 mb-3" size={24} />
              <h3 className="text-base font-semibold text-white">Administrative Analytics</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Instant analytics on resolution rates, category breakdowns, urgent priority bottlenecks, and department load.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500">
        <p>© 2026 College Complaint Management System (CCMS). Designed and built to specs.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
