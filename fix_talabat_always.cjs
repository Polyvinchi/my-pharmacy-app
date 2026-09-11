const fs = require('fs');
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// Talabat inner box: always orange bg, white text - remove the group-hover change
grid = grid.replace(
  'bg-[#FF5A00] text-white rounded-md w-10 h-10 flex items-center justify-center font-black text-[10px] italic group-hover/btn:bg-white group-active/btn:bg-white group-hover/btn:text-[#FF5A00] group-active/btn:text-[#FF5A00] transition-all',
  'bg-[#FF5A00] text-white rounded-md w-10 h-10 flex items-center justify-center font-black text-[10px] italic'
);

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('Talabat logo always orange');
