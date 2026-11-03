const V='skullking-v7',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./cards.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Netzwerk zuerst (damit Updates ankommen), sonst Zwischenspeicher
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
 if(u.hostname.includes('ntfy.sh'))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)))});

// Benachrichtigung antippen: App oeffnen/nach vorne holen und Einladung anzeigen
self.addEventListener('notificationclick',e=>{e.notification.close();const c=e.notification.data&&e.notification.data.c;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
  for(const w of list){if('focus' in w){w.postMessage({t:'inv',c});return w.focus()}}
  return self.clients.openWindow('./'+(c?'#'+c:''))}))});
