const CACHE_NAME = "sigman-cache-v10";
const APP_SHELL = [
  "./",
  "./index.html",
  "./app.html",
  "./styles.css?v=10",
  "./app.js?v=10",
  "./landing.js?v=10",
  "./manifest.json?v=10",
  "./assets/brand/sigma-shield.svg",
  "./assets/brand/sigman-wordmark.svg",
  "./assets/ui/gold-divider.svg",
  "./assets/ui/premium-ring.svg",
  "./assets/ui/premium-panel-bg.svg",
  "./assets/action-body.svg",
  "./assets/action-breath.svg",
  "./assets/action-leave.svg",
  "./assets/action-cold.svg",
  "./assets/action-write.svg",
  "./assets/action-shield.svg",
  "./assets/splash-wallpaper.png",
  "./assets/splash-mountain.png",
  "./assets/icon-180.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
