const fs = require('fs');
const path = require('path');
const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');

let grid = fs.readFileSync(gridPath, 'utf8');

// Revert dvh to normal Tailwind classes
grid = grid.replace(/p-\[1\.5dvh\]/g, 'p-2.5');
grid = grid.replace(/p-\[1\.2dvh\]/g, 'p-2');
grid = grid.replace(/py-\[1dvh\]/g, 'py-2');
grid = grid.replace(/py-\[1\.2dvh\]/g, 'py-2.5');
grid = grid.replace(/gap-\[1dvh\]/g, 'gap-2');
grid = grid.replace(/mb-\[1dvh\]/g, 'mb-2');
grid = grid.replace(/mb-1\.5/g, 'mb-2');

// Revert text size hacks
grid = grid.replace(/text-\[max\(10px,min\(1\.5dvh,12px\)\)\]/g, 'text-xs');
grid = grid.replace(/text-\[max\(9px,min\(1\.2dvh,10px\)\)\]/g, 'text-[10px]');
grid = grid.replace(/text-\[max\(8px,min\(1dvh,9px\)\)\]/g, 'text-[9px]');

// Revert heights
grid = grid.replace(/h-\[8dvh\] min-h-\[40px\] sm:h-12/g, 'h-12 sm:h-14');

// Revert shrinking
grid = grid.replace(/className="w-full relative shrink min-h-0"/g, 'className="mb-2 w-full relative shrink-0"');

// Revert overflow and layout container
grid = grid.replace(
  /<div className="flex-1 overflow-hidden px-4 py-\[1dvh\] relative gap-\[1dvh\] pb-20 flex flex-col justify-evenly z-40 group\/grid">/,
  '<div className="flex-1 overflow-y-auto px-4 py-3 relative gap-2 pb-24 flex flex-col justify-start z-40 group/grid">'
);

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('ActionGrid scroll restored');
