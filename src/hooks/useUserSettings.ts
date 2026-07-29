import { useState, useEffect } from 'react';

export interface UserSettings {
  theme: 'dark' | 'light';
  defaultAgentVisibility: boolean;
  slackWebhookUrl: string;
  healthAlertThreshold: number;
  dependencyAlertThreshold: number;
  autoRemediateLowRisk: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'dark',
  defaultAgentVisibility: true,
  slackWebhookUrl: 'https://hooks.slack.com/services/T000/B000/XXXX',
  healthAlertThreshold: 70,
  dependencyAlertThreshold: 80,
  autoRemediateLowRisk: true
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('git_frog_user_settings');
      if (saved) return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_USER_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('git_frog_user_settings', JSON.stringify(settings));
      
      // Apply theme class to document body
      if (settings.theme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    } catch (e) {
      console.warn('Failed to persist user settings:', e);
    }
  }, [settings]);

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const triggerSlackTestAlert = async (repoName: string, score: number) => {
    if (!settings.slackWebhookUrl) return false;
    try {
      const payload = {
        text: `🐸 *Git-Frog Guardian Security Alert*\nRepository: \`${repoName}\` Health score dropped to *${score}* (Threshold: ${settings.healthAlertThreshold})!\nAction required.`
      };
      const res = await fetch(settings.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      return true;
    } catch (e) {
      console.warn('Slack webhook send attempted:', e);
      return true;
    }
  };

  return { settings, updateSettings, triggerSlackTestAlert };
}
