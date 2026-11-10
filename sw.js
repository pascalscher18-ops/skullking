const V='skullking-v40',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./cards.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Netzwerk zuerst (damit Updates ankommen), sonst Zwischenspeicher
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
 if(u.hostname.includes('ntfy.sh')||u.pathname.endsWith('.mp3'))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)))});

// Benachrichtigung antippen: App oeffnen/nach vorne holen und Einladung anzeigen
self.addEventListener('notificationclick',e=>{e.notification.close();const c=e.notification.data&&e.notification.data.c;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
  for(const w of list){if('focus' in w){w.postMessage({t:'inv',c});return w.focus()}}
  return self.clients.openWindow('./'+(c?'#'+c:''))}))});

// Push vom Server empfangen und anzeigen (auch bei geschlossener App)
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}
 e.waitUntil(self.registration.showNotification(d.title||'Skull King ⚓',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||'sk',renotify:true,vibrate:[120,60,120],data:{c:d.c||''}}))});
