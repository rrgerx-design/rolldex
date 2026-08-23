import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  X,
  Clock,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Zap,
  Info,
  CalendarCheck
} from 'lucide-react';
import { NotificationReminderSettings } from '../types';
import {
  saveReminderSettings,
  sendBjjReminderNotification,
  canSend24HourReminder,
  getLastReminderTime,
  TWENTY_FOUR_HOURS_MS
} from '../utils/notifications';

interface DailyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationReminderSettings;
  onUpdateSettings: (newSettings: NotificationReminderSettings) => void;
  onTriggerInAppReminderToast: (msg: string) => void;
}

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTriggerInAppReminderToast
}) => {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [preferredTime, setPreferredTime] = useState(settings.preferredTime || '19:00');
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [testSent, setTestSent] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(getLastReminderTime());

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }
    setLastSentTime(getLastReminderTime());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Notifications are not supported in this browser environment.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      const isGranted = permission === 'granted';
      const updated = {
        ...settings,
        enabled: isGranted ? enabled : false,
        permissionGranted: isGranted
      };
      onUpdateSettings(updated);
      saveReminderSettings(updated);

      if (isGranted) {
        onTriggerInAppReminderToast('Daily reminders enabled! You will be reminded once every 24 hours 🥋');
      }
    } catch (e) {
      console.error('Error requesting notification permission:', e);
    }
  };

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    const updated = {
      ...settings,
      enabled: checked,
      preferredTime
    };
    onUpdateSettings(updated);
    saveReminderSettings(updated);
  };

  const handleSaveTime = (time: string) => {
    setPreferredTime(time);
    const updated = {
      ...settings,
      enabled,
      preferredTime: time
    };
    onUpdateSettings(updated);
    saveReminderSettings(updated);
  };

  const handleSendTestNotification = () => {
    if (permissionStatus !== 'granted') {
      handleRequestPermission();
      return;
    }

    const success = sendBjjReminderNotification(
      'ByteChoke BJJ Reminder 🥋',
      'Mat check: Tap to log today’s drills, coach notes, and submissions!'
    );

    if (success) {
      setTestSent(true);
      setLastSentTime(Date.now());
      onTriggerInAppReminderToast('Test notification sent to your device!');
      setTimeout(() => setTestSent(false), 4000);
    } else {
      onTriggerInAppReminderToast('Could not send system notification. In-app banner triggered!');
    }
  };

  const getNextAvailableTimeStr = () => {
    if (!lastSentTime) return 'Eligible now (Ready to notify)';
    const nextTime = lastSentTime + TWENTY_FOUR_HOURS_MS;
    if (Date.now() >= nextTime) {
      return 'Eligible now (Ready to notify)';
    }
    const d = new Date(nextTime);
    return `Next reminder after ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${d.toLocaleDateString()})`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="modal-daily-reminder"
        className="bg-white border-2 border-neutral-900 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-900 uppercase tracking-tight">
                Daily Training Reminders
              </h3>
              <p className="text-xs text-neutral-500">
                1 Notification max per 24 hours on your phone & browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 overflow-y-auto pr-1 py-4 flex-1">
          {/* Main Toggle Card */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-neutral-900 uppercase">
                  Daily 24-Hour Reminder
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  1x Daily
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pings your phone to log your technique notes after training.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handleToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
            </label>
          </div>

          {/* Browser Permission Status */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-neutral-900" />
                <span>Device Permission Status:</span>
              </span>
              {permissionStatus === 'granted' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Allowed</span>
                </span>
              ) : permissionStatus === 'denied' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Blocked in Browser</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Needs Permission</span>
                </span>
              )}
            </div>

            {permissionStatus !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Allow Notifications on This Device</span>
              </button>
            )}
          </div>

          {/* Preferred Time Selector */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="input-reminder-time"
                className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-neutral-900" />
                <span>Preferred Reminder Time</span>
              </label>
              <span className="text-[11px] text-neutral-500 font-medium">Local device time</span>
            </div>
            <input
              id="input-reminder-time"
              type="time"
              value={preferredTime}
              onChange={(e) => handleSaveTime(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <p className="text-[11px] text-neutral-500">
              Typical evening time to review what techniques Coach taught on the mats.
            </p>
          </div>

          {/* 24-Hour Throttle Rule Guarantee */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Strict 24-Hour Limit</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              ByteChoke strictly prevents spam: notifications will fire <strong>only once per 24 hours</strong>.
            </p>
            <div className="text-[11px] text-amber-950 font-mono pt-1">
              Status: <span className="font-semibold">{getNextAvailableTimeStr()}</span>
            </div>
          </div>

          {/* Test Notification Button */}
          <div className="pt-1">
            <button
              type="button"
              id="btn-test-notification"
              onClick={handleSendTestNotification}
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{testSent ? '✓ Test Reminder Sent!' : 'Send Test Notification Now'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-neutral-400">100% Free • No registration needed</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
