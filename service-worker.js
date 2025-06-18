self.addEventListener('install', function (e) {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
});