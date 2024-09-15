const CACHE_NAME = 'image-generator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  // Agrega aquí otros archivos que quieras cachear, como CSS, JS, etc.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en la caché, devuélvelo
        if (response) {
          return response;
        }
        // Si no está en la caché, realiza una solicitud de red
        return fetch(event.request);
      })
  );
});


self.addEventListener('push', event => {
    const data = event.data.json();
    const title = data.title || 'Notificación';
    const options = {
      body: data.body || 'Tienes una nueva imagen lista.',
      icon: data.icon || '/logo192.png'
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();  // Cierra la notificación cuando se hace clic en ella
  
    // Verifica si hay ventanas abiertas de la PWA
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Si la PWA ya está abierta, enfoca la ventana
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no, abre una nueva ventana
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });
  