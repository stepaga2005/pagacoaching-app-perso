const CACHE_NAME = 'pagacoaching-v1'
const STATIC_CACHE = 'pagacoaching-static-v1'
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 jours

// App shell assets to pre-cache on install
const PRECACHE_URLS = [
  '/joueur',
  '/login',
  '/offline',
]

// Returns true if the cached Response is older than MAX_CACHE_AGE_MS
function isCacheStale(response) {
  if (!response) return true
  const dateHeader = response.headers.get('date')
  if (!dateHeader) return false // no date → assume fresh (static assets)
  return (Date.now() - new Date(dateHeader).getTime()) > MAX_CACHE_AGE_MS
}

// ─── Install: pre-cache app shell ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

// ─── Activate: clean old caches + purge stale entries ────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
            .map(k => caches.delete(k))
        )
      )
      .then(() => caches.open(CACHE_NAME))
      .then(cache =>
        cache.keys().then(requests =>
          Promise.all(
            requests.map(req =>
              cache.match(req).then(res => {
                if (isCacheStale(res)) return cache.delete(req)
              })
            )
          )
        )
      )
      .then(() => self.clients.claim())
  )
})

// ─── Fetch: caching strategies ───────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin API calls (Supabase)
  if (request.method !== 'GET') return
  if (url.hostname.includes('supabase') || url.hostname.includes('supabase.co')) return

  // Cache-first for Next.js static assets (_next/static)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone())
            return res
          })
        })
      )
    )
    return
  }

  // Cache-first for images and icons (stale → revalidate)
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/) ||
    url.pathname.startsWith('/_next/image')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          if (cached && !isCacheStale(cached)) return cached
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone())
            return res
          }).catch(() => cached || new Response('', { status: 408 }))
        })
      )
    )
    return
  }

  // Network-first with cache fallback for navigation (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return res
        })
        .catch(() =>
          caches.match(request).then(cached =>
            cached || caches.match('/joueur') || new Response('<h1>Hors ligne</h1>', {
              headers: { 'Content-Type': 'text/html' }
            })
          )
        )
    )
    return
  }

  // Network-first for everything else (API routes, etc.)
  event.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return res
      })
      .catch(() =>
        caches.match(request).then(cached =>
          cached || new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      )
  )
})

// ─── Push notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'PAGACOACHING', {
      body: data.body || 'Nouveau message',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'message',
      renotify: true,
      data: { url: data.url || '/' }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/').catch(() => {})
  )
})
