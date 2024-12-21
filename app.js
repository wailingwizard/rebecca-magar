// Check if the browser supports service workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      // Register the path to the service worker file
      .register('/sw.js')
      .then((registration) => {
        console.log("Service Worker Registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker Registration failed:", error);
      });
  });
} else {
  console.warn("Service Workers are not supported in this browser.");
}