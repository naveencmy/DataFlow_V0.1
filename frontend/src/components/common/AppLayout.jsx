import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { ToastContainer } from '../ui/ToastContainer.jsx';
import { TableSkeleton } from '../ui/Skeleton.jsx';

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased text-slate-800 selection:bg-teal-500 selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Header />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-12 focus:outline-none" tabIndex={-1}>
          <Suspense
            fallback={
              <div className="p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
                <TableSkeleton rows={6} cols={4} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default AppLayout;
