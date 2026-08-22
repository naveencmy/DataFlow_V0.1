import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import payrollApi from '../api/payrollApi.js';
import useUIStore from '../stores/uiStore.js';

export const PAYROLL_QUERY_KEYS = {
  PAYROLL: 'payroll',
};

export const usePayrollQuery = (params = {}) => {
  return useQuery({
    queryKey: [PAYROLL_QUERY_KEYS.PAYROLL, params],
    queryFn: async () => {
      const res = await payrollApi.getPayroll(params);
      return res.payroll || [];
    },
    staleTime: 1000 * 60,
  });
};

export const useProcessPayrollMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => payrollApi.processMonthlyPayroll(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [PAYROLL_QUERY_KEYS.PAYROLL] });
      addToast({
        title: 'Payroll Cycle Processed',
        message: res.message || 'Payslips generated successfully.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Payroll processing failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};

export const useUpdatePayrollStatusMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, status }) => payrollApi.updatePayrollStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYROLL_QUERY_KEYS.PAYROLL] });
      addToast({
        title: 'Payroll Status Updated',
        message: 'Status updated successfully.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Status update failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};
