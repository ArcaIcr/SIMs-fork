import { FirestoreService } from '../services/firestoreService';

export interface Notification {
  id?: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  branchId?: string;
  actorName?: string;
  isProfileUpdate?: boolean;
  actorId?: string;
}

export async function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const notif: Notification = {
    ...notification,
    timestamp: Date.now(),
    read: false,
  };
  
  await FirestoreService.create('notifications', notif);
}

export async function fetchNotifications(userId?: string, branchId?: string, isManager?: boolean): Promise<Notification[]> {
  if (!userId && !branchId) return [];
  
  // If it's a profile update notification, only show to the actor and their manager
  if (isManager) {
    // Manager sees all notifications for their branch
    return FirestoreService.query<Notification>('notifications', 'branchId', '==', branchId);
  } else {
    // Staff sees their own profile updates and all branch notifications
    const profileUpdates = await FirestoreService.query<Notification>(
      'notifications',
      'actorId',
      '==',
      userId
    );
    
    const branchNotifs = await FirestoreService.query<Notification>(
      'notifications',
      'branchId',
      '==',
      branchId
    );
    
    return [...profileUpdates, ...branchNotifs.filter((n: Notification) => !n.isProfileUpdate)];
  }
}

export async function markNotificationRead(id: string) {
  await FirestoreService.update('notifications', id, { read: true });
}

export async function markAllNotificationsRead(branchId?: string) {
  const notifs = await fetchNotifications(undefined, branchId);
  await Promise.all(notifs.map((n: Notification) => markNotificationRead(n.id!)));
}

export async function clearNotifications(userId?: string, branchId?: string) {
  try {
    console.log('Clearing notifications for:', { userId, branchId });
    
    if (!userId && !branchId) {
      console.error('Cannot clear notifications: missing both userId and branchId');
      return false;
    }

    const notifs = await fetchNotifications(userId, branchId);
    console.log(`Found ${notifs.length} notifications to clear`);

    if (notifs.length === 0) {
      console.log('No notifications to clear');
      return true;
    }

    const deletePromises = notifs.map(async (n) => {
      if (!n.id) {
        console.error('Notification missing ID:', n);
        return false;
      }
      try {
        await FirestoreService.delete('notifications', n.id);
        return true;
      } catch (error) {
        console.error(`Failed to delete notification ${n.id}:`, error);
        return false;
      }
    });

    const results = await Promise.all(deletePromises);
    const successCount = results.filter(Boolean).length;
    console.log(`Successfully cleared ${successCount} of ${notifs.length} notifications`);

    return successCount === notifs.length;
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }
} 