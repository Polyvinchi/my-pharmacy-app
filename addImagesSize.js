const fs = require('fs');

// 1. ThemeManager.tsx
let themeCode = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');
themeCode = themeCode.replace(
  'const defaultSizes = { logo: 100, sections: 100, icons: 100, buttons: 100 };',
  'const defaultSizes = { logo: 100, sections: 100, icons: 100, buttons: 100, images: 100 };'
);
const imageSlider = `
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">حجم الصور (كالعروض)</label>
                <span className="text-sm font-bold text-blue-600">{sizes.images || 100}%</span>
              </div>
              <input type="range" min="50" max="150" value={sizes.images || 100} onChange={e => setSizes({...sizes, images: parseInt(e.target.value)})} className="w-full accent-blue-600" />
            </div>
`;
themeCode = themeCode.replace(
  '          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">',
  '          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">\n' + imageSlider
);
fs.writeFileSync('src/app/admin/ThemeManager.tsx', themeCode, 'utf-8');

// 2. ClientApp.tsx
let clientCode = fs.readFileSync('src/components/ClientApp.tsx', 'utf-8');
clientCode = clientCode.replace(
  'const sizes = initialData?.settings?.sizes || { logo: 100, sections: 100, icons: 100, buttons: 100 };',
  'const sizes = initialData?.settings?.sizes || { logo: 100, sections: 100, icons: 100, buttons: 100, images: 100 };'
);
clientCode = clientCode.replace(
  "'--space-buttons': getSpacing(sizes.buttons),",
  "'--space-buttons': getSpacing(sizes.buttons),\n    '--scale-images': getScale(sizes.images || 100),\n    '--space-images': getSpacing(sizes.images || 100),"
);
fs.writeFileSync('src/components/ClientApp.tsx', clientCode, 'utf-8');

// 3. OffersDrawer.tsx
let offersCode = fs.readFileSync('src/components/OffersDrawer.tsx', 'utf-8');
offersCode = offersCode.replace(
  '<div className="w-full h-48 bg-slate-100 relative shrink-0">',
  '<div className="w-full bg-slate-100 relative shrink-0" style={{ height: `calc(12rem * var(--scale-images))` }}>'
);
fs.writeFileSync('src/components/OffersDrawer.tsx', offersCode, 'utf-8');

console.log('Images sizing added!');
