self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('snake-game-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/game.js',
        '/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
