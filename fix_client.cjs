const fs = require('fs');
const path = require('path');
const clientAppPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ClientApp.tsx');
let clientApp = fs.readFileSync(clientAppPath, 'utf8');

// Shrink the bottom button wrapper and button padding
// Original wrapper: <div className="absolute bottom-0 left-0 w-full px-4 pt-3 pb-1 bg-white border-t border-slate-100 z-30 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
clientApp = clientApp.replace(
  /<div className="absolute bottom-0 left-0 w-full px-4 pt-3 pb-1 bg-white border-t border-slate-100 z-30 shadow-\[0_-10px_40px_-15px_rgba\(0,0,0,0\.1\)\]">/g,
  '<div className="absolute bottom-0 left-0 w-full px-6 pt-3 pb-3 bg-white/90 backdrop-blur-md border-t border-slate-100 z-30 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">'
);

// Original button: className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-amber-600 flex items-center justify-center gap-2 mb-2"
clientApp = clientApp.replace(
  /className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-amber-600 flex items-center justify-center gap-2 mb-2"/g,
  'className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-black py-3 rounded-2xl shadow-md border-b-4 border-amber-600 flex items-center justify-center gap-2 mb-2"'
);

fs.writeFileSync(clientAppPath, clientApp, 'utf8');
console.log('ClientApp fixed');
