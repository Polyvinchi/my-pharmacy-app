const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf-8');

code = code.replace(
  '        style={{ gridColumn: `span ${colSpan}` }}\n        className={`flex ${layout === \'row\' ? \'flex-row-reverse\' : \'flex-col\'} items-center justify-center rounded-xl group/btn hover:bg-slate-50 transition-all ${bgColor} border-2 border-slate-100 hover:border-slate-300`} style={{ minHeight: `calc(58px * var(--scale-sections))`, gap: `calc(0.25rem * var(--space-sections))`, padding: `calc(0.5rem * var(--space-sections))` }}',
  '        className={`flex ${layout === \'row\' ? \'flex-row-reverse\' : \'flex-col\'} items-center justify-center rounded-xl group/btn hover:bg-slate-50 transition-all ${bgColor} border-2 border-slate-100 hover:border-slate-300`}\n        style={{ gridColumn: `span ${colSpan}`, minHeight: `calc(58px * var(--scale-sections))`, gap: `calc(0.25rem * var(--space-sections))`, padding: `calc(0.5rem * var(--space-sections))` }}'
);

fs.writeFileSync('src/components/ActionGrid.tsx', code, 'utf-8');
console.log('Fixed ActionGrid');
