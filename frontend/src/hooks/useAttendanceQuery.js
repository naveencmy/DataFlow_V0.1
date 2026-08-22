import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import attendanceApi from '../api/attendanceApi.js';
import useUIStore from '../stores/uiStore.js';

export const ATTENDANCE_QUERY_KEYS = {
  ATTENDANCE: 'attendance',
  ATTENDANCE_TODAY: 'attendance_today',
  ATTENDANCE_EMPLOYEE: 'attendance_employee',
};

export const useAttendanceQuery = (params = {}) => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEYS.ATTENDANCE, params],
    queryFn: async () => {
      const res = await attendanceApi.getAttendance(params);
      return res.attendance || [];
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useTodayAttendanceQuery = () => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEYS.ATTENDANCE_TODAY],
    queryFn: async () => {
      const res = await attendanceApi.getTodayAttendance();
      return {
        date: res.date,
        summary: res.summary || { present: 0, onLeave: 0, absent: 0, total: 0 },
        attendance: res.attendance || [],
      };
    },
    staleTime: 1000 * 30,
  });
};

export const useCheckInMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => attendanceApi.checkIn(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.ATTENDANCE] });
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.ATTENDANCE_TODAY] });
      queryClient.invalidateQueries({ queryKey: ['analytics_kpis'] });
      addToast({
        title: 'Checked In 🟢',
        message: res.message || 'Check-in recorded successfully.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Check-in failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};

export const useCheckOutMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => attendanceApi.checkOut(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.ATTENDANCE] });
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.ATTENDANCE_TODAY] });
      queryClient.invalidateQueries({ queryKey: ['analytics_kpis'] });
      addToast({
        title: 'Checked Out 🔴',
        message: res.message || 'Check-out completed.',
        type: 'success',
      });
    },
    onError: (err) => {
      addToast({
        title: 'Check-out failed',
        message: err.message,
        type: 'error',
      });
    },
  });
};
