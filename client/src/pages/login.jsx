import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { GraduationCap, Shield, Lock, Mail, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionExpired = new URLSearchParams(location.search).get('session_expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-indigo-600 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-600/30">
              <GraduationCap className="text-white" size={28} />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign In to CCMS Portal</h1>
          <p className="text-xs text-slate-400">
            Enter your credentials or use a quick demo account below
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 text-xs text-slate-300 space-y-2.5">
          <p className="font-semibold text-indigo-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <Shield size={13} />
            Quick Demo Logins (Click to autofill):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@college.edu', 'Admin@123')}
              className="py-2 px-3 rounded-xl border border-purple-500/30 bg-purple-900/30 hover:bg-purple-900/50 text-purple-200 text-left font-medium transition-all"
            >
              <div className="font-bold text-white text-xs">Admin Demo</div>
              <div className="text-[10px] text-purple-300 truncate">admin@college.edu</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('student@college.edu', 'Student@123')}
              className="py-2 px-3 rounded-xl border border-indigo-500/30 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-200 text-left font-medium transition-all"
            >
              <div className="font-bold text-white text-xs">Student Demo</div>
              <div className="text-[10px] text-indigo-300 truncate">student@college.edu</div>
            </button>
          </div>
        </div>

        {/* Error / Notification Banner */}
        {sessionExpired && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} />
            <span>Your session has expired. Please sign in again.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., student@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-brand text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            Don't have a student account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
