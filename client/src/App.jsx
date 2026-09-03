import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authContext';
import { SocketProvider } from './store/socketContext';

// Layout
import AppShell from './components/AppShell/AppShell';
import LoadingState from './components/LoadingState/LoadingState';

// Pages
import LandingPage from './pages/index';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';
import ComplaintsListPage from './pages/complaints/index';
import NewComplaintPage from './pages/complaints/new';
import ComplaintDetailPage from './pages/complaints/detail';

// Admin Pages
import AdminDashboardPage from './pages/admin/dashboard';
import AdminComplaintsPage from './pages/admin/complaints';
import AdminComplaintDetailPage from './pages/admin/complaintDetail';
import AdminDepartmentsPage from './pages/admin/departments';

// Shared Pages
import NotificationsPage from './pages/notifications';
import SettingsPage from './pages/settings';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingState message="Verifying authentication session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingState message="Verifying administrative access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected App Routes wrapped in AppShell */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              {/* Student & Role-aware Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/complaints" element={<ComplaintsListPage />} />
              <Route path="/complaints/new" element={<NewComplaintPage />} />
              <Route path="/complaints/:id" element={<ComplaintDetailPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <AdminRoute>
                    <AdminComplaintsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/complaints/:id"
                element={
                  <AdminRoute>
                    <AdminComplaintDetailPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <AdminRoute>
                    <AdminDepartmentsPage />
                  </AdminRoute>
                }
              />

              {/* Shared Protected Routes */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
