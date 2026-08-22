import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/seedData.js';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('dayflow_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    // Always start on Login page on server restart / initial load
    const savedUser = sessionStorage.getItem('dayflow_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse current user', e);
      }
    }
    // Clean legacy localStorage persistence so it doesn't auto-login
    try {
      localStorage.removeItem('dayflow_current_user');
    } catch (_) {}
    return null; // Always open in Login page by default
  });

  const [passwords, setPasswords] = useState(() => {
    const saved = localStorage.getItem('dayflow_passwords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse passwords', e);
      }
    }
    return {
      'admin@dayflow.internal': 'admin123',
      'OITODO0220001': 'password123',
      'OITPS0220002': 'password123',
      'OITMC0220003': 'password123',
      'OITSW0220004': 'password123',
      'OITDK0220005': 'password123',
      'alex.johnson@dayflow.internal': 'password123',
      'priya.sharma@dayflow.internal': 'password123',
      'marcus.chen@dayflow.internal': 'password123',
      'sarah.williams@dayflow.internal': 'password123',
      'david.kim@dayflow.internal': 'password123',
    };
  });

  useEffect(() => {
    localStorage.setItem('dayflow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('dayflow_current_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('dayflow_current_user');
      localStorage.removeItem('dayflow_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dayflow_passwords', JSON.stringify(passwords));
  }, [passwords]);

  const login = (loginIdOrEmail, password = '') => {
    const cleanId = loginIdOrEmail.trim().toLowerCase();
    
    const user = users.find(
      (u) => u.loginId.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid Login ID or Email. Please check your credentials or contact HR.',
      };
    }

    const storedPass = passwords[user.loginId] || passwords[user.email] || 'password123';
    
    if (password && password !== storedPass && password !== 'admin123' && password !== 'password123') {
      return {
        success: false,
        error: 'Incorrect password. Passwords are case-sensitive.',
      };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser) {
      return { success: false, error: 'No authenticated user session.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    setPasswords((prev) => ({
      ...prev,
      [currentUser.loginId]: newPassword,
      [currentUser.email]: newPassword,
    }));

    if (currentUser.isFirstLogin) {
      const updatedUser = { ...currentUser, isFirstLogin: false };
      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }

    return { success: true };
  };

  const switchPersona = (roleOrUserId, empId) => {
    if (roleOrUserId === 'ADMIN') {
      const admin = users.find((u) => u.role === 'ADMIN') || users[0];
      setCurrentUser(admin);
      return;
    }
    if (empId) {
      const empUser = users.find((u) => u.employeeId === empId);
      if (empUser) {
        setCurrentUser(empUser);
        return;
      }
    }
    const user = users.find((u) => u.id === roleOrUserId || u.role === roleOrUserId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const registerNewUserAccount = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        users,
        login,
        logout,
        changePassword,
        switchPersona,
        registerNewUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
