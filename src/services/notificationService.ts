import { Reminder } from '@/types';

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  async showNotification(reminder: Reminder): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission denied');
        return;
      }
    }

    const options: NotificationOptions = {
      body: reminder.message,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: reminder.id,
      requireInteraction: true,
      data: {
        reminderId: reminder.id,
        customerId: reminder.customerId,
      },
    };

    try {
      const notification = new Notification(reminder.title, options);

      notification.onclick = () => {
        window.focus();
        // Navigate to customer detail or reminders page
        window.location.href = `/customers/${reminder.customerId}`;
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }
}

export const notificationService = new NotificationService();
