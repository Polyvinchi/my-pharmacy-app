const fs = require('fs');

// Fix 1: Offers button - add rounded corners and remove white bg bar
let app = fs.readFileSync('src/components/ClientApp.tsx', 'utf8');

// Remove white background wrapper from bottom bar
app = app.replace(
  'className="absolute bottom-0 left-0 w-full px-4 pt-2 pb-1 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]"',
  'className="absolute bottom-0 left-0 w-full px-3 pt-1 pb-2 z-50"'
);

// Add larger rounded corners to the offers button
app = app.replace(
  'className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all flex items-center justify-center relative overflow-hidden"',
  'className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl font-bold shadow-xl shadow-yellow-500/40 hover:shadow-yellow-500/60 transition-all flex items-center justify-center relative overflow-hidden"'
);

fs.writeFileSync('src/components/ClientApp.tsx', app, 'utf8');
console.log('Offers button fixed');
