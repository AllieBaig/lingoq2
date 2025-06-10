

// Purpose: Offline functionality, caching strategy, and PWA support for LingoQuest
// Key features: Static/dynamic caching, background sync, push notifications, offline support
// Dependencies: Cache API, Service Worker API, Push API
// Related helpers: main.js registration, manifest.json configuration
// Function names: syncProgress, showNotification handlers, cache management
// MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// 2025-06-10 17:50 | File: static/sw.js

const CACHE_NAME = 'lingoquest-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

// Get base path from location
const BASE_PATH = self.location.pathname.includes('/lingoq2') ? '/lingoq2' : '';

// Files to cache immediately
const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/icon-192x192.png`,
  `${BASE_PATH}/icon-512x512.png`,
  `${BASE_PATH}/app/immutable/start-*.js`,
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        // Cache base assets that we know exist
        const basicAssets = [
          `${BASE_PATH}/`,
          `${BASE_PATH}/manifest.json`,
          `${BASE_PATH}/favicon.svg`,
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];
        return cache.addAll(basicAssets);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('lingoquest-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external APIs (except fonts)
  if (url.origin !== location.origin && !url.host.includes('fonts.googleapis.com') && !url.host.includes('fonts.gstatic.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Add to dynamic cache
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                console.log('[SW] Adding to dynamic cache:', request.url);
                cache.put(request, responseToCache);
              })
              .catch(error => {
                console.error('[SW] Failed to cache dynamic resource:', error);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.error('[SW] Network request failed:', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match(`${BASE_PATH}/index.html`) || caches.match(`${BASE_PATH}/`);
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgress());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time for your daily language practice!',
    icon: `${BASE_PATH}/icon-192x192.png`,
    badge: `${BASE_PATH}/icon-192x192.png`,
    vibrate: [200, 100, 200],
    data: {
      url: `${BASE_PATH}/`
    },
    actions: [
      {
        action: 'open',
        title: 'Start Learning',
        icon: `${BASE_PATH}/icon-192x192.png`
      },
      {
        action: 'close',
        title: 'Later'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('LingoQuest', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || `${BASE_PATH}/`)
    );
  }
});

// Helper function to sync progress data
async function syncProgress() {
  try {
    console.log('[SW] Syncing progress data...');
    
    // Get stored progress data
    const cache = await caches.open(DYNAMIC_CACHE);
    const progressData = await cache.match('/api/progress');
    
    if (progressData) {
      // Attempt to sync with server
      const response = await fetch('/api/progress', {
        method: 'POST',
        body: await progressData.text(),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('[SW] Progress synced successfully');
        await cache.delete('/api/progress');
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync progress:', error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});


