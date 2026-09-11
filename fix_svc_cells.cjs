const fs = require('fs');
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// Remove white bg and border from service cells only
// Old class pattern for service buttons
grid = grid.replace(/flex flex-col items-center justify-center bg-white border-2 border-slate-100 rounded-xl p-1\.5 group\/btn transition-all h-\[72px\] hover:border-blue-500 active:border-blue-500 hover:bg-blue-50 active:bg-blue-50 hover:shadow-md active:shadow-md/g, 
  'flex flex-col items-center justify-center bg-transparent rounded-xl p-1.5 group/btn transition-all h-[72px] hover:bg-blue-500 active:bg-blue-500');

// Fix talabat cell too
grid = grid.replace('flex flex-col items-center justify-center bg-white border-2 border-slate-100 rounded-xl p-1.5 group/btn hover:border-[#FF5A00] active:border-[#FF5A00] hover:bg-[#FFF4EE] active:bg-[#FFF4EE] hover:shadow-md active:shadow-md',
  'flex flex-col items-center justify-center bg-transparent rounded-xl p-1.5 group/btn transition-all h-[72px] hover:bg-[#FF5A00] active:bg-[#FF5A00]');

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('Services cells borders removed');
