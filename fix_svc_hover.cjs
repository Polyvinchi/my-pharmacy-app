const fs = require('fs');
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// Replace the cell() helper function to use white bg + colored border on hover
const oldCell = "  const cell = (hoverColor: string) => \lex flex-col items-center justify-center bg-transparent rounded-xl p-1.5 group/btn transition-all h-[72px] cursor-pointer \\;";
const newCell = "  const cell = (border: string, ring: string) => \lex flex-col items-center justify-center bg-white border-2 \ rounded-xl p-1.5 group/btn transition-all h-[72px] cursor-pointer hover:shadow-md active:shadow-md \\;";

grid = grid.replace(oldCell, newCell);

// Now update each service button to pass border + ring colors
const services = [
  { old: cell('hover:bg-blue-500 active:bg-blue-500'), new: cell('border-slate-100 hover:border-blue-500 active:border-blue-500', 'hover:ring-2 hover:ring-blue-200 active:ring-2 active:ring-blue-200') },
  { old: cell('hover:bg-indigo-500 active:bg-indigo-500'), new: cell('border-slate-100 hover:border-indigo-500 active:border-indigo-500', 'hover:ring-2 hover:ring-indigo-200 active:ring-2 active:ring-indigo-200') },
  { old: cell('hover:bg-rose-500 active:bg-rose-500'), new: cell('border-slate-100 hover:border-rose-500 active:border-rose-500', 'hover:ring-2 hover:ring-rose-200 active:ring-2 active:ring-rose-200') },
  { old: cell('hover:bg-sky-500 active:bg-sky-500'), new: cell('border-slate-100 hover:border-sky-500 active:border-sky-500', 'hover:ring-2 hover:ring-sky-200 active:ring-2 active:ring-sky-200') },
  { old: cell('hover:bg-violet-500 active:bg-violet-500'), new: cell('border-slate-100 hover:border-violet-500 active:border-violet-500', 'hover:ring-2 hover:ring-violet-200 active:ring-2 active:ring-violet-200') },
  { old: cell('hover:bg-orange-500 active:bg-orange-500'), new: cell('border-slate-100 hover:border-orange-500 active:border-orange-500', 'hover:ring-2 hover:ring-orange-200 active:ring-2 active:ring-orange-200') },
  { old: cell('hover:bg-teal-500 active:bg-teal-500'), new: cell('border-slate-100 hover:border-teal-500 active:border-teal-500', 'hover:ring-2 hover:ring-teal-200 active:ring-2 active:ring-teal-200') },
];

services.forEach(({ old: o, new: n }) => { grid = grid.replace(o, n); });

// Fix talabat cell - also white bg + orange border on hover
grid = grid.replace(
  {cell('hover:bg-[#FF5A00] active:bg-[#FF5A00]')},
  {cell('border-slate-100 hover:border-[#FF5A00] active:border-[#FF5A00]', 'hover:ring-2 hover:ring-orange-200 active:ring-2 active:ring-orange-200')}
);

// Fix icon color: stays blue always, no need to turn white since bg stays white
grid = grid.replace(
  "  const svcIcon = 'text-blue-500 group-hover/btn:text-white group-active/btn:text-white group-hover/btn:scale-110 group-active/btn:scale-110 transition-all';",
  "  const svcIcon = 'text-blue-500 group-hover/btn:scale-110 group-active/btn:scale-110 transition-all';"
);
grid = grid.replace(
  "  const svcLabel = 'text-[9px] font-bold text-slate-500 group-hover/btn:text-white group-active/btn:text-white transition-colors whitespace-nowrap mt-0.5';",
  "  const svcLabel = 'text-[9px] font-bold text-slate-500 transition-colors whitespace-nowrap mt-0.5';"
);

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('Service cells: white bg + vivid border on hover');
