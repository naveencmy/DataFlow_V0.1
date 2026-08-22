import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationApi from '../api/notificationApi.js';

export const NOTIFICATION_QUERY_KEYS = {
  NOTIFICATIONS: 'notifications',
};

export const useNotificationsQuery = (params = {}) => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: async () => {
      const res = await notificationApi.getNotifications(params);
      return {
        unreadCount: res.unreadCount || 0,
        notifications: res.notifications || [],
      };
    },
    staleTime: 1000 * 20, // 20 seconds
    refetchInterval: 1000 * 30, // Poll every 30 seconds
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEYS.NOTIFICATIONS] });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEYS.NOTIFICATIONS] });
    },
  });
};
