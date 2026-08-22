import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200/80 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-black text-slate-900 tracking-tight">404</div>
          <h1 className="text-xl font-bold text-slate-800">Page Not Found</h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            The page you are looking for doesn't exist, has been moved, or you don't have permission to access it.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 py-2.5 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
