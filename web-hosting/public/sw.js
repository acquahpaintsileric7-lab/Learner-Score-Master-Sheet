// Minimal service worker so phones offer "Install app". It does not cache anything,
// so the app is always the latest version and needs internet (it syncs with Firebase).
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",()=>{});
