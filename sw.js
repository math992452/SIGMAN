const CACHE_NAME = "sigman-cache-v11";
const APP_SHELL = [
  "./",
  "./index.html",
  "./app.html",
  "./styles.css?v=11",
  "./app.js?v=11",
  "./landing.js?v=11",
  "./manifest.json?v=11",
  "./assets/icons/feature-protocol.svg",
  "./assets/icons/feature-wins.svg",
  "./assets/icons/feature-standard.svg",
  "./assets/icons/feature-reset.svg",
  "./assets/icons/action-body.svg",
  "./assets/icons/action-breath.svg",
  "./assets/icons/action-leave.svg",
  "./assets/icons/action-cold.svg",
  "./assets/icons/icon-dashboard.svg",
  "./assets/icons/icon-streak.svg",
  "./assets/icons/icon-reason.svg",
  "./assets/icons/nav-home.svg",
  "./assets/icons/nav-rescue.svg",
  "./assets/icons/nav-setup.svg",
  "./assets/brand/sigma-shield.svg",
  "./assets/brand/sigman-wordmark.svg",
  "./assets/ui/gold-divider.svg",
  "./assets/ui/premium-ring.svg",
  "./assets/ui/premium-panel-bg.svg",
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
