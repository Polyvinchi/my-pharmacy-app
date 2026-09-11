const fs = require('fs');
const path = require('path');
const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');

let grid = fs.readFileSync(gridPath, 'utf8');

// 1. Remove the Backdrop
grid = grid.replace(/\{\/\* Smooth Tour Isolation Backdrop \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/, '');

// 2. Revert the active classes (remove scale, remove z-40 overlap craziness)
// Find border-blue-400 z-40 bg-white shadow-2xl scale-[1.02]
grid = grid.replace(/'border-blue-400 z-40 bg-white shadow-2xl scale-\[1.02\]'/g, "'border-blue-400 bg-blue-50/20 shadow-md'");
grid = grid.replace(/'z-40 bg-white border-blue-400 shadow-2xl scale-\[1.02\]'/g, "'border-blue-400 bg-blue-50/20 shadow-md'");
grid = grid.replace(/'z-40 border-blue-400 bg-white shadow-2xl scale-\[1.02\]'/g, "'border-blue-400 bg-blue-50/20 shadow-md'");

// Fix the "???? ????? ?????? ?????" so it doesn't overlap elements above it
// Currently: <div className="absolute -top-6 left-1 text-[9px] ...">
// Change to: <div className="w-fit mb-2 text-[9px] ...">
grid = grid.replace(/<div className="absolute -top-6 left-1 text-\[9px\]/g, '<div className="w-fit mb-1.5 text-[9px]');

// Fix z-index of ActionGrid so Tooltips show OVER the FacadeBanner
grid = grid.replace(/<div className="flex-1 overflow-hidden px-4 py-\[1dvh\] relative gap-\[1dvh\] pb-20 flex flex-col justify-evenly z-20 group\/grid">/, '<div className="flex-1 overflow-hidden px-4 py-[1dvh] relative gap-[1dvh] pb-20 flex flex-col justify-evenly z-40 group/grid">');

// Fix Tooltips -top position so they don't go too far up
grid = grid.replace(/className="absolute -top-12 left-1\/2/g, 'className="absolute -top-8 left-1/2');

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('Fixed overlap and scaling');
