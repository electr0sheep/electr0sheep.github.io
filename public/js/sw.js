var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/public/css/lanyon.css',
  '/public/css/poole.css',
  '/public/css/syntax.css',
  '/public/css/darkly.css',
  '/public/css/bootstrap.css',
  '/public/css/custom.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
