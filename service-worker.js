importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log(`Workbox berhasil dimuat`);
} else {
    console.log(`Workbox gagal dimuat`);
}
workbox.precaching.precacheAndRoute([
  { url: '/manifest.json', revision: '1' },
  { url: '/nav-bar.html', revision: '1' },
  { url: '/index.html', revision: '2' },
  { url: '/detail.html', revision: '2' },
  { url: '/detailMatch.html', revision: '2' },
  { url: '/css/style.css', revision: '2' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/nav-bar.js', revision: '1' },
  { url: '/js/home.js', revision: '2' },
  { url: '/js/db.js', revision: '1' },
  { url: '/js/idb.js', revision: '1' },
  { url: '/js/sw.js', revision: '2' },
  { url: '/js/swDetailTeams.js', revision: '2' },
  { url: '/js/swDetailMatch.js', revision: '2' },
  { url: 'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', revision: '1' },
  { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1' },
  { url: 'https://code.jquery.com/jquery-3.5.1.slim.min.js', revision: '1' },
], {ignoreUrlParametersMatching: [/.*/]}
);
workbox.routing.registerRoute(
  /\.(?:png|webp|jpg|jpeg|svg|ico)$/,
  workbox.strategies.cacheFirst({
      cacheName: 'image-cache',
      plugins: [
          new workbox.expiration.Plugin({
              maxEntries: 60,
              maxAgeSeconds: 2592000, // 30 hari
          }),
      ],
  }),
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages'
  })
);
workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'api-football'
  })
);

// Project Console: https://console.firebase.google.com/project/pwa-premier-league-5c17d/overview
// Hosting URL: https://pwa-premier-league-5c17d.web.app

/*
const CACHE_NAME = "PWAsubmission-v0.1";
const urlsToCache = [
  "/",
  "/manifest.json",
  "/nav-bar.html",
  "/index.html",
  "/detail.html",
  "/detailMatch.html",
  "/pages/home.html",
  "/pages/team.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/icon/apple-touch-icon-180x180.png",
  "/icon/favicon2.ico",
  "/icon/pwa-192x192.png",
  "/icon/pwa-512x512.png",
  "/icon/favicon-16x16.png",
  "/icon/favicon-32x32.png",
  "/images/1200px-LuzLissabon-blur2.png",
  "/js/materialize.min.js",
  "/js/nav-bar.js",
  "/js/home.js",
  "/js/db.js",
  "/js/idb.js",
  "/js/sw.js",
  "/js/swDetailTeams.js",
  "/js/swDetailMatch.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "https://code.jquery.com/jquery-3.5.1.slim.min.js"
];
 
self.addEventListener("install", (event)=> {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache)=> {
        return cache.addAll(urlsToCache);
      })
    );
  });
  
  self.addEventListener("fetch", (event) =>{
    const base_url = "https://api.football-data.org/v2/";  
    if (event.request.url.indexOf(base_url) > -1) {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>{
          return fetch(event.request).then((response) =>{
            cache.put(event.request.url, response.clone());
            return response;
          }).catch(error=>{
            console.error(error);
          })
        })
      );
    } else {
      event.respondWith(
          caches.match(event.request, { ignoreSearch: true }).then((response) =>{
              return response || fetch (event.request);
          })
      )
  }
  });
  
    self.addEventListener("activate", (event)=> {
      event.waitUntil(
        caches.keys().then((cacheNames)=> {
          return Promise.all(
            cacheNames.map((cacheName)=> {
              if (cacheName !== CACHE_NAME) {
                console.log(`ServiceWorker: cache ${cacheName} dihapus`);
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
*/
    self.addEventListener('push', (event) =>{
      let body;
      if (event.data) {
        body = event.data.text();
      } else {
        body = 'Push message no payload';
      }
      const options = {
        body: body,
        icon: 'icon/pwa-192x192.png',
        badge:'icon/favicon-16x16.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      const title = 'Match News';
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    });