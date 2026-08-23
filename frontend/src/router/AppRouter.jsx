import React, { lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { AppLayout } from '../components/common/AppLayout.jsx';
import { ErrorBoundary } from '../components/error/ErrorBoundary.jsx';
import { NotFoundPage } from '../components/error/NotFoundPage.jsx';

// Lazy-loaded route pages for code-splitting & maximum performance
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'));
const EmployeesPage = lazy(() => import('../pages/EmployeesPage.jsx'));
const EmployeeProfilePage = lazy(() => import('../pages/EmployeeProfilePage.jsx'));
const AttendancePage = lazy(() => import('../pages/AttendancePage.jsx'));
const LeavePage = lazy(() => import('../pages/LeavePage.jsx'));
const PayrollPage = lazy(() => import('../pages/PayrollPage.jsx'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage.jsx'));
const SettingsPage = lazy(() => import('../pages/SettingsPage.jsx'));

export const AppRouter = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Admin-Only Employees Directory */}
            <Route
              path="/employees"
              element={
                <RoleGuard allowedRoles={['ADMIN']}>
                  <EmployeesPage />
                </RoleGuard>
              }
            />

            {/* Employee Profile (Admin: all, Employee: self) */}
            <Route path="/employees/:id/profile" element={<EmployeeProfilePage />} />
            <Route path="/employees/:id/profile/:tab" element={<EmployeeProfilePage />} />

            {/* Core Modules */}
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/payroll" element={<PayrollPage />} />

            {/* Admin-Only Analytics & Reports */}
            <Route
              path="/analytics"
              element={
                <RoleGuard allowedRoles={['ADMIN']}>
                  <AnalyticsPage />
                </RoleGuard>
              }
            />

            <Route path="/settings" element={<SettingsPage />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Global Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;
