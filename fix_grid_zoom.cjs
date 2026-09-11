const fs = require('fs');
const path = require('path');
const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

// Change overflow-y-auto to overflow-hidden and adjust layout
grid = grid.replace(
  /<div className="flex-1 overflow-y-auto px-4 py-3 relative gap-2 pb-24 flex flex-col justify-start z-20 group\/grid">/g,
  '<div className="flex-1 overflow-hidden px-4 py-[1dvh] relative gap-[1dvh] pb-20 flex flex-col justify-evenly z-20 group/grid">'
);

// Allow sections to shrink
grid = grid.replace(/className="mb-2 w-full relative shrink-0"/g, 'className="w-full relative shrink min-h-0"');
grid = grid.replace(/className="mb-1 w-full relative shrink-0"/g, 'className="w-full relative shrink min-h-0"');

// Reduce hardcoded heights
grid = grid.replace(/h-12 sm:h-14/g, 'h-[8dvh] min-h-[40px] sm:h-12');
grid = grid.replace(/h-10 sm:h-12/g, 'h-[8dvh] min-h-[40px] sm:h-12');

// Shrink inner paddings using dvh
grid = grid.replace(/p-2.5/g, 'p-[1.5dvh]');
grid = grid.replace(/p-2/g, 'p-[1.2dvh]');
grid = grid.replace(/py-2 px-1/g, 'py-[1dvh] px-1');
grid = grid.replace(/py-2.5/g, 'py-[1.2dvh]');

// Make text slightly responsive
grid = grid.replace(/text-xs/g, 'text-[max(10px,min(1.5dvh,12px))]');
grid = grid.replace(/text-\[10px\]/g, 'text-[max(9px,min(1.2dvh,10px))]');
grid = grid.replace(/text-\[9px\]/g, 'text-[max(8px,min(1dvh,9px))]');

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('ActionGrid zoom fixed');
