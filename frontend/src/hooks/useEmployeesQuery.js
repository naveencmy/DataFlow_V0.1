import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import employeeApi from '../api/employeeApi.js';
import useUIStore from '../stores/uiStore.js';

export const EMPLOYEE_QUERY_KEYS = {
  EMPLOYEES: 'employees',
  EMPLOYEE_DETAIL: 'employee_detail',
};

export const useEmployeesQuery = (params = {}) => {
  return useQuery({
    queryKey: [EMPLOYEE_QUERY_KEYS.EMPLOYEES, params],
    queryFn: async () => {
      const res = await employeeApi.getEmployees(params);
      return res.employees || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

export const useEmployeeDetailQuery = (id) => {
  return useQuery({
    queryKey: [EMPLOYEE_QUERY_KEYS.EMPLOYEE_DETAIL, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await employeeApi.getEmployeeById(id);
      return res.employee || null;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => employeeApi.createEmployee(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.EMPLOYEES] });
      addToast({
        title: 'Employee Created',
        message: `${res.employee?.name} has been added successfully.`,
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Failed to create employee',
        message: err.message,
        type: 'error',
      });
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }) => employeeApi.updateEmployee(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.EMPLOYEES] });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.EMPLOYEE_DETAIL, res.employee?.id] });
      addToast({
        title: 'Profile Updated',
        message: 'Employee details saved successfully.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Update failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};

export const useUpdateSalaryMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }) => employeeApi.updateSalary(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.EMPLOYEES] });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.EMPLOYEE_DETAIL, res.employee?.id] });
      addToast({
        title: 'Salary Updated',
        message: 'Compensation structure saved successfully.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Salary update failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};
