// OncoSimil AI Service Worker - Offline Cache Strategy
const CACHE_NAME = 'oncosimil-v1';
const RUNTIME_CACHE = 'oncosimil-runtime-v1';

// Critical assets to cache immediately (Static assets)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching critical assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network First for API, Cache First for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network First with fallback
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/patients-api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('[SW] Serving API from cache (offline):', url.pathname);
              return cached;
            }
            // Return offline response if no cache
            return new Response(
              JSON.stringify({ 
                error: 'Sin conexión', 
                offline: true,
                message: 'No hay conexión a internet. Mostrando datos en caché.' 
              }),
              { 
                headers: { 'Content-Type': 'application/json' },
                status: 503 
              }
            );
          });
        })
    );
    return;
  }

  // Static assets - Cache First with network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cached version and update in background
        fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }
        }).catch(() => {
          // Network failed, but we have cache
        });
        return cached;
      }

      // Not in cache, fetch from network
      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch((error) => {
        console.error('[SW] Fetch failed:', error);
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        throw error;
      });
    })
  );
});

// Background sync for offline data (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  if (event.tag === 'sync-patient-data') {
    event.waitUntil(syncPatientData());
  }
});

async function syncPatientData() {
  // Placeholder for future offline data sync
  console.log('[SW] Syncing patient data...');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [200, 100, 200],
    tag: 'oncosimil-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('OncoSimil AI', options)
  );
});
