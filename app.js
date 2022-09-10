// Check the browser to make sure it supports service workers
if('serviceWorker' in navigator) {
    navigator.serviceWorker
      // Register the path to the service worker file
      .register('/sw.js')
      .then(function() { console.log("Service Worker Registered"); });
  }