import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Authorization header if JWT token exists in localStorage / authStore
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('dayflow_auth_token');
      if (stored) {
        config.headers.Authorization = `Bearer ${stored}`;
      }
    } catch (e) {
      // Ignore localStorage access issues
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and session expiration
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    // If 401 Unauthorized, clear stored token
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('dayflow_auth_token');
      } catch (e) {}
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
