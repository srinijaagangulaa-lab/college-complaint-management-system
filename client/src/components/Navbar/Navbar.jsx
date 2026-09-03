import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import { useSocket } from '../../store/socketContext';
import { getInitials } from '../../utils/helpers';
import NotificationDrawer from '../NotificationDrawer/NotificationDrawer';
import {
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  GraduationCap,
  PlusCircle,
  Settings,
  ChevronDown,
} from 'lucide-react';

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useSocket();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md">
        {/* Left Side: Brand and Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white lg:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-600/30">
              <GraduationCap className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold tracking-tight text-white">
                CCMS <span className="text-indigo-400 font-medium text-xs">PORTAL</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider">
                COLLEGE COMPLAINTS
              </p>
            </div>
          </Link>
        </div>

        {/* Right Side: Quick Action + Notification + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Submit for Student */}
          {!isAdmin && (
            <Link
              to="/complaints/new"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition-all"
            >
              <PlusCircle size={15} />
              <span>Submit Complaint</span>
            </Link>
          )}

          {/* Notifications Bell */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white transition-all"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 sm:px-2.5 sm:py-1.5 hover:border-slate-700 transition-all"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                {getInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-tight">
                  {user?.name || 'User'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 capitalize">
                  {isAdmin ? <Shield size={10} className="text-purple-400" /> : null}
                  {user?.role}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div
                onClick={() => setIsProfileOpen(false)}
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-lg z-40"
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <span className="mt-1.5 inline-block text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {user?.role} {user?.department ? `• ${user.department}` : ''}
                  </span>
                </div>

                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Settings size={15} className="text-slate-400" />
                  Account Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer Modal */}
      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
