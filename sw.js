const CACHE_NAME = "lista-compras-cache-v2"; // atualize a versão aqui se quiser forçar o update
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Instala e adiciona ao cache
self.addEventListener("install", (event) => {
  self.skipWaiting(); // força instalação imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativa o novo service worker e limpa caches antigos
self.addEventListener("activate", (event) => {
  clients.claim(); // ativa imediatamente
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});