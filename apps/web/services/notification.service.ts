import api from './api';
import { unwrap } from './helpers';

export interface NotificationFeedItem {
  id: string;
  notificationId: string;
  title: string;
  body: string;
  type: string;
  priority: string;
  category: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationFeedResponse {
  items: NotificationFeedItem[];
  total: number;
  page: number;
  limit: number;
}

export const getNotifications = async (params?: {
  read?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<NotificationFeedResponse> => {
  return unwrap<NotificationFeedResponse>(api.get('/notifications', { params }));
};

export const markNotificationRead = async (id: string): Promise<void> => {
  return unwrap<void>(api.patch(`/notifications/${id}/read`));
};

export const markAllNotificationsRead = async (): Promise<void> => {
  return unwrap<void>(api.patch('/notifications/read-all'));
};

export const archiveNotification = async (id: string): Promise<void> => {
  return unwrap<void>(api.patch(`/notifications/${id}/archive`));
};

export const deleteNotification = async (id: string): Promise<void> => {
  return unwrap<void>(api.delete(`/notifications/${id}`));
};

export const getNotificationPreferences = async (): Promise<any[]> => {
  return unwrap<any[]>(api.get('/notifications/preferences'));
};

export const updateNotificationPreferences = async (
  category: string,
  channels: string[],
): Promise<any> => {
  return unwrap<any>(api.put('/notifications/preferences', { category, channels }));
};

