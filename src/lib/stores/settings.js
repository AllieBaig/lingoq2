


/*
 * Purpose: User settings and preferences management for LingoQuest
 * Key features: Theme switching, language preferences, notifications, accessibility
 * Dependencies: Svelte stores, localStorage
 * Related helpers: Theme utility, notification service, language detector
 * Function names: updateTheme, toggleNotifications, setLanguage, saveSettings
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-06-11 14:34 | File: lib/stores/settings.js
 */

import { writable, derived, get } from 'svelte/store';

// Default settings configuration
const DEFAULT_SETTINGS = {
  // Appearance
  theme: 'auto', // 'light', 'dark', 'auto'
  colorScheme: 'default', // 'default', 'blue', 'green', 'purple'
  fontSize: 'medium', // 'small', 'medium', 'large', 'extra-large'
  animations: true,
  reducedMotion: false,

  // Language Learning
  targetLanguage: 'spanish',
  nativeLanguage: 'english',
  difficultyLevel: 'beginner', // 'beginner', 'intermediate', 'advanced'
  learningGoals: {
    dailyXP: 50,
    weeklyLessons: 7,
    streakTarget: 30
  },

  // Notifications
  notifications: {
    enabled: true,
    dailyReminder: true,
    reminderTime: '19:00',
    streakReminder: true,
    achievementAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true
  },

  // Audio & Speech
  audio: {
    enabled: true,
    volume: 0.8,
    speechSpeed: 1.0,
    voiceGender: 'female', // 'male', 'female', 'auto'
    pronunciation: true,
    autoPlay: false
  },

  // Accessibility
  accessibility: {
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true
  },

  // Privacy & Data
  privacy: {
    analytics: true,
    crashReporting: true,
    personalizedAds: false,
    dataSharing: false,
    offlineMode: true
  },

  // Study Preferences
  study: {
    sessionLength: 15, // minutes
    breakReminders: true,
    mistakeReview: true,
    spaced_repetition: true,
    adaptive_difficulty: true,
    show_translations: true
  },

  // Interface
  interface: {
    language: 'en',
    showProgress: true,
    compactMode: false,
    sidebarCollapsed: false,
    showHints: true,
    confirmExit: true
  }
};

// Settings store
export const settings = writable(DEFAULT_SETTINGS);

// Individual setting categories for easier access
export const themeSettings = derived(
  settings,
  ($settings) => $settings.theme
);

export const notificationSettings = derived(
  settings,
  ($settings) => $settings.notifications
);

export const audioSettings = derived(
  settings,
  ($settings) => $settings.audio
);

export const accessibilitySettings = derived(
  settings,
  ($settings) => $settings.accessibility
);

export const privacySettings = derived(
  settings,
  ($settings) => $settings.privacy
);

export const studySettings = derived(
  settings,
  ($settings) => $settings.study
);

// Theme store for UI theming
export const currentTheme = writable('light');

// Language options
export const availableLanguages = writable([
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸', difficulty: 'beginner' },
  { code: 'french', name: 'French', flag: '🇫🇷', difficulty: 'beginner' },
  { code: 'german', name: 'German', flag: '🇩🇪', difficulty: 'intermediate' },
  { code: 'italian', name: 'Italian', flag: '🇮🇹', difficulty: 'beginner' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹', difficulty: 'beginner' },
  { code: 'japanese', name: 'Japanese', flag: '🇯🇵', difficulty: 'advanced' },
  { code: 'korean', name: 'Korean', flag: '🇰🇷', difficulty: 'advanced' },
  { code: 'chinese', name: 'Chinese', flag: '🇨🇳', difficulty: 'advanced' },
  { code: 'russian', name: 'Russian', flag: '🇷🇺', difficulty: 'advanced' },
  { code: 'arabic', name: 'Arabic', flag: '🇸🇦', difficulty: 'advanced' }
]);

// Interface language options
export const interfaceLanguages = writable([
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: 'Русский' }
]);

