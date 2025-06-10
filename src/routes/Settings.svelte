










<!--
Purpose: Settings and preferences management page for LingoQuest PWA
Key features: Theme switcher, notifications, language preferences, data management, app info
Dependencies: CSS variables, localStorage, browser APIs for notifications and PWA features  
Related helpers: Theme management, notification permissions, data export/import utilities
Function names: toggleTheme, requestNotificationPermission, exportData, importData, resetProgress
MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
Timestamp: 2025-06-10 15:30 | File: src/routes/Settings.svelte
-->

<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { 
    Settings, 
    Moon, 
    Sun, 
    Bell, 
    BellOff, 
    Download, 
    Upload, 
    Trash2, 
    Info, 
    Globe, 
    Volume2, 
    VolumeX,
    Smartphone,
    Monitor,
    Eye,
    Shield,
    Database
  } from 'lucide-svelte';

  // Settings stores
  const theme = writable('system');
  const notificationsEnabled = writable(false);
  const soundEnabled = writable(true);
  const language = writable('en');
  const studyReminders = writable(true);
  const streakReminders = writable(true);
  const achievementNotifications = writable(true);
  const dataCollection = writable(true);
  const offlineMode = writable(true);

  // UI state
  let isLoading = false;
  let message = { text: '', type: '' };
  let currentTheme = 'system';
  let notificationPermission = 'default';
  let isOnline = navigator.onLine;

  // Theme options
  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'it', label: 'Italiano', flag: '🇮🇹' },
    { value: 'pt', label: 'Português', flag: '🇧🇷' },
    { value: 'ja', label: '日本語', flag: '🇯🇵' },
    { value: 'ko', label: '한국어', flag: '🇰🇷' },
    { value: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  onMount(() => {
    loadSettings();
    checkNotificationPermission();
    
    // Listen for online/offline events
    const handleOnline = () => isOnline = true;
    const handleOffline = () => isOnline = false;
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  // Load settings from localStorage
  function loadSettings() {
    try {
      const savedTheme = localStorage.getItem('lingoquest-theme') || 'system';
      const savedNotifications = localStorage.getItem('lingoquest-notifications') === 'true';
      const savedSound = localStorage.getItem('lingoquest-sound') !== 'false';
      const savedLanguage = localStorage.getItem('lingoquest-language') || 'en';
      const savedStudyReminders = localStorage.getItem('lingoquest-study-reminders') !== 'false';
      const savedStreakReminders = localStorage.getItem('lingoquest-streak-reminders') !== 'false';
      const savedAchievements = localStorage.getItem('lingoquest-achievement-notifications') !== 'false';
      const savedDataCollection = localStorage.getItem('lingoquest-data-collection') !== 'false';
      const savedOfflineMode = localStorage.getItem('lingoquest-offline-mode') !== 'false';

      theme.set(savedTheme);
      notificationsEnabled.set(savedNotifications);
      soundEnabled.set(savedSound);
      language.set(savedLanguage);
      studyReminders.set(savedStudyReminders);
      streakReminders.set(savedStreakReminders);
      achievementNotifications.set(savedAchievements);
      dataCollection.set(savedDataCollection);
      offlineMode.set(savedOfflineMode);

      currentTheme = savedTheme;
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Failed to load settings:', error);
      showMessage('Failed to load settings', 'error');
    }
  }

  // Apply theme to document
  function applyTheme(themeName) {
    const root = document.documentElement;
    
    if (themeName === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', themeName === 'dark');
    }
  }

  // Handle theme change
  async function handleThemeChange(newTheme) {
    try {
      currentTheme = newTheme;
      theme.set(newTheme);
      localStorage.setItem('lingoquest-theme', newTheme);
      applyTheme(newTheme);
      showMessage('Theme updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update theme:', error);
      showMessage('Failed to update theme', 'error');
    }
  }

  // Check notification permission status
  async function checkNotificationPermission() {
    if ('Notification' in window) {
      notificationPermission = Notification.permission;
    }
  }

  // Request notification permission
  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      showMessage('Notifications are not supported in this browser', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      notificationPermission = permission;
      
      if (permission === 'granted') {
        notificationsEnabled.set(true);
        localStorage.setItem('lingoquest-notifications', 'true');
        showMessage('Notifications enabled successfully', 'success');
      } else {
        notificationsEnabled.set(false);
        localStorage.setItem('lingoquest-notifications', 'false');
        showMessage('Notification permission denied', 'warning');
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      showMessage('Failed to enable notifications', 'error');
    }
  }

  // Toggle notification setting
  async function toggleNotifications() {
    const enabled = !$notificationsEnabled;
    
    if (enabled && notificationPermission !== 'granted') {
      await requestNotificationPermission();
      return;
    }
    
    notificationsEnabled.set(enabled);
    localStorage.setItem('lingoquest-notifications', enabled.toString());
    showMessage(`Notifications ${enabled ? 'enabled' : 'disabled'}`, 'success');
  }

  // Save setting to localStorage
  function saveSetting(key, value) {
    try {
      localStorage.setItem(`lingoquest-${key}`, value.toString());
      showMessage('Setting saved', 'success');
    } catch (error) {
      console.error('Failed to save setting:', error);
      showMessage('Failed to save setting', 'error');
    }
  }

  // Export user data
  async function exportData() {
    try {
      isLoading = true;
      
      const userData = {
        settings: {
          theme: $theme,
          notifications: $notificationsEnabled,
          sound: $soundEnabled,
          language: $language,
          studyReminders: $studyReminders,
          streakReminders: $streakReminders,
          achievementNotifications: $achievementNotifications,
          dataCollection: $dataCollection,
          offlineMode: $offlineMode
        },
        progress: JSON.parse(localStorage.getItem('lingoquest-progress') || '{}'),
        achievements: JSON.parse(localStorage.getItem('lingoquest-achievements') || '[]'),
        statistics: JSON.parse(localStorage.getItem('lingoquest-statistics') || '{}'),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const dataBlob = new Blob([JSON.stringify(userData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lingoquest-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showMessage('Data exported successfully', 'success');
    } catch (error) {
      console.error('Failed to export data:', error);
      showMessage('Failed to export data', 'error');
    } finally {
      isLoading = false;
    }
  }

  // Import user data
  async function importData() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
          isLoading = true;
          const text = await file.text();
          const userData = JSON.parse(text);
          
          // Validate data structure
          if (!userData.settings || !userData.version) {
            throw new Error('Invalid data format');
          }
          
          // Restore settings
          if (userData.settings) {
            Object.entries(userData.settings).forEach(([key, value]) => {
              localStorage.setItem(`lingoquest-${key}`, value.toString());
            });
          }
          
          // Restore progress and other data
          if (userData.progress) {
            localStorage.setItem('lingoquest-progress', JSON.stringify(userData.progress));
          }
          if (userData.achievements) {
            localStorage.setItem('lingoquest-achievements', JSON.stringify(userData.achievements));
          }
          if (userData.statistics) {
            localStorage.setItem('lingoquest-statistics', JSON.stringify(userData.statistics));
          }
          
          // Reload settings
          loadSettings();
          
          showMessage('Data imported successfully', 'success');
        } catch (error) {
          console.error('Failed to import data:', error);
          showMessage('Failed to import data. Please check the file format.', 'error');
        } finally {
          isLoading = false;
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Failed to import data:', error);
      showMessage('Failed to import data', 'error');
    }
  }

  // Reset all progress
  async function resetProgress() {
    if (!confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      return;
    }
    
    try {
      isLoading = true;
      
      // Clear progress data
      localStorage.removeItem('lingoquest-progress');
      localStorage.removeItem('lingoquest-achievements');
      localStorage.removeItem('lingoquest-statistics');
      localStorage.removeItem('lingoquest-streak');
      
      showMessage('Progress reset successfully', 'success');
    } catch (error) {
      console.error('Failed to reset progress:', error);
      showMessage('Failed to reset progress', 'error');
    } finally {
      isLoading = false;
    }
  }

  // Show temporary message
  function showMessage(text, type = 'info') {
    message = { text, type };
    setTimeout(() => {
      message = { text: '', type: '' };
    }, 3000);
  }

  // Get app version and info
  function getAppInfo() {
    return {
      version: '1.0.0',
      lastUpdated: 'June 2025',
      buildNumber: '100',
      serviceWorker: 'serviceWorker' in navigator
    };
  }

  const appInfo = getAppInfo();
</script>

<svelte:head>
  <title>Settings - LingoQuest</title>
  <meta name="description" content="Customize your LingoQuest learning experience with theme, notification, and language preferences." />
</svelte:head>

<div class="settings-page">
  <div class="container">
    <header class="page-header">
      <div class="header-icon">
        <Settings size={32} />
      </div>
      <div class="header-content">
        <h1>Settings</h1>
        <p>Customize your learning experience</p>
      </div>
      <div class="connection-status">
        <div class="status-indicator {isOnline ? 'online' : 'offline'}">
          <span class="status-dot"></span>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
    </header>

    {#if message.text}
      <div class="message message-{message.type}">
        {message.text}
      </div>
    {/if}

    <div class="settings-sections">
      <!-- Appearance Section -->
      <section class="settings-section">
        <div class="section-header">
          <h2>Appearance</h2>
          <p>Customize the look and feel of the app</p>
        </div>
        
        <div class="setting-group">
          <label class="setting-label">
            <Eye size={20} />
            Theme
          </label>
          <div class="theme-options">
            {#each themeOptions as option}
              <button
                class="theme-option {currentTheme === option.value ? 'active' : ''}"
                on:click={() => handleThemeChange(option.value)}
              >
                <svelte:component this={option.icon} size={18} />
                <span>{option.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">
            <Globe size={20} />
            App Language
          </label>
          <select 
            bind:value={$language}
            on:change={() => saveSetting('language', $language)}
            class="setting-select"
          >
            {#each languageOptions as lang}
              <option value={lang.value}>
                {lang.flag} {lang.label}
              </option>
            {/each}
          </select>
        </div>
      </section>

      <!-- Notifications Section -->
      <section class="settings-section">
        <div class="section-header">
          <h2>Notifications</h2>
          <p>Manage how LingoQuest keeps you engaged</p>
        </div>

        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">
                {#if $notificationsEnabled}
                  <Bell size={20} />
                {:else}
                  <BellOff size={20} />
                {/if}
                Push Notifications
              </label>
              <p class="setting-description">
                Get reminders for lessons and achievements
              </p>
            </div>
            <button 
              class="toggle-btn {$notificationsEnabled ? 'active' : ''}"
              on:click={toggleNotifications}
              disabled={notificationPermission === 'denied'}
            >
              <span class="toggle-slider"></span>
            </button>
          </div>
          
          {#if notificationPermission === 'denied'}
            <p class="setting-note">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          {/if}
        </div>

        {#if $notificationsEnabled}
          <div class="setting-group">
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Study Reminders</label>
                <p class="setting-description">Daily reminders to practice</p>
              </div>
              <button 
                class="toggle-btn {$studyReminders ? 'active' : ''}"
                on:click={() => {
                  studyReminders.update(v => !v);
                  saveSetting('study-reminders', !$studyReminders);
                }}
              >
                <span class="toggle-slider"></span>
              </button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Streak Reminders</label>
                <p class="setting-description">Don't break your learning streak</p>
              </div>
              <button 
                class="toggle-btn {$streakReminders ? 'active' : ''}"
                on:click={() => {
                  streakReminders.update(v => !v);
                  saveSetting('streak-reminders', !$streakReminders);
                }}
              >
                <span class="toggle-slider"></span>
              </button>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Achievement Notifications</label>
                <p class="setting-description">Celebrate your milestones</p>
              </div>
              <button 
                class="toggle-btn {$achievementNotifications ? 'active' : ''}"
                on:click={() => {
                  achievementNotifications.update(v => !v);
                  saveSetting('achievement-notifications', !$achievementNotifications);
                }}
              >
                <span class="toggle-slider"></span>
              </button>
            </div>
          </div>
        {/if}

        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">
                {#if $soundEnabled}
                  <Volume2 size={20} />
                {:else}
                  <VolumeX size={20} />
                {/if}
                Sound Effects
              </label>
              <p class="setting-description">Audio feedback for interactions</p>
            </div>
            <button 
              class="toggle-btn {$soundEnabled ? 'active' : ''}"
              on:click={() => {
                soundEnabled.update(v => !v);
                saveSetting('sound', !$soundEnabled);
              }}
            >
              <span class="toggle-slider"></span>
            </button>
          </div>
        </div>
      </section>

      <!-- Privacy & Data Section -->
      <section class="settings-section">
        <div class="section-header">
          <h2>Privacy & Data</h2>
          <p>Control your data and privacy preferences</p>
        </div>

        <div class="setting-group">
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">
                <Shield size={20} />
                Anonymous Analytics
              </label>
              <p class="setting-description">Help improve LingoQuest with usage data</p>
            </div>
            <button 
              class="toggle-btn {$dataCollection ? 'active' : ''}"
              on:click={() => {
                dataCollection.update(v => !v);
                saveSetting('data-collection', !$dataCollection);
              }}
            >
              <span class="toggle-slider"></span>
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">
                <Database size={20} />
                Offline Mode
              </label>
              <p class="setting-description">Cache lessons for offline use</p>
            </div>
            <button 
              class="toggle-btn {$offlineMode ? 'active' : ''}"
              on:click={() => {
                offlineMode.update(v => !v);
                saveSetting('offline-mode', !$offlineMode);
              }}
            >
              <span class="toggle-slider"></span>
            </button>
          </div>
        </div>

        <div class="setting-group">
          <h3 class="group-title">Data Management</h3>
          
          <div class="action-buttons">
            <button 
              class="btn btn-secondary"
              on:click={exportData}
              disabled={isLoading}
            >
              <Download size={18} />
              Export Data
            </button>
            
            <button 
              class="btn btn-secondary"
              on:click={importData}
              disabled={isLoading}
            >
              <Upload size={18} />
              Import Data
            </button>
            
            <button 
              class="btn btn-danger"
              on:click={resetProgress}
              disabled={isLoading}
            >
              <Trash2 size={18} />
              Reset Progress
            </button>
          </div>
        </div>
      </section>

      <!-- App Info Section -->
      <section class="settings-section">
        <div class="section-header">
          <h2>App Information</h2>
          <p>About LingoQuest and technical details</p>
        </div>

        <div class="setting-group">
          <div class="app-info">
            <div class="info-item">
              <label class="setting-label">
                <Smartphone size={20} />
                Version
              </label>
              <span class="info-value">{appInfo.version}</span>
            </div>

            <div class="info-item">
              <label class="setting-label">Last Updated</label>
              <span class="info-value">{appInfo.lastUpdated}</span>
            </div>

            <div class="info-item">
              <label class="setting-label">Build Number</label>
              <span class="info-value">{appInfo.buildNumber}</span>
            </div>

            <div class="info-item">
              <label class="setting-label">PWA Support</label>
              <span class="info-value {appInfo.serviceWorker ? 'text-success' : 'text-error'}">
                {appInfo.serviceWorker ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div class="setting-group">
          <div class="legal-links">
            <a href="/privacy" class="legal-link">Privacy Policy</a>
            <a href="/terms" class="legal-link">Terms of Service</a>
            <a href="/support" class="legal-link">Support</a>
            <a href="/about" class="legal-link">About</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>


<style>
  .settings-page {
    min-height: 100vh;
    padding: var(--spacing-6) 0;
    background: var(--bg-gradient);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--spacing-4);
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-8);
    padding: var(--spacing-6);
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
  }

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: var(--primary-gradient);
    color: white;
    border-radius: var(--border-radius-lg);
  }

  .header-content {
    flex: 1;
  }

  .header-content h1 {
    margin: 0 0 var(--spacing-1) 0;
    color: var(--text-color);
  }

  .header-content p {
    margin: 0;
    color: var(--text-secondary);
  }

  .connection-status {
    display: flex;
    align-items: center;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--border-radius);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .status-indicator.online {
    background: var(--success-light);
    color: var(--success-color);
  }

  .status-indicator.offline {
    background: var(--error-light);
    color: var(--error-color);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }

  .message {
    padding: var(--spacing-3) var(--spacing-4);
    margin-bottom: var(--spacing-4);
    border-radius: var(--border-radius);
    font-weight: var(--font-weight-medium);
  }

  .message-success {
    background: var(--success-light);
    color: var(--success-color);
    border: 1px solid var(--success-color);
  }

  .message-error {
    background: var(--error-light);
    color: var(--error-color);
    border: 1px solid var(--error-color);
  }

  .message-warning {
    background: var(--warning-light);
    color: var(--warning-color);
    border: 1px solid var(--warning-color);
  }

  .settings-sections {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
  }

  .settings-section {
    background: var(--bg-primary);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    overflow: hidden;
  }

  .section-header {
    padding: var(--spacing-6) var(--spacing-6) var(--spacing-4);
    border-bottom: 1px solid var(--border-color);
  }

  .section-header h2 {
    margin: 0 0 var(--spacing-2) 0;
    font-size: var(--font-size-xl);
    color: var(--text-color);
  }

  .section-header p {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .setting-group {
    padding: var(--spacing-4) var(--spacing-6);
  }

  .setting-group:not(:last-child) {
    border-bottom: 1px solid var(--border-light);
  }

  .group-title {
    margin: 0 0 var(--spacing-4) 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-4);
    padding: var(--spacing-3) 0;
  }

  .setting-info {
    flex: 1;
  }

  .setting-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
    margin-bottom: var(--spacing-1);
  }

  .setting-description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .setting-note {
    margin: var(--spacing-2) 0 0 0;
    font-size: var(--font-size-xs);
    color: var(--warning-color);
    font-style: italic;
  }

  .setting-select {
    width: 100%;
    max-width: 200px;
    padding: var(--spacing-2) var(--spacing-3);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-primary);
    color: var(--text-color);
    font-size: var(--font-size-sm);
  }

  .theme-options {
    display: flex;
    gap: var(--spacing-2);
    margin-top: var(--spacing-3);
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-4);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-secondary);
    color: var(--text-color);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-sm);
  }

  .theme-option:hover {
    border-color: var(--primary-color);
    background: var(--bg-tertiary);
  }

  .theme-option.active {
    border-color: var(--primary-color);
    background: var(--primary-color-20);
    color: var(--primary-color);
  }

  .toggle-btn {
    position: relative;
    width: 48px;
    height: 24px;
    border: none;
    border-radius: 12px;
    background: var(--bg-secondary);
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .toggle-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toggle-btn.active {
    background: var(--primary-color);
  }

  .toggle-slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform var(--transition-fast);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .toggle-btn.active .toggle-slider {
    transform: translateX(24px);
  }

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
    margin-top: var(--spacing-4);
  }

  .action-buttons .btn {
    flex: 1;
    min-width: 140px;
  }

  .app-info {
    display: grid;
    gap: var(--spacing-4);
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-3) 0;
    border-bottom: 1px solid var(--border-light);
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-value {
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
  }

  .legal-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-4);
    margin-top: var(--spacing-4);
  }

  .legal-link {
    color: var(--primary-color);
    text-decoration: none;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    transition: color var(--transition-fast);
  }

  .legal-link:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }

  /* Loading state */
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 0 var(--spacing-3);
    }

    .page-header {
      flex-direction: column;
      text-align: center;
      gap: var(--spacing-3);
    }

    .header-content {
      order: -1;
    }

    .connection-status {
      order: 1;
    }

    .setting-item {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-3);
    }

    .toggle-btn {
      align-self: flex-end;
    }

    .theme-options {
      flex-direction: column;
    }

    .theme-option {
      justify-content: center;
    }

    .action-buttons {
      flex-direction: column;
    }

    .action-buttons .btn {
      min-width: auto;
    }

    .legal-links {
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .app-info {
      gap: var(--spacing-2);
    }

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-1);
    }
  }

  @media (max-width: 480px) {
    .settings-page {
      padding: var(--spacing-4) 0;
    }

    .page-header {
      padding: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }

    .setting-group {
      padding: var(--spacing-3) var(--spacing-4);
    }

    .section-header {
      padding: var(--spacing-4) var(--spacing-4) var(--spacing-3);
    }
  }

  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .toggle-slider {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .toggle-btn {
      border: 2px solid var(--border-color);
    }

    .toggle-btn.active {
      border-color: var(--primary-color);
    }

    .theme-option {
      border-width: 2px;
    }

    .settings-section {
      border-width: 2px;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .toggle-slider {
      transition: none;
    }

    .theme-option {
      transition: none;
    }

    .toggle-btn {
      transition: none;
    }
  }
</style>







