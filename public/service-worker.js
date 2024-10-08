const CACHE_NAME = 'image-generator-cache-v1';
const urlsToCache = [
  '/ejercicio-zalcu/',               
  '/ejercicio-zalcu/index.html',     
  '/ejercicio-zalcu/manifest.json',
  '/ejercicio-zalcu/logo192.png',
  '/ejercicio-zalcu/logo512.png',
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

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    
    // Mostrar la notificación
    self.registration.showNotification(title, options);
  }
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

  const imageUrl = event.notification.data ? event.notification.data.imageUrl : null;
  const imageId = event.notification.data ? event.notification.data.imageId : null; // Agrega un ID único

  if (imageUrl) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        for (const client of clientList) {
          client.postMessage({
            type: 'DOWNLOAD_IMAGE',
            imageUrl: imageUrl,
            imageId: imageId // Envía el ID único
          });
          return; // Solo enviar el mensaje a la primera ventana encontrada
        }
      })
    );
  } else {
    event.waitUntil(
      clients.openWindow('/ejercicio-zalcu/')
    );
  }
});
