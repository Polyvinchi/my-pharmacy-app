const fs = require('fs');

// 1. FacadeBanner.tsx
let facadeCode = fs.readFileSync('src/components/FacadeBanner.tsx', 'utf-8');

// Logo scaling
facadeCode = facadeCode.replace(
  'className={`w-28 h-28 bg-transparent ${settings?.theme_config?.logo_shape || "rounded-full"} mb-3 flex items-center justify-center overflow-hidden border border-white/30`}>',
  'className={`bg-transparent ${settings?.theme_config?.logo_shape || "rounded-full"} flex items-center justify-center overflow-hidden border border-white/30`}\n            style={{ width: `calc(7rem * var(--scale-logo))`, height: `calc(7rem * var(--scale-logo))`, marginBottom: `calc(0.75rem * var(--space-logo))` }}>'
);
fs.writeFileSync('src/components/FacadeBanner.tsx', facadeCode, 'utf-8');

// 2. ActionGrid.tsx
let actionCode = fs.readFileSync('src/components/ActionGrid.tsx', 'utf-8');

// Services cell scale
actionCode = actionCode.replace(
  "const cell = () => 'flex flex-col items-center justify-center bg-transparent rounded-xl p-1 group/btn transition-all h-[72px] cursor-pointer hover:bg-blue-500/15 active:bg-blue-500/15 hover:border-2 hover:border-blue-500 active:border-2 active:border-blue-500 border-2 border-transparent';",
  "const cell = () => 'flex flex-col items-center justify-center bg-transparent rounded-xl group/btn transition-all cursor-pointer hover:bg-blue-500/15 active:bg-blue-500/15 hover:border-2 hover:border-blue-500 active:border-2 active:border-blue-500 border-2 border-transparent';"
);

// Services Icons scale
actionCode = actionCode.replace(
  "const svcIcon = 'text-blue-500 group-hover/btn:scale-110 group-active/btn:scale-110 transition-all';",
  "const svcIcon = 'text-blue-500 group-hover/btn:scale-110 group-active/btn:scale-110 transition-all';"
);
actionCode = actionCode.replace(
  "const svcLabel = 'text-[9px] font-bold text-slate-500 whitespace-nowrap mt-0.5';",
  "const svcLabel = 'text-[9px] font-bold text-slate-500 whitespace-nowrap mt-0.5';"
);

// Services Box
actionCode = actionCode.replace(
  '<div className={`w-full bg-white rounded-xl border-2 ${activeTourStep === \'services\' ? \'border-blue-300 shadow-lg\' : \'border-slate-100 shadow-sm\'} p-2 transition-all duration-300`}>',
  '<div className={`w-full bg-white rounded-xl border-2 ${activeTourStep === \'services\' ? \'border-blue-300 shadow-lg\' : \'border-slate-100 shadow-sm\'} transition-all duration-300`} style={{ padding: `calc(0.5rem * var(--space-sections))` }}>'
);

actionCode = actionCode.replace(
  '<div className="grid grid-cols-4 gap-1.5">',
  '<div className="grid grid-cols-4" style={{ gap: `calc(0.375rem * var(--space-sections))` }}>'
);

// Inside services loop
actionCode = actionCode.replace(
  '<button key={svc.id} onTouchStart={() => {}} className={cell()}>',
  '<button key={svc.id} onTouchStart={() => {}} className={cell()} style={{ height: `calc(72px * var(--scale-sections))`, padding: `calc(0.25rem * var(--space-sections))` }}>'
);
actionCode = actionCode.replace(
  '<IconComp size={27} strokeWidth={2} className={svcIcon} />',
  '<IconComp size={27} strokeWidth={2} className={svcIcon} style={{ transform: `scale(var(--scale-icons))` }} />'
);

// Generic Items scale
actionCode = actionCode.replace(
  'className={`flex ${layout === \'row\' ? \'flex-row-reverse gap-1.5\' : \'flex-col gap-1\'} items-center justify-center rounded-xl p-2 group/btn hover:bg-slate-50 transition-all ${bgColor} border-2 border-slate-100 hover:border-slate-300 min-h-[58px]`}',
  'className={`flex ${layout === \'row\' ? \'flex-row-reverse\' : \'flex-col\'} items-center justify-center rounded-xl group/btn hover:bg-slate-50 transition-all ${bgColor} border-2 border-slate-100 hover:border-slate-300`} style={{ minHeight: `calc(58px * var(--scale-sections))`, gap: `calc(0.25rem * var(--space-sections))`, padding: `calc(0.5rem * var(--space-sections))` }}'
);
actionCode = actionCode.replace(
  '<IconComp size={24} className={`${textColor} group-hover/btn:scale-110 transition-transform`} />',
  '<IconComp size={24} className={`${textColor} group-hover/btn:scale-110 transition-transform`} style={{ transform: `scale(var(--scale-icons))` }} />'
);
actionCode = actionCode.replace(
  '<IconComp size={24} className={`${textColor} group-hover/btn:scale-110 transition-transform`} />',
  '<IconComp size={24} className={`${textColor} group-hover/btn:scale-110 transition-transform`} style={{ transform: `scale(var(--scale-icons))` }} />'
);

fs.writeFileSync('src/components/ActionGrid.tsx', actionCode, 'utf-8');
console.log('ActionGrid.tsx updated');
