import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import authApi from '../api/authApi.js';

const TOKEN_KEY = 'dayflow_auth_token';
const USER_KEY = 'dayflow_auth_user';

export const useAuthStore = create(
  immer((set, get) => ({
    token: (() => {
      try {
        return localStorage.getItem(TOKEN_KEY) || null;
      } catch (e) {
        return null;
      }
    })(),
    user: (() => {
      try {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    })(),
    isLoading: false,
    error: null,

    isAuthenticated: () => Boolean(get().token && get().user),
    isAdmin: () => get().user?.role === 'ADMIN',
    isEmployee: () => get().user?.role === 'EMPLOYEE',
    effectiveEmployeeId: () => get().user?.employeeId || null,

    login: async (credentials) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const data = await authApi.login(credentials);
        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));

          set((state) => {
            state.token = data.token;
            state.user = data.user;
            state.isLoading = false;
            state.error = null;
          });
          return data;
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (err) {
        set((state) => {
          state.isLoading = false;
          state.error = err.message || 'Invalid credentials';
        });
        throw err;
      }
    },

    signup: async (userData) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const data = await authApi.signup(userData);
        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));

          set((state) => {
            state.token = data.token;
            state.user = data.user;
            state.isLoading = false;
            state.error = null;
          });
          return data;
        } else {
          throw new Error(data.message || 'Signup failed');
        }
      } catch (err) {
        set((state) => {
          state.isLoading = false;
          state.error = err.message || 'Registration failed';
        });
        throw err;
      }
    },

    setUser: (user) => {
      set((state) => {
        state.user = user;
      });
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (e) {}
    },

    logout: () => {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } catch (e) {}

      set((state) => {
        state.token = null;
        state.user = null;
        state.error = null;
      });

      try {
        authApi.logout().catch(() => {});
      } catch (e) {}
    },
  }))
);

export default useAuthStore;
