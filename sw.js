//-----------------------------------------
// Service Worker
//
// * Offline first
// * Clears old cache on version change
//
//-----------------------------------------

// Init cache name/version
const cacheName = 'v2.1';

// which pages/assets do you want to cache?
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
  'assets/images/design-makes-me-happy_400.webp',
  'assets/images/design-makes-me-happy_800.webp',
  'assets/images/design-makes-me-happy.webp',
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
  'assets/images/favicons/android-icon-384x384.png',
  'assets/images/favicons/apple-icon-57x57.png',
  'assets/images/favicons/apple-icon-60x60.png',
  'assets/images/favicons/apple-icon-72x72.png',
  'assets/images/favicons/apple-icon-76x76.png',
  'assets/images/favicons/apple-icon-114x114.png',
  'assets/images/favicons/apple-icon-120x120.png',
  'assets/images/favicons/apple-icon-144x144.png',
  'assets/images/favicons/apple-icon-152x152.png',
  'assets/images/favicons/apple-icon-180x180.png',
  'assets/images/favicons/apple-icon-precomposed.png',
  'assets/images/favicons/apple-icon.png',
  'assets/images/favicons/apple-touch-icon.png',
  'assets/images/favicons/favicon-16x16.png',
  'assets/images/favicons/favicon-32x32.png',
  'assets/images/favicons/favicon-96x96.png',
  'assets/images/favicons/favicon.ico',
  'assets/images/favicons/ms-icon-70x70.png',
  'assets/images/favicons/ms-icon-144x144.png',
  'assets/images/favicons/ms-icon-150x150.png',
  'assets/images/favicons/safari-pinned-tab.svg',
  'assets/images/favicons/site-icon-512x512.png',
  'assets/images/og-images/partners-and-harrison-facebook-og.jpg',
  'assets/images/og-images/rebecca-magar-og.jpg',
  'assets/images/sample-project/partners-and-harrison-banner_400.webp',
  'assets/images/sample-project/partners-and-harrison-banner_800.webp',
  'assets/images/sample-project/partners-and-harrison-banner.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-email-poster.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-email-template-mobile-mock_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-email-template-mobile-mock_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-email-template-mobile-mock.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-email-template-mock_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-email-template-mock_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-email-template-mock.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-landing-page-poster.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-mock-1_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-mock-1_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-mock-1.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-mock-2_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-mock-2_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-mock-2.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-monitor-mock-1_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-monitor-mock-1_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-monitor-mock-1.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-monitor-mock-2_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-monitor-mock-2_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-monitor-mock-2.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-desktop-poster.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-mobile-mock_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-mobile-mock_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-mobile-mock.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-website-mobile-poster.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-landing-page-desktop-monitor-mock_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-landing-page-desktop-monitor-mock_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-landing-page-desktop-monitor-mock.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-landing-page-mobile-mock_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-landing-page-mobile-mock_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-landing-page-mobile-mock.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-1_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-1_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-1.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-2_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-2_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-2.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-3_400.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-3_800.webp',
  'assets/images/sample-project/partners-and-harrison-rebrand-whitepaper-mock-3.webp',
  'assets/images/ui-elements/arrow-collapse.svg',
  'assets/images/ui-elements/arrow-expand.svg',
  'assets/images/ui-elements/button-arrow-back.svg',
  'assets/images/ui-elements/button-arrow.svg',
  'assets/images/ui-elements/close-icon.svg',
  'assets/images/ui-elements/happy-face-dark.svg',
  'assets/images/ui-elements/logo-light.svg',
  'assets/images/ui-elements/logo.svg',
  'assets/images/ui-elements/open-icon.svg',
  'assets/images/ui-elements/up.svg',
]

// Install service worker
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});


// Activate the service worker
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');

  // Remove old caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        // look at all the cacheNames
        cacheNames.map(cache => {
          // if the current cache !== cacheName then delete it
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      )
    })
  );

});



// listen for fetch event (HTTP request)
self.addEventListener('fetch', (e) => {
  console.log('Service Worker: Fetching');

  // Offline backup
  // e.respondWith(
  //   // if the user is online, perform a regular HTTP request
  //   fetch(e.request)
  //   // if the HTTP request fails (offline) then serve the assets requested from the cache
  //   .catch(() => caches.match(e.request))
  // )

  // Offline first
  e.respondWith(
    // are the files requested in the cache already?
    caches.match(e.request).then(cachedResponse => {
      // if yes, then serve files from cache
      if (cachedResponse) {
        console.log('Found in cache!');
        return cachedResponse;
      }
      // else do an HTTP request to the server
      return fetch(e.request);
    })
  )
});