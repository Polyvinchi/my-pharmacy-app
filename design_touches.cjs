const fs = require('fs');

// -- Design touches --
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// 1. Add subtle gradient shimmer to the white outer boxes
grid = grid.replace(
  'w-full bg-white rounded-xl border-2  p-2 transition-all duration-300',
  'w-full bg-gradient-to-b from-white to-slate-50/50 rounded-xl border-2  p-2 transition-all duration-300'
);
grid = grid.replace(
  'w-full bg-white rounded-xl border-2  p-2 pt-4 transition-all duration-300',
  'w-full bg-gradient-to-b from-white to-slate-50/50 rounded-xl border-2  p-2 pt-4 transition-all duration-300'
);
grid = grid.replace(
  'w-full bg-white rounded-xl border-2  p-2 pt-3 transition-all duration-300',
  'w-full bg-gradient-to-b from-white to-slate-50/50 rounded-xl border-2  p-2 pt-3 transition-all duration-300'
);

// 2. Make install button show canInstall indicator (green dot when ready to install)
// This is already done via the red animate-pulse dot

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('Design touches applied');
