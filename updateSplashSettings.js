const fs = require('fs');
let code = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

// Add new state variables
code = code.replace(
  'const [splashBgImage, setSplashBgImage] = useState(initialData.theme_config?.splash_bg_image || \'\')',
  'const [splashBgImage, setSplashBgImage] = useState(initialData.theme_config?.splash_bg_image || \'\')\n  const [splashLogoShape, setSplashLogoShape] = useState(initialData.theme_config?.splash_logo_shape || \'rounded-3xl\')\n  const [splashLogoX, setSplashLogoX] = useState(initialData.theme_config?.splash_logo_x || 0)\n  const [splashLogoY, setSplashLogoY] = useState(initialData.theme_config?.splash_logo_y || 0)'
);

// Update themeConfig in handleSave
code = code.replace(
  'splash_bg_image: splashBgImage,',
  'splash_bg_image: splashBgImage,\n      splash_logo_shape: splashLogoShape,\n      splash_logo_x: splashLogoX,\n      splash_logo_y: splashLogoY,'
);

// Insert UI
const ui = `
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">شكل اللوجو (الإنترو)</label>
              <select value={splashLogoShape} onChange={e => setSplashLogoShape(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="rounded-3xl">مربع بحواف دائرية (افتراضي)</option>
                <option value="rounded-full">مدور (دائرة)</option>
                <option value="rounded-none">مربع حاد</option>
                <option value="hidden">إخفاء اللوجو تماماً</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">تحريك يمين/يسار (X)</label>
                <span className="text-sm font-bold text-blue-600">{splashLogoX}</span>
              </div>
              <input type="range" min="-150" max="150" value={splashLogoX} onChange={e => setSplashLogoX(parseInt(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">تحريك أعلى/أسفل (Y)</label>
                <span className="text-sm font-bold text-blue-600">{splashLogoY}</span>
              </div>
              <input type="range" min="-150" max="150" value={splashLogoY} onChange={e => setSplashLogoY(parseInt(e.target.value))} className="w-full accent-blue-600" />
            </div>
          </div>
`;

code = code.replace(
  '<ImageUploader value={splashLogoUrl} onChange={setSplashLogoUrl} label="لوجو البداية" />\n          </div>',
  '<ImageUploader value={splashLogoUrl} onChange={setSplashLogoUrl} label="لوجو البداية" />\n          </div>\n' + ui
);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf-8');
console.log('Updated ThemeManager.tsx');
