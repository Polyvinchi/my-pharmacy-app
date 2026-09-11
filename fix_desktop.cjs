const fs = require('fs');
const path = require('path');

// 1. Fix ClientApp.tsx container
const clientAppPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ClientApp.tsx');
let clientApp = fs.readFileSync(clientAppPath, 'utf8');

clientApp = clientApp.replace(
  /className="w-full max-w-md bg-white sm:rounded-\[2\.5rem\] sm:shadow-2xl overflow-hidden relative flex flex-col mx-auto h-\[100dvh\] sm:h-\[90vh\] sm:max-h-\[850px\] sm:border-8 sm:border-slate-800"/,
  'className="w-full bg-white relative flex flex-col mx-auto h-[100dvh] sm:w-[400px] sm:h-[820px] sm:shrink-0 sm:rounded-[2.5rem] sm:shadow-2xl sm:border-8 sm:border-slate-800 sm:overflow-hidden"'
);

// Make ActionGrid definitely scroll vertically
clientApp = clientApp.replace(/flex-1 overflow-hidden/g, 'flex-1 overflow-y-auto');

fs.writeFileSync(clientAppPath, clientApp, 'utf8');

// 2. Fix page.tsx main container
const pagePath = path.join('e:', 'a-a-pharmacy', 'src', 'app', 'page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

page = page.replace(
  /className="min-h-screen bg-slate-50 sm:py-8 sm:px-4 flex items-center justify-center"/,
  'className="min-h-screen bg-slate-50 sm:py-12 sm:px-4 flex flex-col items-center justify-start overflow-y-auto"'
);

fs.writeFileSync(pagePath, page, 'utf8');

console.log('Desktop fixed');
