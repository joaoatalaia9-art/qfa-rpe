var CACHE = 'qfa-v90';
var URLS  = ['/', '/index.html'];
self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(URLS);}));
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(cached){
    if(cached)return cached;
    return fetch(e.request).then(function(r){
      if(r&&r.status===200){var cl=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cl);});}
      return r;
    }).catch(function(){return caches.match('/index.html');});
  }));
});
