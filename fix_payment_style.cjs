const fs = require('fs');
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// InstaPay button: add white bg + visible border + transparent hover
grid = grid.replace(
  'className="group/btn bg-transparent rounded-xl p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-violet-500 active:border-violet-500 transition-all h-[60px]"',
  'className="group/btn bg-white border-2 border-slate-100 rounded-xl p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-violet-500 active:border-violet-500 hover:bg-violet-500/10 active:bg-violet-500/10 hover:shadow-sm active:shadow-sm transition-all h-[60px]"'
);

// Vodafone Cash button: same
grid = grid.replace(
  'className="group/btn bg-transparent rounded-xl p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-red-500 active:border-red-500 transition-all h-[60px]"',
  'className="group/btn bg-white border-2 border-slate-100 rounded-xl p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-red-500 active:border-red-500 hover:bg-red-500/10 active:bg-red-500/10 hover:shadow-sm active:shadow-sm transition-all h-[60px]"'
);

// Vodafone wallet icon bg: remove the red-50 bg since parent now has red tint on hover
grid = grid.replace(
  'w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover/btn:scale-110 group-active/btn:scale-110 transition-all shrink-0',
  'w-9 h-9 rounded-full bg-red-50/60 flex items-center justify-center text-red-500 group-hover/btn:scale-110 group-active/btn:scale-110 transition-all shrink-0'
);

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('Payment buttons now match social style');
