const fs = require('fs');

// Update page.tsx to pass sizes
let pageCode = fs.readFileSync('src/app/page.tsx', 'utf-8');
pageCode = pageCode.replace(
  "splash_bg_image: pharmacy?.theme_config?.splash_bg_image || null,",
  "splash_bg_image: pharmacy?.theme_config?.splash_bg_image || null,\n      sizes: pharmacy?.theme_config?.sizes || { logo: 100, sections: 100, icons: 100, buttons: 100 },"
);
fs.writeFileSync('src/app/page.tsx', pageCode, 'utf-8');
console.log('page.tsx updated');

// Update ClientApp.tsx
let clientCode = fs.readFileSync('src/components/ClientApp.tsx', 'utf-8');
// Inject CSS variables
const sizesCalc = `
  const sizes = initialData?.settings?.sizes || { logo: 100, sections: 100, icons: 100, buttons: 100 };
  
  // Element scale = 70% of variation, Spacing scale = 30% of variation
  const getScale = (percent) => 1 + ((percent - 100) / 100) * 0.7;
  const getSpacing = (percent) => 1 + ((percent - 100) / 100) * 0.3;

  const dynamicStyles = {
    '--scale-logo': getScale(sizes.logo),
    '--space-logo': getSpacing(sizes.logo),
    '--scale-sections': getScale(sizes.sections),
    '--space-sections': getSpacing(sizes.sections),
    '--scale-icons': getScale(sizes.icons),
    '--space-icons': getSpacing(sizes.icons),
    '--scale-buttons': getScale(sizes.buttons),
    '--space-buttons': getSpacing(sizes.buttons),
  } as React.CSSProperties;
`;

clientCode = clientCode.replace(
  "  const [isMapOpen, setIsMapOpen] = useState(false);",
  "  const [isMapOpen, setIsMapOpen] = useState(false);\n" + sizesCalc
);

clientCode = clientCode.replace(
  '<div className="min-h-screen bg-transparent flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 relative">',
  '<div style={dynamicStyles} className="min-h-screen bg-transparent flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 relative">'
);

// Update Fixed Bottom Button with scale
clientCode = clientCode.replace(
  '<div className="absolute bottom-0 left-0 w-full px-3 pt-1 pb-2 z-50">',
  '<div className="absolute bottom-0 left-0 w-full px-3 pt-1 pb-2 z-50" style={{ transform: `scale(var(--scale-buttons))`, transformOrigin: "bottom center", paddingBottom: `calc(0.5rem * var(--space-buttons))` }}>'
);

fs.writeFileSync('src/components/ClientApp.tsx', clientCode, 'utf-8');
console.log('ClientApp.tsx updated');
