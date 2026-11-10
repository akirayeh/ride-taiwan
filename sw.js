// 一路騎台灣：離線快取。一律先抓網路上的最新版（遊戲檔案彼此要版本一致），
// 抓不到（沒網路）時才用上次存下來的檔案，所以加到主畫面後沒訊號也能玩。
const CACHE = 'ride-taiwan';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
	const req = e.request;
	if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin || req.headers.has('range')) return;
	e.respondWith(fetch(req).then((res) => {
		if (res.ok && res.status === 200) {
			const copy = res.clone();
			e.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)));
		}
		return res;
	}).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || Response.error())));
});
