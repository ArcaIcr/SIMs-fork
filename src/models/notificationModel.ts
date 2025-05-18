import { FirestoreService } from '../services/firestoreService';

export interface Notification {
  id?: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  read?: boolean;
  userId?: string;
}

export async function fetchNotifications(userId?: string): Promise<Notification[]> {
  let all = await FirestoreService.getAll<Notification>('notifications');
  if (userId) all = all.filter(n => !n.userId || n.userId === userId);
  return all.sort((a, b) => b.timestamp - a.timestamp);
}

export async function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const notif: Notification = {
    ...notification,
    timestamp: Date.now(),
    read: false,
  };
  return FirestoreService.create('notifications', notif);
}

export async function markNotificationRead(id: string) {
  return FirestoreService.update('notifications', id, { read: true });
}

export async function markAllNotificationsRead(userId?: string) {
  const notifs = await fetchNotifications(userId);
  await Promise.all(notifs.filter(n => !n.read).map(n => markNotificationRead(n.id!)));
} 