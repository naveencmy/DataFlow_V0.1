import axiosClient from './axiosClient.js';

export const authApi = {
  /**
   * Login user with loginId / email and password
   */
  login: async (credentials) => {
    return axiosClient.post('/auth/login', credentials);
  },

  /**
   * Register / Sign up new account
   */
  signup: async (userData) => {
    return axiosClient.post('/auth/signup', userData);
  },

  /**
   * Get authenticated user profile
   */
  getMe: async () => {
    return axiosClient.get('/auth/me');
  },

  /**
   * Change password
   */
  changePassword: async (passwords) => {
    return axiosClient.put('/auth/change-password', passwords);
  },

  /**
   * Logout user
   */
  logout: async () => {
    return axiosClient.post('/auth/logout');
  },
};

export default authApi;
