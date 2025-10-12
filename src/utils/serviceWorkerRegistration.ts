// Utilidad para registrar y gestionar el Service Worker

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration.scope);

          // Detectar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Hay una nueva versión disponible
                  console.log('🔄 Nueva versión del Service Worker disponible');
                  
                  // Notificar al usuario (opcional)
                  if (window.confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Error al registrar Service Worker:', error);
        });

      // Recargar cuando el SW tome control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  } else {
    console.warn('⚠️ Service Workers no soportados en este navegador');
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('🗑️ Service Worker desregistrado');
      })
      .catch((error) => {
        console.error('❌ Error al desregistrar Service Worker:', error);
      });
  }
}

// Verificar si la app está funcionando offline
export function checkOnlineStatus() {
  return navigator.onLine;
}

// Listeners para eventos online/offline
export function setupOnlineStatusListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  window.addEventListener('online', () => {
    console.log('🌐 Conexión restaurada');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('📴 Modo offline');
    onOffline?.();
  });
}