import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useConfig } from './context/ConfigContext.jsx';
import { Sidebar } from './components/common/Sidebar.jsx';
import { Header } from './components/common/Header.jsx';
import { ToastContainer } from './components/common/ToastContainer.jsx';
import { LoginForm } from './components/auth/LoginForm.jsx';
import { EmployeeList } from './components/employees/EmployeeList.jsx';
import { EmployeesPage } from './pages/EmployeesPage.jsx';
import { EmployeeProfile } from './components/employees/EmployeeProfile.jsx';
import { EmployeeAttendanceView } from './components/attendance/EmployeeAttendanceView.jsx';
import { AdminAttendanceView } from './components/attendance/AdminAttendanceView.jsx';
import { LeaveRequestTable } from './components/leave/LeaveRequestTable.jsx';
import { PayrollRunsTable } from './components/payroll/PayrollRunsTable.jsx';
import { AnalyticsDashboard } from './components/reports/AnalyticsDashboard.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

export function App() {
  const { isAuthenticated, role, currentUser } = useAuth();
  const { flags } = useConfig();

  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');

  // If not logged in, show Login Form
  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <ToastContainer />
      </>
    );
  }

  const handleNavigate = (tabId, employeeId = null) => {
    setActiveTab(tabId);
    if (employeeId) {
      setSelectedEmployeeId(employeeId);
    } else if (tabId === 'DASHBOARD' || tabId === 'EMPLOYEES') {
      setSelectedEmployeeId(null);
    }
  };

  const handleSelectEmployee = (empId) => {
    setSelectedEmployeeId(empId);
    setActiveTab('PROFILE');
  };

  // Find linked employee ID for logged in user
  const effectiveEmployeeId = currentUser?.employeeId || selectedEmployeeId || 'emp-1';

  return (
    <div className="min-h-screen bg-[#F4F9F8] flex text-slate-900 selection:bg-teal-500 selection:text-white font-sans antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigate(tab)}
      />

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
        {/* Top Header Bar */}
        <Header
          activeTab={activeTab}
          searchQuery={globalSearch}
          onSearch={setGlobalSearch}
          onSelectEmployee={handleSelectEmployee}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 px-8 pb-10 overflow-y-auto animate-fade-in">
          {/* DASHBOARD TAB (Overview with Summary Cards & Employee Cards) */}
          {activeTab === 'DASHBOARD' && (
            <EmployeeList
              onSelectEmployee={handleSelectEmployee}
              globalSearchQuery={globalSearch}
            />
          )}

          {/* EMPLOYEES TAB (Dedicated Management Page with Table View & Actions) */}
          {activeTab === 'EMPLOYEES' && (
            <EmployeesPage
              onSelectEmployee={handleSelectEmployee}
              onEditEmployee={handleSelectEmployee}
            />
          )}

          {/* PROFILE VIEW (View-Only Mode by Default, 6 Tab Sections) */}
          {activeTab === 'PROFILE' && (
            <EmployeeProfile
              employeeId={selectedEmployeeId || effectiveEmployeeId}
              onBack={() => handleNavigate('EMPLOYEES')}
            />
          )}

          {/* ATTENDANCE TAB (Role-Gated Views per Section 7/9) */}
          {activeTab === 'ATTENDANCE' && (
            <div>
              {role === 'ADMIN' ? (
                <AdminAttendanceView onSelectEmployee={handleSelectEmployee} />
              ) : (
                <EmployeeAttendanceView employeeId={effectiveEmployeeId} />
              )}
            </div>
          )}

          {/* TIME OFF / LEAVE TAB (Leave Management per Section 8) */}
          {activeTab === 'LEAVE' && (
            <LeaveRequestTable currentEmployeeId={effectiveEmployeeId} />
          )}

          {/* SALARY & PAYROLL TAB (Payroll Management per Section 9) */}
          {activeTab === 'PAYROLL' && <PayrollRunsTable />}

          {/* REPORTS & ANALYTICS TAB (Admin Reports per Section 10) */}
          {activeTab === 'ANALYTICS' && <AnalyticsDashboard />}

          {/* SETTINGS TAB */}
          {activeTab === 'SETTINGS' && <SettingsPage />}
        </main>
      </div>

      {/* 3. Floating Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
