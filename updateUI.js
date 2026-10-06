const fs = require('fs');

let tm = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

// Replace Colors section
const colorsSectionRegex = /\{\/\* الألوان \*\/\}[\s\S]*?(?=<div className="border-t pt-6">\s*<button type="submit")/m;
const newColorsSection = `{/* الألوان */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">ألوان التطبيق</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">اللون الأساسي</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 outline-none" />
                <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-24 border rounded-lg p-2 outline-none font-mono text-sm" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">لون نص الواجهة (الغلاف)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 outline-none" />
                <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-24 border rounded-lg p-2 outline-none font-mono text-sm" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">لون شاشة البداية (Intro)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={splashBgColor} onChange={e => setSplashBgColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 outline-none" />
                <input type="text" value={splashBgColor} onChange={e => setSplashBgColor(e.target.value)} className="w-24 border rounded-lg p-2 outline-none font-mono text-sm" dir="ltr" />
              </div>
            </div>
          </div>
        </div>

        {/* شاشة البداية */}
        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">نص شاشة البداية (Splash Text)</label>
            <input type="text" value={splashText} onChange={e => setSplashText(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">أنيميشن اللوجو في البداية</label>
            <select value={splashAnimation} onChange={e => setSplashAnimation(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr">
              <option value="pulse">نبض (Pulse)</option>
              <option value="bounce">قفز (Bounce)</option>
              <option value="spin">دوران (Spin)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold mb-2">لوجو شاشة البداية (اختياري - إذا كان مختلف عن اللوجو الأساسي)</h3>
            <ImageUploader onUpload={setSplashLogoUrl} currentImage={splashLogoUrl} label="ارفع لوجو الإنترو" folder="logos" aspect={1} shape="round" />
          </div>
        </div>

        {/* إعدادات اللوجو والصور */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">إعدادات لوجو الواجهة الرئيسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">إظهار/إخفاء اللوجو</label>
              <select value={showLogo ? "true" : "false"} onChange={e => setShowLogo(e.target.value === "true")} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="true">إظهار اللوجو</option>
                <option value="false">إخفاء اللوجو تماماً</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">مكان اللوجو</label>
              <select value={logoPosition} onChange={e => setLogoPosition(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="center">في المنتصف (Center)</option>
                <option value="right">يمين (Right)</option>
                <option value="left">يسار (Left)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">شكل اللوجو (الحواف)</label>
              <select value={logoShape} onChange={e => setLogoShape(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr">
                <option value="rounded-full">دائرة (Circle)</option>
                <option value="rounded-3xl">مربع بحواف مدورة جداً</option>
                <option value="rounded-xl">مربع بحواف مدورة</option>
                <option value="rounded-none">مربع حاد (Square)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold mb-2">اللوجو الأساسي</h3>
              <ImageUploader onUpload={setLogoUrl} currentImage={logoUrl} label="ارفع وقص لوجو الصيدلية" folder="logos" aspect={1} shape={logoShape === "rounded-full" ? "round" : "rect"} />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2">صورة الـ Cover (الخلفية)</h3>
              <ImageUploader onUpload={setCoverUrl} currentImage={coverUrl} label="ارفع وقص خلفية الصيدلية" folder="covers" aspect={16/9} shape="rect" />
            </div>
          </div>
        </div>
`;

if (colorsSectionRegex.test(tm)) {
  tm = tm.replace(colorsSectionRegex, newColorsSection);
  fs.writeFileSync('src/app/admin/ThemeManager.tsx', tm, 'utf-8');
  console.log('Updated ThemeManager.tsx successfully');
} else {
  console.log('Regex did not match in ThemeManager.tsx');
}

// FacadeBanner
let fb = fs.readFileSync('src/components/FacadeBanner.tsx', 'utf-8');
fb = fb.replace('<div className="flex flex-col items-center justify-center relative z-20 mt-4">', 
  '<div className={`flex flex-col relative z-20 mt-4 ${settings?.theme_config?.logo_position === "right" ? "items-start" : settings?.theme_config?.logo_position === "left" ? "items-end" : "items-center"}`}>');

fb = fb.replace('<div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-[1.5rem] shadow-xl mb-3 flex items-center justify-center overflow-hidden p-2 border-2 border-white/60">', 
  '{settings?.theme_config?.show_logo !== false && (<div className={`w-24 h-24 bg-white/95 backdrop-blur-sm ${settings?.theme_config?.logo_shape || "rounded-full"} shadow-xl mb-3 flex items-center justify-center overflow-hidden p-2 border-2 border-white/60`}>');

fb = fb.replace('<img src={settings?.logo_url || "/logo.png"} alt="Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />\r\n          </div>', 
  '<img src={settings?.logo_url || "/logo.png"} alt="Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />\n          </div>)}');

fb = fb.replace('<img src={settings?.logo_url || "/logo.png"} alt="Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />\n          </div>', 
  '<img src={settings?.logo_url || "/logo.png"} alt="Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />\n          </div>)}');

fb = fb.replace('className="text-white font-black text-2xl tracking-tight drop-shadow-lg shadow-black"', 
  'className="font-black text-2xl tracking-tight drop-shadow-lg shadow-black" style={{ color: settings?.theme_config?.text_color || "#ffffff" }}');

fs.writeFileSync('src/components/FacadeBanner.tsx', fb, 'utf-8');
console.log('Updated FacadeBanner.tsx successfully');

// SplashScreen
let ss = fs.readFileSync('src/components/SplashScreen.tsx', 'utf-8');
ss = ss.replace('const splashLogo = settings?.logo_url || "/logo.png";', 
  'const splashLogo = settings?.theme_config?.splash_logo_url || settings?.logo_url || "/logo.png";');
ss = ss.replace('const bgColor = settings?.primary_color || "#0D47A1";', 
  'const bgColor = settings?.theme_config?.splash_bg_color || settings?.theme_config?.primaryColor || "#0D47A1";');
fs.writeFileSync('src/components/SplashScreen.tsx', ss, 'utf-8');
console.log('Updated SplashScreen.tsx successfully');
