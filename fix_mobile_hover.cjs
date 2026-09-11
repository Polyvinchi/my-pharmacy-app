const fs = require('fs');
const path = require('path');
const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

// 1. Fix inner icons hover/active
grid = grid.replace(/hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700'/g, "hoverBg: 'hover:bg-blue-50 active:bg-blue-50', hoverText: 'hover:text-blue-700 active:text-blue-700'");
grid = grid.replace(/hoverBg: 'hover:bg-orange-50', hoverText: 'hover:text-orange-600'/g, "hoverBg: 'hover:bg-orange-50 active:bg-orange-50', hoverText: 'hover:text-orange-600 active:text-orange-600'");

// 2. Fix group shadows and borders
// Payments group
grid = grid.replace(/hover:bg-purple-50 hover:border-purple-200/g, 'hover:bg-purple-50 hover:border-purple-200 active:bg-purple-50 active:border-purple-200');
grid = grid.replace(/group-hover\/btn:text-purple-800/g, 'group-hover/btn:text-purple-800 group-active/btn:text-purple-800');

grid = grid.replace(/hover:bg-red-50 hover:border-red-200/g, 'hover:bg-red-50 hover:border-red-200 active:bg-red-50 active:border-red-200');
grid = grid.replace(/group-hover\/btn:text-red-700/g, 'group-hover/btn:text-red-700 group-active/btn:text-red-700');

// Socials group
grid = grid.replace(/hover:bg-blue-100 hover:border-blue-300/g, 'hover:bg-blue-100 hover:border-blue-300 active:bg-blue-100 active:border-blue-300');
grid = grid.replace(/group-hover\/subbtn:scale-105/g, 'group-hover/subbtn:scale-105 group-active/subbtn:scale-105');

grid = grid.replace(/hover:bg-green-100 hover:border-green-300/g, 'hover:bg-green-100 hover:border-green-300 active:bg-green-100 active:border-green-300');
grid = grid.replace(/hover:bg-slate-100 hover:border-slate-300/g, 'hover:bg-slate-100 hover:border-slate-300 active:bg-slate-100 active:border-slate-300');

grid = grid.replace(/hover:bg-blue-50 hover:border-blue-300/g, 'hover:bg-blue-50 hover:border-blue-300 active:bg-blue-50 active:border-blue-300');
grid = grid.replace(/group-hover\/btn:text-blue-600/g, 'group-hover/btn:text-blue-600 group-active/btn:text-blue-600');

grid = grid.replace(/hover:bg-pink-50 hover:border-pink-300/g, 'hover:bg-pink-50 hover:border-pink-300 active:bg-pink-50 active:border-pink-300');
grid = grid.replace(/group-hover\/btn:text-pink-600/g, 'group-hover/btn:text-pink-600 group-active/btn:text-pink-600');

grid = grid.replace(/hover:bg-red-50 hover:border-red-300/g, 'hover:bg-red-50 hover:border-red-300 active:bg-red-50 active:border-red-300');
grid = grid.replace(/group-hover\/btn:text-red-600/g, 'group-hover/btn:text-red-600 group-active/btn:text-red-600');

grid = grid.replace(/hover:bg-amber-50 hover:border-amber-300/g, 'hover:bg-amber-50 hover:border-amber-300 active:bg-amber-50 active:border-amber-300');
grid = grid.replace(/group-hover\/btn:text-amber-600/g, 'group-hover/btn:text-amber-600 group-active/btn:text-amber-600');

// Overall group hover shadow and z-index (group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50)
// To make it work on phone, we will just use standard active scaling for buttons, because group-hovering whole sections is weird on touch screens.
// We added hover:shadow-2xl to active sections earlier, let's make sure normal sections get a shadow on active
grid = grid.replace(/border-slate-100 shadow-sm/g, 'border-slate-100 shadow-sm hover:shadow-md active:shadow-md');
grid = grid.replace(/border-slate-100 bg-white/g, 'border-slate-100 bg-white shadow-sm hover:shadow-md active:shadow-md');

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('Mobile hover/active fixed');
