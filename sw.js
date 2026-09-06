// 同梱ファイルを保存しておき、電波が無くても開けるようにする。
// CACHE の名前が変わると古い分は捨てられる（デプロイのたびに変わる）。
const CACHE = 'kakomon-20260906111958';
const ASSETS = ['./', './index.html', './react.js', './react-dom.js', './jszip.js', './tw.css', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
