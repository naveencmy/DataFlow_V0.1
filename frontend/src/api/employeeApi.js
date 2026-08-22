import axiosClient from './axiosClient.js';

export const employeeApi = {
  /**
   * Get employee list (Admin: all, Employee: self)
   */
  getEmployees: async (params = {}) => {
    return axiosClient.get('/employees', { params });
  },

  /**
   * Get single employee by ID
   */
  getEmployeeById: async (id) => {
    return axiosClient.get(`/employees/${id}`);
  },

  /**
   * Create employee (Admin only)
   */
  createEmployee: async (employeeData) => {
    return axiosClient.post('/employees', employeeData);
  },

  /**
   * Update employee profile
   */
  updateEmployee: async (id, employeeData) => {
    return axiosClient.put(`/employees/${id}`, employeeData);
  },

  /**
   * Deactivate employee (Admin only)
   */
  deactivateEmployee: async (id) => {
    return axiosClient.delete(`/employees/${id}`);
  },

  /**
   * Update salary structure (Admin only)
   */
  updateSalary: async (id, salaryData) => {
    return axiosClient.put(`/employees/${id}/salary`, salaryData);
  },

  /**
   * Add document to employee profile
   */
  addDocument: async (id, docData) => {
    return axiosClient.post(`/employees/${id}/documents`, docData);
  },

  /**
   * Remove document from employee profile
   */
  removeDocument: async (id, docId) => {
    return axiosClient.delete(`/employees/${id}/documents/${docId}`);
  },
};

export default employeeApi;