// Settings actions
export const settingsActions = {
  // Initialize settings from localStorage
  loadSettings() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lingoquest-settings');
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved);
          const mergedSettings = this.mergeSettings(DEFAULT_SETTINGS, parsedSettings);
          settings.set(mergedSettings);
          this.applySettings(mergedSettings);
        } catch (error) {
          console.error('Failed to load settings:', error);
          this.resetToDefaults();
        }
      } else {
        this.detectSystemPreferences();
      }
    }
  },

  // Save settings to localStorage
  saveSettings() {
    if (typeof window !== 'undefined') {
      const currentSettings = get(settings);
      localStorage.setItem('lingoquest-settings', JSON.stringify(currentSettings));
    }
  },

  // Merge saved settings with defaults (for version compatibility)
  mergeSettings(defaults, saved) {
    const merged = { ...defaults };
    
    Object.keys(saved).forEach(key => {
      if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
        merged[key] = { ...defaults[key], ...saved[key] };
      } else {
        merged[key] = saved[key];
      }
    });
    
    return merged;
  },

  // Apply settings to the UI
  applySettings(settingsData) {
    this.applyTheme(settingsData.theme);
    this.applyColorScheme(settingsData.colorScheme);
    this.applyFontSize(settingsData.fontSize);
    this.applyAccessibilitySettings(settingsData.accessibility);
    this.applyAnimationSettings(settingsData.animations, settingsData.reducedMotion);
  },

  // Detect system preferences
  detectSystemPreferences() {
    if (typeof window === 'undefined') return;

    const systemSettings = { ...DEFAULT_SETTINGS };

    // Detect dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      systemSettings.theme = 'dark';
    }

    // Detect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      systemSettings.reducedMotion = true;
      systemSettings.animations = false;
    }

    // Detect high contrast preference
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      systemSettings.accessibility.highContrast = true;
    }

    // Detect language preference
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = get(interfaceLanguages).map(lang => lang.code);
    if (supportedLangs.includes(browserLang)) {
      systemSettings.interface.language = browserLang;
    }

    settings.set(systemSettings);
    this.applySettings(systemSettings);
    this.saveSettings();
  },

  // Update specific setting
  updateSetting(path, value) {
    settings.update(currentSettings => {
      const updated = { ...currentSettings };
      this.setNestedProperty(updated, path, value);
      return updated;
    });
    
    this.saveSettings();
    this.applySettings(get(settings));
  },

  // Update multiple settings at once
  updateSettings(updates) {
    settings.update(currentSettings => ({
      ...currentSettings,
      ...updates
    }));
    
    this.saveSettings();
    this.applySettings(get(settings));
  },

  // Theme management
  applyTheme(theme) {
    if (typeof window === 'undefined') return;

    let actualTheme = theme;
    
    if (theme === 'auto') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', actualTheme);
    currentTheme.set(actualTheme);
    
    // Update meta theme-color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = actualTheme === 'dark' ? '#1e293b' : '#6366f1';
    }
  },

  // Color scheme management
  applyColorScheme(scheme) {
    if (typeof window === 'undefined') return;
    
    document.documentElement.setAttribute('data-color-scheme', scheme);
  },

  // Font size management
  applyFontSize(size) {
    if (typeof window === 'undefined') return;
    
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    
    document.documentElement.style.setProperty('--base-font-size', sizeMap[size]);
    document.documentElement.setAttribute('data-font-size', size);
  },

  // Accessibility settings
  applyAccessibilitySettings(accessibilityData) {
    if (typeof window === 'undefined') return;
    
    document.documentElement.toggleAttribute('data-high-contrast', accessibilityData.highContrast);
    document.documentElement.toggleAttribute('data-large-text', accessibilityData.largeText);
    document.documentElement.toggleAttribute('data-screen-reader', accessibilityData.screenReader);
    document.documentElement.toggleAttribute('data-keyboard-nav', accessibilityData.keyboardNavigation);
    document.documentElement.toggleAttribute('data-focus-indicators', accessibilityData.focusIndicators);
  },

  // Animation settings
  applyAnimationSettings(animations, reducedMotion) {
    if (typeof window === 'undefined') return;
    
    document.documentElement.toggleAttribute('data-animations', animations && !reducedMotion);
    document.documentElement.toggleAttribute('data-reduced-motion', reducedMotion);
  },

  // Notification permissions
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.updateSetting('notifications.enabled', true);
        return true;
      } else {
        this.updateSetting('notifications.enabled', false);
        return false;
      }
    }
    return false;
  },

  // Schedule daily reminder
  scheduleDailyReminder() {
    const currentSettings = get(settings);
    
    if (currentSettings.notifications.enabled && currentSettings.notifications.dailyReminder) {
      const reminderTime = currentSettings.notifications.reminderTime;
      const [hours, minutes] = reminderTime.split(':').map(Number);
      
      // Implementation would depend on notification service
      console.log(`Daily reminder scheduled for ${hours}:${minutes}`);
    }
  },

  // Export settings
  exportSettings() {
    const currentSettings = get(settings);
    const dataStr = JSON.stringify(currentSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'lingoquest-settings.json';
    link.click();
  },

  // Import settings
  async importSettings(file) {
    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      const mergedSettings = this.mergeSettings(DEFAULT_SETTINGS, importedSettings);
      
      settings.set(mergedSettings);
      this.applySettings(mergedSettings);
      this.saveSettings();
      
      return { success: true, message: 'Settings imported successfully' };
    } catch (error) {
      console.error('Failed to import settings:', error);
      return { success: false, message: 'Failed to import settings: Invalid file format' };
    }
  },

  // Reset to defaults
  resetToDefaults() {
    settings.set(DEFAULT_SETTINGS);
    this.applySettings(DEFAULT_SETTINGS);
    this.saveSettings();
  },

  // Reset specific category
  resetCategory(category) {
    if (DEFAULT_SETTINGS[category]) {
      this.updateSetting(category, DEFAULT_SETTINGS[category]);
    }
  },

  // Validate settings
  validateSettings(settingsData) {
    const errors = [];
    
    // Validate theme
    if (!['light', 'dark', 'auto'].includes(settingsData.theme)) {
      errors.push('Invalid theme setting');
    }
    
    // Validate target language
    const availableLangs = get(availableLanguages).map(lang => lang.code);
    if (!availableLangs.includes(settingsData.targetLanguage)) {
      errors.push('Invalid target language');
    }
    
    // Validate daily XP goal
    if (settingsData.learningGoals.dailyXP < 10 || settingsData.learningGoals.dailyXP > 500) {
      errors.push('Daily XP goal must be between 10 and 500');
    }
    
    // Validate audio volume
    if (settingsData.audio.volume < 0 || settingsData.audio.volume > 1) {
      errors.push('Audio volume must be between 0 and 1');
    }
    
    return errors;
  },

  // Helper function to set nested property
  setNestedProperty(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  },

  // Get setting value by path
  getSetting(path) {
    const currentSettings = get(settings);
    return path.split('.').reduce((obj, key) => obj?.[key], currentSettings);
  },

  // Check if feature is enabled
  isFeatureEnabled(feature) {
    switch (feature) {
      case 'notifications':
        return this.getSetting('notifications.enabled');
      case 'audio':
        return this.getSetting('audio.enabled');
      case 'analytics':
        return this.getSetting('privacy.analytics');
      case 'offline':
        return this.getSetting('privacy.offlineMode');
      default:
        return false;
    }
  }
};

// Watch for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const currentSettings = get(settings);
    if (currentSettings.theme === 'auto') {
      settingsActions.applyTheme('auto');
    }
  });

  // Watch for reduced motion changes
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', (e) => {
    settingsActions.updateSetting('reducedMotion', e.matches);
    settingsActions.updateSetting('animations', !e.matches);
  });
}

// Initialize settings on module load
if (typeof window !== 'undefined') {
  settingsActions.loadSettings();
}


