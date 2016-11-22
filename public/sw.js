const CACHE_NAME = "my-cache_v1";
var CACHES_FILES_URLS = [
    "/",
    "/src/person.js",
    "/src/app.js"
];
self.addEventListener("install", function(e){
    console.info("service worker is ready");
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(CACHES_FILES_URLS);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request)
        .then(response => {
            if(response){
                return response;
            }else{
                return fetch(e.request)
                .then(response => {
                    if(!response || response.status!=200){
                        return response;
                    }else{
                        var _response = response.clone();
                        caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(e.request, _response);
                        });

                        return response;
                    }
                });
            }
        })
    );
});