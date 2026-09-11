const fs = require('fs');
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// Talabat: full orange bg on hover instead of transparent
grid = grid.replace(
  'className="flex flex-col items-center justify-center bg-transparent rounded-xl p-1 group/btn transition-all h-[72px] cursor-pointer hover:bg-[#FF5A00]/15 active:bg-[#FF5A00]/15 border-2 border-transparent hover:border-[#FF5A00] active:border-[#FF5A00]"',
  'className="flex flex-col items-center justify-center bg-transparent rounded-xl p-1 group/btn transition-all h-[72px] cursor-pointer hover:bg-[#FF5A00] active:bg-[#FF5A00] border-2 border-transparent hover:border-[#FF5A00] active:border-[#FF5A00]"'
);

// Also make talabat label white on hover
grid = grid.replace(
  '<span className={svcLabel}>\u0637\u0644\u0628\u0627\u062a</span>',
  '<span className="text-[9px] font-bold text-slate-500 whitespace-nowrap mt-0.5 group-hover/btn:text-white group-active/btn:text-white transition-colors">\u0637\u0644\u0628\u0627\u062a</span>'
);

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('Talabat: full orange bg on hover');
