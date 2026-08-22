import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm.jsx';
import { useAuthStore } from '../stores/authStore.js';

export const LoginPage = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginForm />;
};

export default LoginPage;
