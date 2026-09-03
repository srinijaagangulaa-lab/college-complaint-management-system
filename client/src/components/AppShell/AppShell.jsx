import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

export const AppShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
