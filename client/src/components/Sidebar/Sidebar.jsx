import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/authContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Building2,
  Bell,
  Settings,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const { isAdmin, isStudent } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Complaints', path: '/complaints', icon: FileText },
    { name: 'New Complaint', path: '/complaints/new', icon: PlusCircle },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Complaints', path: '/admin/complaints', icon: ShieldCheck },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const navLinks = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/95 p-4 transition-transform duration-200 lg:translate-x-0 backdrop-blur-md flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="px-3 py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isAdmin ? 'ADMINISTRATOR MENU' : 'STUDENT PORTAL'}
            </span>
          </div>

          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => closeSidebar?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Support Banner */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
            <LifeBuoy size={18} />
          </div>
          <p className="text-xs font-semibold text-white">Need Assistance?</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Contact College Helpdesk</p>
          <span className="mt-2 inline-block text-[10px] text-indigo-400 font-mono">
            helpdesk@college.edu
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
