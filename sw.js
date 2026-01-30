const CACHE_NAME = 'survival-timer-v1';
// 使用相对路径，以兼容 GitHub Pages 的子目录
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

// 安装阶段：强制缓存所有资源
self.addEventListener('install', (e) => {
  self.skipWaiting(); // 强制跳过等待，立即激活新版本
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets...');
      return cache.addAll(ASSETS);
    })
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// 策略：优先从缓存读取，如果离线则秒开
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // 如果缓存中有，直接返回；否则发起联网请求
      return response || fetch(e.request).catch(() => {
        // 如果联网请求也失败（真离线），尝试返回缓存的 index.html
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
