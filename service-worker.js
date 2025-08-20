self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("pookie-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/script.js",
        "/manifest.json",
        "/songs/song1.mp3",
        "/covers/cover1.jpg"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    })
  );
});
