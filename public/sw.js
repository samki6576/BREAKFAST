const CACHE_NAME = "breakfast-cache-v1"
const ASSETS = [
  "/",
  "/er.png",
  "/background.mp3",
  "/click.mp3"
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  )
})


