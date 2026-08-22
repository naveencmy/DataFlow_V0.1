import React from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { ForbiddenPage } from '../components/error/ForbiddenPage.jsx';

export const RoleGuard = ({ allowedRoles = ['ADMIN'], children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <ForbiddenPage />;
  }

  return children;
};

export default RoleGuard;
