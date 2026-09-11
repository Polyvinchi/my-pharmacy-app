const fs = require('fs');
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// Services: size 24 -> 27, padding p-1.5 -> p-1
grid = grid.replace(/size=\{24\} strokeWidth=\{2\} className=\{svcIcon\}/g, 'size={27} strokeWidth={2} className={svcIcon}');
grid = grid.replace("const cell = () => 'flex flex-col items-center justify-center bg-transparent rounded-xl p-1.5 group/btn", "const cell = () => 'flex flex-col items-center justify-center bg-transparent rounded-xl p-1 group/btn");

// Talabat box inside: w-9 h-9 -> w-10 h-10
grid = grid.replace(/bg-\[#FF5A00\] text-white rounded-md w-9 h-9 flex items-center justify-center font-black text-\[9px\] italic/g, 'bg-[#FF5A00] text-white rounded-md w-10 h-10 flex items-center justify-center font-black text-[10px] italic');

// Payments: Wallet icon size 20 -> 24
grid = grid.replace('<Wallet size={20} />', '<Wallet size={24} />');
// Instapay logo: w-12 h-7 -> w-14 h-8
grid = grid.replace('shrink-0 w-12 h-7 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform', 'shrink-0 w-14 h-8 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform');
// Payment buttons padding: p-2.5 -> p-2
grid = grid.replace(/p-2\.5 flex flex-row-reverse items-center justify-between gap-1 hover:border-violet-500/g, 'p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-violet-500');
grid = grid.replace(/p-2\.5 flex flex-row-reverse items-center justify-between gap-1 hover:border-red-500/g, 'p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-red-500');

// Social: Phone size 20 -> 24
grid = grid.replace(/<Phone size=\{20\}/g, '<Phone size={24}');
// WhatsApp icon: w-5 h-5 -> w-6 h-6
grid = grid.replace('w-5 h-5 shrink-0 group-hover/subbtn:scale-110', 'w-6 h-6 shrink-0 group-hover/subbtn:scale-110');
// Social row icons: w-7 h-7 -> w-8 h-8
grid = grid.replace(/w-7 h-7 group-hover\/btn:scale-110 group-active\/btn:scale-110 transition-transform/g, 'w-8 h-8 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform');
// Map pin icon
grid = grid.replace('<svg viewBox="0 0 24 24" className="w-7 h-7">', '<svg viewBox="0 0 24 24" className="w-8 h-8">');
// Install logo: w-6 h-6 -> w-7 h-7
grid = grid.replace('w-6 h-6 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform"><img src="/logo.png"', 'w-7 h-7 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform"><img src="/logo.png"');
// Social row cell padding: p-1.5 -> p-1
grid = grid.replace(/flex flex-col items-center justify-center gap-1 bg-transparent rounded-xl p-1\.5/g, 'flex flex-col items-center justify-center gap-1 bg-transparent rounded-xl p-1');

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');
console.log('Icons enlarged 15-20%, padding reduced');
