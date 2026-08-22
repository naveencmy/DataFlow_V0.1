import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import leaveApi from '../api/leaveApi.js';
import useUIStore from '../stores/uiStore.js';

export const LEAVE_QUERY_KEYS = {
  LEAVES: 'leaves',
};

export const useLeavesQuery = (params = {}) => {
  return useQuery({
    queryKey: [LEAVE_QUERY_KEYS.LEAVES, params],
    queryFn: async () => {
      const res = await leaveApi.getLeaves(params);
      return res.leaves || [];
    },
    staleTime: 1000 * 30,
  });
};

export const useApplyLeaveMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => leaveApi.applyLeave(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_QUERY_KEYS.LEAVES] });
      addToast({
        title: 'Leave Application Submitted',
        message: 'Your leave request has been queued for review.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Application failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};

export const useReviewLeaveMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, status, reviewRemarks }) =>
      leaveApi.reviewLeave(id, { status, reviewRemarks }),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_QUERY_KEYS.LEAVES] });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['analytics_kpis'] });
      addToast({
        title: `Leave ${vars.status}`,
        message: `Leave request has been marked as ${vars.status.toLowerCase()}.`,
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Review action failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};

export const useCancelLeaveMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (id) => leaveApi.cancelLeave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_QUERY_KEYS.LEAVES] });
      addToast({
        title: 'Leave Cancelled',
        message: 'Your leave request has been cancelled.',
        type: 'info',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Cancellation failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};
