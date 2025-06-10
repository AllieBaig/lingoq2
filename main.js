



import App from './App.svelte';
import './styles/global.css';

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration.scope);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              console.log('New version available!');
              showUpdateNotification();
            }
          });
        }
      });
      
      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          showUpdateNotification();
        }
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

// Show update notification
function showUpdateNotification() {
  if (confirm('A new version of LingoQuest is available. Reload to update?')) {
    window.location.reload();
  }
}

// Initialize the Svelte app
const app = new App({
  target: document.getElementById('app')
});

// Handle app installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt fired');
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  // This will be handled by the app component
  window.dispatchEvent(new CustomEvent('showInstallPrompt', {
    detail: { prompt: deferredPrompt }
  }));
}

// Handle successful app installation
window.addEventListener('appinstalled', () => {
  console.log('LingoQuest was installed successfully');
  deferredPrompt = null;
  
  // Hide install button
  window.dispatchEvent(new CustomEvent('hideInstallPrompt'));
  
  // Show success message
  window.dispatchEvent(new CustomEvent('showMessage', {
    detail: { 
      message: 'LingoQuest installed successfully!', 
      type: 'success' 
    }
  }));
});

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('App is back online');
  window.dispatchEvent(new CustomEvent('connectionChange', {
    detail: { online: true }
  }));
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  window.dispatchEvent(new CustomEvent('connectionChange', {
    detail: { online: false }
  }));
});

// Handle visibility changes for performance optimization
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('App hidden - pausing timers');
    window.dispatchEvent(new CustomEvent('appHidden'));
  } else {
    console.log('App visible - resuming timers');
    window.dispatchEvent(new CustomEvent('appVisible'));
  }
});

// Prevent right-click context menu in production
if (import.meta.env.PROD) {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  
  // Report to error tracking service in production
  if (import.meta.env.PROD) {
    // Add error reporting service here
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  
  // Report to error tracking service in production
  if (import.meta.env.PROD) {
    // Add error reporting service here
  }
});

export default app;




