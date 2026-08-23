import { NotificationReminderSettings } from '../types';

export const REMINDER_SETTINGS_KEY = 'bytechoke_reminder_settings_v1';
export const LAST_REMINDER_SENT_KEY = 'bytechoke_last_reminder_timestamp_v1';

export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const getDefaultReminderSettings = (): NotificationReminderSettings => {
  let isGranted = false;
  if (typeof window !== 'undefined' && 'Notification' in window) {
    isGranted = Notification.permission === 'granted';
  }

  try {
    const saved = localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        permissionGranted: isGranted
      };
    }
  } catch (e) {
    console.error('Failed to parse reminder settings', e);
  }

  return {
    enabled: true,
    preferredTime: '19:00', // 7:00 PM evening reminder
    permissionGranted: isGranted
  };
};

export const saveReminderSettings = (settings: NotificationReminderSettings) => {
  try {
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save reminder settings', e);
  }
};

export const canSend24HourReminder = (): boolean => {
  try {
    const lastSentStr = localStorage.getItem(LAST_REMINDER_SENT_KEY);
    if (!lastSentStr) return true;
    const lastSentTime = parseInt(lastSentStr, 10);
    if (isNaN(lastSentTime)) return true;

    const elapsed = Date.now() - lastSentTime;
    return elapsed >= TWENTY_FOUR_HOURS_MS;
  } catch (e) {
    return true;
  }
};

export const markReminderAsSent = () => {
  try {
    localStorage.setItem(LAST_REMINDER_SENT_KEY, String(Date.now()));
  } catch (e) {
    console.error('Failed to update last reminder timestamp', e);
  }
};

export const getLastReminderTime = (): number | null => {
  try {
    const lastSentStr = localStorage.getItem(LAST_REMINDER_SENT_KEY);
    if (!lastSentStr) return null;
    const parsed = parseInt(lastSentStr, 10);
    return isNaN(parsed) ? null : parsed;
  } catch (e) {
    return null;
  }
};

export const sendBjjReminderNotification = (title?: string, body?: string): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notifTitle = title || 'ByteChoke BJJ Reminder 🥋';
    const notifBody =
      body ||
      'Mat time reminder: Log today’s drills, coaches, and submissions in your ByteChoke journal!';

    const notification = new Notification(notifTitle, {
      body: notifBody,
      icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>',
      tag: 'bytechoke-daily-reminder'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    markReminderAsSent();
    return true;
  } catch (err) {
    console.error('Failed to trigger notification:', err);
    return false;
  }
};
