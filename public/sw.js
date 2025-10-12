// OncoSímil - Service Worker (v2 - Fixed POST Cache Issue)
const CACHE_NAME = 'oncosimil-v2';
const RUNTIME_CACHE = 'oncosimil-runtime-v2';

// Essential assets to cache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json',
];

// Install - Precache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Network-first for APIs, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests (except known API domains)
  const isKnownAPI = url.hostname.includes('oncoapp') || 
                     url.hostname.includes('render.com') || 
                     url.pathname.startsWith('/api') || 
                     url.pathname.startsWith('/patients-api');

  if (url.origin !== location.origin && !isKnownAPI) {
    return;
  }

  // API Requests - Network-Only (no caching for POST/PUT/DELETE)
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/patients-api') || isKnownAPI) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache GET requests with successful responses
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            }).catch(err => console.log('[SW] Cache error:', err));
          }
          return response;
        })
        .catch((error) => {
          console.log('[SW] Network error:', error);
          // Only try cache for GET requests
          if (request.method === 'GET') {
            return caches.match(request).then((cached) => {
              if (cached) {
                console.log('[SW] Serving from cache (offline):', url.pathname);
                return cached;
              }
            });
          }
          // Return error response for failed requests
          return new Response(
            JSON.stringify({ 
              error: 'Sin conexión', 
              message: 'No se puede completar la operación sin conexión.' 
            }),
            { 
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        })
    );
    return;
  }

  // Static Assets - Cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cache and update in background
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

      // Not in cache - fetch from network
      return fetch(request).then((response) => {
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

// Background Sync (for future offline support)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-patient-data') {
    event.waitUntil(syncPatientData());
  }
});

async function syncPatientData() {
  console.log('[SW] Syncing patient data...');
  // Future implementation for offline data sync
}

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [200, 100, 200],
    tag: 'oncosimil-notification',
    requireInteraction: false,
  };
  
  event.waitUntil(
    self.registration.showNotification('OncoSímil', options)
  );
});
