const CACHE_NAME = 'image-generator-cache-v1';
const urlsToCache = [
  '/ejercicio-zalcu/',               // Raíz de tu app
  '/ejercicio-zalcu/index.html',     // Asegúrate de usar el subdirectorio
  '/ejercicio-zalcu/manifest.json',
  '/ejercicio-zalcu/logo192.png',
  '/ejercicio-zalcu/logo512.png',
  // Otros archivos que quieras cachear
];


self.addEventListener('install', event => {
  console.log('Service Worker instalándose...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('push', event => {
  console.log('Push recibido');
  
  const title = 'Notificación';
  const options = {
    body: 'Tienes una nueva imagen lista.',
    icon: '/logo192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('Notificación clickeada');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
