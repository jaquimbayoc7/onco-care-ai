// Service Worker para OncoSimil AI
const CACHE_NAME = 'oncosimil-v1';
const RUNTIME_CACHE = 'oncosimil-runtime-v1';

// Recursos críticos para precache (funcionamiento offline básico)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png'
];

// Instalación: precache de recursos críticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching critical resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests que no sean GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requests de Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Estrategia para llamadas API: Network First (con timeout)
        if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/patients-api/')) {
          return await networkFirstStrategy(request);
        }

        // Estrategia para assets estáticos: Cache First
        if (
          request.destination === 'image' ||
          request.destination === 'font' ||
          request.destination === 'style' ||
          request.destination === 'script' ||
          url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/)
        ) {
          return await cacheFirstStrategy(request);
        }

        // Estrategia para navegación: Network First
        if (request.mode === 'navigate') {
          return await networkFirstStrategy(request);
        }

        // Default: Network First
        return await networkFirstStrategy(request);
      } catch (error) {
        console.error('[SW] Fetch error:', error);
        
        // Fallback: intentar cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no hay cache y es navegación, devolver página offline
        if (request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          const fallbackResponse = await cache.match('/index.html');
          if (fallbackResponse) {
            return fallbackResponse;
          }
        }

        // Último recurso: respuesta de error
        return new Response('Offline - No cached content available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      }
    })()
  );
});

// Cache First: Prioriza cache, fallback a network
async function cacheFirstStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log('[SW] Cache hit:', request.url);
    return cachedResponse;
  }

  console.log('[SW] Cache miss, fetching:', request.url);
  const networkResponse = await fetch(request);

  // Solo cachear respuestas exitosas
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

// Network First: Prioriza network, fallback a cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), 5000)
      )
    ]);

    // Cachear respuestas exitosas
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Mensaje para actualizar el SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});