const fs = require('fs');
const path = require('path');

const clientAppPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ClientApp.tsx');
let clientApp = fs.readFileSync(clientAppPath, 'utf8');

clientApp = clientApp.replace(
  /className="absolute bottom-0 left-0 w-full px-4 pt-1\.5 pb-1 bg-white\/90 backdrop-blur-md border-t border-slate-100 z-50 shadow-\[0_-10px_40px_-15px_rgba\(0,0,0,0\.1\)\]"/g,
  'className="absolute bottom-0 left-0 w-full px-4 pt-1.5 pb-1.5 z-50 pointer-events-none"'
);

// We need to add pointer-events-auto to the button itself since the wrapper is pointer-events-none
clientApp = clientApp.replace(
  /className="w-full bg-gradient-to-r/g,
  'className="pointer-events-auto w-full bg-gradient-to-r'
);

fs.writeFileSync(clientAppPath, clientApp, 'utf8');
console.log('White background removed from bottom button');
