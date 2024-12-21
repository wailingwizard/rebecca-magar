//-----------------------------------------
// Service Worker
//
// * Offline first with cache update
// * Clears old cache on version change
//
//-----------------------------------------

// Init cache name/version
const cacheName = 'v2.6';
const dynamicCacheName = 'dynamic-v2.6';

// Define pages/assets to pre-cache
const cacheAssets = [
  'index.php',
  'about/index.php',
  'contact/index.php',
  'portfolio/index.php',
  'privacy-policy/index.php',
  'sample-project/index.php',
  'sitemap/index.php',
  'assets/css/hero.min.css',
  'assets/css/nav.min.css',
  'assets/css/styles.min.css',
  'app.js',
  'assets/js/carousel.min.js',
  'assets/js/contact-form.min.js',
  'assets/js/hero.min.js',
  'assets/js/jquery-rebox.min.js',
  'assets/js/jquery.min.js',
  'assets/js/script.min.js',
  'assets/images/address-icon-2x.png',
  'assets/images/email-icon-2x.png',
  'assets/images/link-icon-2x.png',
  'assets/images/linkedin-icon-2x.png',
  'assets/images/phone-icon-2x.png',
  'assets/images/rebecca-magar-logo.png',
  'assets/images/rebecca-magar-portrait-halftone.webp',
  'assets/images/rebecca-magar-portrait.webp',
  'assets/images/favicons/android-icon-36x36.png',
  'assets/images/favicons/android-icon-48x48.png',
  'assets/images/favicons/android-icon-72x72.png',
  'assets/images/favicons/android-icon-96x96.png',
  'assets/images/favicons/android-icon-144x144.png',
  'assets/images/favicons/android-icon-192x192.png',
  'assets/images/favicons/apple-icon.png',
  'assets/images/ui-elements/logo.svg',
  // Add more critical assets as needed
];

// Install Service Worker
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(cacheAssets).catch(err => {
        console.error('Caching failed', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate the Service Worker
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName && cache !== dynamicCacheName) {
            console.log('Service Worker: Clearing Old Cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
  console.log('Service Worker: Fetching', e.request.url);
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('Serving from cache:', e.request.url);
        // Optionally, fetch in background to update the cache
        fetch(e.request).then(networkResponse => {
          caches.open(dynamicCacheName).then(cache => {
            cache.put(e.request, networkResponse.clone());
          });
        }).catch(err => console.error('Network fetch failed', err));
        return cachedResponse;
      }
      // Fetch from network if not in cache
      return fetch(e.request).then(networkResponse => {
        // Add to dynamic cache for later use
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Offline fallback
        return caches.match('/offline.html');
      });
    })
  );
});