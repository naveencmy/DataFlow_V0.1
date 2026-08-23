import axios from 'axios';

export const getApiBaseUrl = () => {
  try {
    const customUrl = localStorage.getItem('dayflow_api_url');
    if (customUrl) return customUrl.replace(/\/+$/, '');
  } catch (e) {
    // Ignore localStorage access issues
  }
  return (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
};

export const setApiBaseUrl = (newUrl) => {
  try {
    if (newUrl) {
      localStorage.setItem('dayflow_api_url', newUrl.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem('dayflow_api_url');
    }
    axiosClient.defaults.baseURL = getApiBaseUrl();
  } catch (e) {
    // Ignore localStorage errors
  }
};

export const axiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Dynamic request interceptor ensuring active baseURL and Authorization token
axiosClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
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
