const fs = require('fs');
const path = require('path');
const clientAppPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ClientApp.tsx');
let clientApp = fs.readFileSync(clientAppPath, 'utf8');

// Elevate bottom button to z-50 so ActionGrid (z-40) doesn't cover it
clientApp = clientApp.replace(
  /className="absolute bottom-0 left-0 w-full px-4 pt-2 pb-1 bg-white\/90 backdrop-blur-md border-t border-slate-100 z-30 shadow-\[0_-10px_40px_-15px_rgba\(0,0,0,0\.1\)\]"/g,
  'className="absolute bottom-0 left-0 w-full px-4 pt-2 pb-1 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]"'
);

fs.writeFileSync(clientAppPath, clientApp, 'utf8');
console.log('ClientApp z-index fixed');
