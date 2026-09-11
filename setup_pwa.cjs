const fs = require('fs');

// -- 1. Service Worker --
const sw = 
const CACHE = 'pharmacy-v1';
const OFFLINE = ['/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(OFFLINE)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('/')))
  );
});
;
fs.writeFileSync('public/sw.js', sw.trim(), 'utf8');
console.log('sw.js created');

// -- 2. Register SW in layout.tsx --
let layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

// Remove old Script tag approach (caused issues)
layout = layout.replace(/import Script from 'next\/script';\n/, '');
layout = layout.replace(/<Script id="pwa-install"[\s\S]*?<\/Script>\n\s*/g, '');

// Add SW registration script if not there
if (!layout.includes('serviceWorker')) {
  layout = layout.replace(
    "import type { Metadata } from \"next\";",
    "import type { Metadata } from \"next\";"
  );
  
  // Add viewport and apple meta to metadata
  layout = layout.replace(
    "export const viewport = {",
    "export const viewport = {"
  );
  
  // Add inline SW registration before </body>
  layout = layout.replace(
    '{children}',
    {children}
        <script dangerouslySetInnerHTML={{ __html: \
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
          window.__pwaPrompt = null;
          window.__pwaPromptListeners = [];
          window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            window.__pwaPrompt = e;
            (window.__pwaPromptListeners || []).forEach(function(fn) { fn(e); });
          });
        \}} />
  );
}

fs.writeFileSync('src/app/layout.tsx', layout, 'utf8');
console.log('layout.tsx updated');
