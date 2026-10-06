const fs = require('fs');

let code = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

// Add state for sizes
code = code.replace(
  "const [splashBgImage, setSplashBgImage] = useState(initialData.theme_config?.splash_bg_image || '')",
  `const [splashBgImage, setSplashBgImage] = useState(initialData.theme_config?.splash_bg_image || '')
  
  const defaultSizes = { logo: 100, sections: 100, icons: 100, buttons: 100 };
  const [sizes, setSizes] = useState(initialData.theme_config?.sizes || defaultSizes);`
);

// Add to save payload
code = code.replace(
  "facade_subtitle: facadeSubtitle",
  "facade_subtitle: facadeSubtitle,\n          sizes: sizes"
);

// Add UI for Sizes
const sizesUI = `
        {/* التحكم في الأحجام */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-700">التحكم في أحجام العناصر (تكبير وتصغير)</h3>
            <button type="button" onClick={() => setSizes(defaultSizes)} className="text-sm text-blue-600 hover:text-blue-800 font-bold px-3 py-1 bg-blue-50 rounded-lg">إعادة للافتراضي</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">حجم اللوجو</label>
                <span className="text-sm font-bold text-blue-600">{sizes.logo}%</span>
              </div>
              <input type="range" min="50" max="150" value={sizes.logo} onChange={e => setSizes({...sizes, logo: parseInt(e.target.value)})} className="w-full accent-blue-600" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">حجم الأقسام (الخدمات)</label>
                <span className="text-sm font-bold text-blue-600">{sizes.sections}%</span>
              </div>
              <input type="range" min="50" max="150" value={sizes.sections} onChange={e => setSizes({...sizes, sections: parseInt(e.target.value)})} className="w-full accent-blue-600" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">حجم الأيقونات (داخل الأقسام)</label>
                <span className="text-sm font-bold text-blue-600">{sizes.icons}%</span>
              </div>
              <input type="range" min="50" max="150" value={sizes.icons} onChange={e => setSizes({...sizes, icons: parseInt(e.target.value)})} className="w-full accent-blue-600" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">حجم الزر الرئيسي (العروض/الروشتة)</label>
                <span className="text-sm font-bold text-blue-600">{sizes.buttons}%</span>
              </div>
              <input type="range" min="50" max="150" value={sizes.buttons} onChange={e => setSizes({...sizes, buttons: parseInt(e.target.value)})} className="w-full accent-blue-600" />
            </div>
          </div>
        </div>
`;

code = code.replace(
  /<div className="border-t pt-6">\s*<button type="submit"/,
  sizesUI + "\n        <div className=\"border-t pt-6\">\n          <button type=\"submit\""
);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf-8');
console.log('ThemeManager updated');
