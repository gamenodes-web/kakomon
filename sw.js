// 同梱ファイルを保存しておき、電波が無くても開けるようにする。
// CACHE の名前が変わると古い分は捨てられる（デプロイのたびに変わる）。
const CACHE = 'kakomon-20260913100721';
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
// 画面そのもの（index.html）は、つながるときは必ず新しい方を取りに行く。
// 保存した分しか見ない作りだと、更新しても古い画面のままになってしまうため。
// ライブラリなど中身が変わらないものは、保存した分をそのまま使う（表示が速い）。
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
