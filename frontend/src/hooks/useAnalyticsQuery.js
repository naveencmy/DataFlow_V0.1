import { useQuery } from '@tanstack/react-query';
import analyticsApi from '../api/analyticsApi.js';

export const ANALYTICS_QUERY_KEYS = {
  ANALYTICS_KPIS: 'analytics_kpis',
  ANALYTICS_ATTENDANCE: 'analytics_attendance',
  ANALYTICS_LEAVES: 'analytics_leaves',
  ANALYTICS_PAYROLL: 'analytics_payroll',
};

export const useKPIsQuery = () => {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEYS.ANALYTICS_KPIS],
    queryFn: async () => {
      const res = await analyticsApi.getKPIs();
      return res.kpis || { totalHeadcount: 0, presentToday: 0, onLeaveToday: 0, absentToday: 0 };
    },
    staleTime: 1000 * 30,
  });
};

export const useAttendanceAnalyticsQuery = (params = {}) => {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEYS.ANALYTICS_ATTENDANCE, params],
    queryFn: async () => {
      const res = await analyticsApi.getAttendanceAnalytics(params);
      return res.departments || [];
    },
    staleTime: 1000 * 60,
  });
};

export const useLeaveAnalyticsQuery = () => {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEYS.ANALYTICS_LEAVES],
    queryFn: async () => {
      const res = await analyticsApi.getLeaveAnalytics();
      return {
        byType: res.byType || [],
        byStatus: res.byStatus || [],
      };
    },
    staleTime: 1000 * 60,
  });
};

export const usePayrollAnalyticsQuery = (params = {}) => {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEYS.ANALYTICS_PAYROLL, params],
    queryFn: async () => {
      const res = await analyticsApi.getPayrollAnalytics(params);
      return res.payrollSummary || [];
    },
    staleTime: 1000 * 60,
  });
};
