var CACHE_NAME = 'my-test-cache-v1';
// 监听install 事件
this.addEventListener('install', function(event) {
  console.log('Service Worker install');
  // 跳过 waiting 状态，然后会直接进入 activate 阶段
  event.waitUntil(self.skipWaiting());
  /**
   *
   * 缓存指定静态资源
   */
  // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
  event.waitUntil(
    // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
    caches.open(CACHE_NAME).then(function(cache) {
      // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
      return cache.addAll([
        './',
        './index.html',
        './index.css',
        './manifest.json',
        './img/android-chrome-192x192.png',
        './img/android-chrome-512x512.png',
        './index.js'
      ]);
    })
  );
  /**
   *
   * 缓存指定动态资源
   */
  this.addEventListener('fetch', function(event) {
    if (event.request.url.indexOf('chrome-extension:') > -1) {
      return false;
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        // 来来来，代理可以搞一些代理的事情
        // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
        if (response) {
          return response;
        }
        // 如果 service worker 没有返回，那就得直接请求真实远程服务
        var request = event.request.clone(); // 把原始请求拷过来

        return fetch(request).then(function(httpRes) {
          // http请求的返回已被抓到，可以处置了。
          // 请求失败了，直接返回失败的结果就好了。。
          if (!httpRes || httpRes.status !== 200) {
            return httpRes;
          }
          // 请求成功的话，将请求缓存起来。
          var responseClone = httpRes.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
          return httpRes;
        });
      })
    );
  });
});
// 后台同步事件
this.addEventListener('sync', function(e) {
  console.log(`service worker需要进行后台同步，tag: ${e.tag}`);
  var init = {
    method: 'GET'
  };
  if (e.tag === 'sample_sync') {
    var request = new Request(`https://registry.npm.taobao.org/`, init);
    e.waitUntil(
      fetch(request).then(function(response) {
        console.log('后台同步response:', response);
        // response.json().then(console.log.bind(console));
        return response;
      })
    );
  }
});
// 监听激活后事件
this.addEventListener('activate', function(event) {
  console.log('Service Worker activate');
  event.waitUntil(
    Promise.all([
      // 更新客户端
      self.clients.claim(),
      // 清理旧版本
      caches.keys().then(function(cacheList) {
        return Promise.all(
          cacheList.map(function(cacheName) {
            console.log(cacheName);
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
// 监听postMessage事件
this.addEventListener('message', function(event) {
  self.clients.get(event.source.id).then(function(client) {
    client.postMessage(`Messaging using clients.get(${event.source.id})`);
  });
  console.log('触发message事件');
  console.log('收到的message:', JSON.parse(event.data));
});
