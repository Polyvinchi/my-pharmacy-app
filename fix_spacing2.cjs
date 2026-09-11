const fs = require('fs');
const path = require('path');

const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

// 1. Center the text in the Payments box and reduce mb
grid = grid.replace(
  /<div className="flex justify-end items-center mb-3 px-1">\s*<h3 className="text-\[11px\] font-bold text-slate-500">\\u0627\\u0644\\u062F\\u0641\\u0639/g,
  '<div className="flex justify-center items-center mb-1.5 px-1">\n              <h3 className="text-[11px] font-bold text-slate-500">\\u0627\\u0644\\u062F\\u0641\\u0639'
);

// Do the same for services title
grid = grid.replace(
  /justify-end dir-rtl w-full gap-1/g,
  'justify-center dir-rtl w-full gap-1'
);
grid = grid.replace(/mb-2 w-full text-right px-1/g, 'mb-1.5 w-full text-center px-1');

// Reduce general paddings
// gap-2.5 -> gap-2 for the main container
grid = grid.replace(/gap-2\.5 pb-24/g, 'gap-2 pb-24');

// reduce button heights slightly if possible, h-16 sm:h-18 -> h-14 sm:h-16
grid = grid.replace(/h-16 sm:h-18/g, 'h-14 sm:h-16');

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('Spacing reduced and titles centered');
