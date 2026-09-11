const fs = require('fs');
const path = require('path');
const clientAppPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ClientApp.tsx');
let clientApp = fs.readFileSync(clientAppPath, 'utf8');

// Fix wrapper padding (remove huge whitespace)
clientApp = clientApp.replace(
  /<div className="absolute bottom-0 left-0 w-full px-6 pt-3 pb-3 bg-white\/90 backdrop-blur-md border-t border-slate-100 z-30 shadow-\[0_-10px_40px_-15px_rgba\(0,0,0,0\.1\)\]">/g,
  '<div className="absolute bottom-0 left-0 w-full px-4 pt-2 pb-1 bg-white/90 backdrop-blur-md border-t border-slate-100 z-30 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">'
);

// Fix button padding (shrink height) and margin
clientApp = clientApp.replace(
  /className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-black py-3 rounded-2xl shadow-md border-b-4 border-amber-600 flex items-center justify-center gap-2 mb-2"/g,
  'className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-black py-2.5 rounded-xl shadow-md border-b-4 border-amber-600 flex items-center justify-center gap-2 mb-1"'
);

// Fix developer text margin
clientApp = clientApp.replace(
  /<div className="text-center pb-1">/g,
  '<div className="text-center pb-0">'
);
clientApp = clientApp.replace(
  /text-\[10px\]/g,
  'text-[9px]'
);

fs.writeFileSync(clientAppPath, clientApp, 'utf8');
console.log('ClientApp whitespace fixed');
