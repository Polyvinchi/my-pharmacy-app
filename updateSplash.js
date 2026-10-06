const fs = require('fs');

// 1. Update ThemeManager.tsx
let themeCode = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

themeCode = themeCode.replace(
  "const [splashBgColor, setSplashBgColor] = useState(initialData.theme_config?.splash_bg_color || '#0D47A1')", 
  "const [splashBgColor, setSplashBgColor] = useState(initialData.theme_config?.splash_bg_color || '#0D47A1')\n  const [splashBgImage, setSplashBgImage] = useState(initialData.theme_config?.splash_bg_image || '')"
);

themeCode = themeCode.replace(
  "splash_bg_color: splashBgColor,", 
  "splash_bg_color: splashBgColor,\n          splash_bg_image: splashBgImage,"
);

themeCode = themeCode.replace(
  /<div className="md:col-span-2">\s*<h3 className="text-sm font-bold mb-2">لوجو شاشة البداية[^<]*<\/h3>\s*<ImageUploader onUpload=\{setSplashLogoUrl\} currentImage=\{splashLogoUrl\}[^>]*\/>\s*<\/div>/m, 
  `<div className="md:col-span-2">
            <h3 className="text-sm font-bold mb-2">لوجو شاشة البداية (اختياري - إذا كان مختلف عن اللوجو الأساسي)</h3>
            <ImageUploader onUpload={setSplashLogoUrl} currentImage={splashLogoUrl} label="ارفع لوجو الانترو" folder="logos" aspect={1} shape="round" />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold mb-2 mt-4">صورة خلفية الانترو (اختياري - بدل اللون السادة)</h3>
            <ImageUploader onUpload={setSplashBgImage} currentImage={splashBgImage} label="ارفع خلفية الانترو" folder="covers" aspect={9/16} shape="rect" />
          </div>`
);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', themeCode, 'utf-8');

// 2. Update page.tsx
let pageCode = fs.readFileSync('src/app/page.tsx', 'utf-8');
pageCode = pageCode.replace(
  "splash_text: pharmacy?.theme_config?.splash_text || pharmacy?.name || 'صيدلية د. ايمان عبد الوهاب | حسن محمد - فيصل',",
  "splash_text: pharmacy?.theme_config?.splash_text || pharmacy?.name || 'صيدلية د. ايمان عبد الوهاب | حسن محمد - فيصل',\n      splash_bg_image: pharmacy?.theme_config?.splash_bg_image || null,"
);
fs.writeFileSync('src/app/page.tsx', pageCode, 'utf-8');

// 3. Update SplashScreen.tsx
let splashCode = fs.readFileSync('src/components/SplashScreen.tsx', 'utf-8');
splashCode = splashCode.replace(
  "const bgColor = settings?.theme_config?.splash_bg_color || settings?.theme_config?.primaryColor || \"#0D47A1\";",
  "const bgColor = settings?.theme_config?.splash_bg_color || settings?.theme_config?.primaryColor || \"#0D47A1\";\n  const bgImage = settings?.theme_config?.splash_bg_image || settings?.splash_bg_image;"
);
splashCode = splashCode.replace(
  "style={{ backgroundColor: bgColor }}",
  "style={{ backgroundColor: bgColor, backgroundImage: bgImage ? `url(${bgImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}"
);
fs.writeFileSync('src/components/SplashScreen.tsx', splashCode, 'utf-8');

console.log("Done");
