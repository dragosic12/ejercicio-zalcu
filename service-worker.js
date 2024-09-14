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
  
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/')  // Aquí puedes redirigir a la URL de la app
    );
  });
  