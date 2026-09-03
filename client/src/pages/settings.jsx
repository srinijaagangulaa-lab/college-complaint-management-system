import React, { useState } from 'react';
import { useAuth } from '../store/authContext';
import { getInitials } from '../utils/helpers';
import { User, Mail, Shield, Building, Phone, Key, LogOut, CheckCircle2 } from 'lucide-react';

export const SettingsPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [success, setSuccess] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, credentials, and notification settings
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20 text-indigo-300 text-2xl font-bold border border-indigo-500/40 shadow-lg shadow-indigo-600/20">
            {getInitials(user?.name)}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {user?.role} Account
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span>Department:</span>
              <span className="text-white font-medium">{user?.department || 'General'}</span>
            </div>
            {user?.studentId && (
              <div className="flex items-center justify-between">
                <span>Student ID:</span>
                <span className="text-white font-mono">{user?.studentId}</span>
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center justify-between">
                <span>Phone:</span>
                <span className="text-white">{user?.phone}</span>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Information & Security Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <User size={16} className="text-indigo-400" />
              Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <div className="glass-input bg-slate-950/60 cursor-not-allowed text-slate-300">
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                <div className="glass-input bg-slate-950/60 cursor-not-allowed text-slate-300">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Department</label>
                <div className="glass-input bg-slate-950/60 cursor-not-allowed text-slate-300">
                  {user?.department || 'General'}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Role / Permissions</label>
                <div className="glass-input bg-slate-950/60 cursor-not-allowed text-slate-300 capitalize">
                  {user?.role} (Full Access)
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 glass-card space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield size={16} className="text-emerald-400" />
              Security & Session
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your session is secured using JSON Web Tokens (JWT) signed with 256-bit encryption. All password hashes are protected using bcrypt.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Active Session Info</p>
              <p className="text-slate-400">Authenticated as: <strong className="text-indigo-300">{user?.email}</strong></p>
              <p className="text-slate-400">Session Status: <span className="text-emerald-400 font-medium">Active & Synchronized</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
