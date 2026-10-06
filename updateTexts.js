const fs = require('fs');

// 1. Update ThemeManager.tsx
let tm = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

// Add states
const stateInjection = `  const [splashText, setSplashText] = useState(initialData.theme_config?.splash_text || initialData.name || 'صيدلية د. إيمان عبد الوهاب')
  const [tabTitle, setTabTitle] = useState(initialData.title_tag || initialData.name || '')
  const [facadeTitle, setFacadeTitle] = useState(initialData.theme_config?.facade_title || initialData.name || '')
  const [facadeSubtitle, setFacadeSubtitle] = useState(initialData.theme_config?.facade_subtitle || 'صيدلية متكاملة - عروض حصرية وتوصيل سريع')`;

tm = tm.replace(/  const \[splashText, setSplashText\] = useState[^]+?\n/, stateInjection + '\n');

// Update themeConfig payload
const themeConfigInjection = `      const themeConfig = {
        primaryColor,
        textColor,
        splashBgColor,
        splash_text: splashText,
        facade_title: facadeTitle,
        facade_subtitle: facadeSubtitle,
        splash_animation: splashAnimation,
        show_logo: showLogo,
        logo_position: logoPosition,
        logo_shape: logoShape,
        splash_logo_url: splashLogoUrl,
        status_mode: statusMode,
        open_time: openTime,
        close_time: closeTime
      }`;

tm = tm.replace(/      const themeConfig = \{[^]+?close_time: closeTime\n      \}/, themeConfigInjection);

// Update payload to include title_tag
const payloadInjection = `      const payload = {
        name,
        title_tag: tabTitle,
        theme_config: themeConfig,
        social_links: socialLinks,`;

tm = tm.replace(/      const payload = \{\n        name,\n        theme_config: themeConfig,\n        social_links: socialLinks,/, payloadInjection);

// Add UI inputs in the first section (Name section)
const uiInjection = `        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">اسم الصيدلية (يستخدم داخلياً)</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">عنوان المتصفح (يظهر في التبويب من أعلى - SEO)</label>
            <input type="text" value={tabTitle} onChange={e => setTabTitle(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">العنوان الرئيسي في الواجهة (المانشيت)</label>
            <input type="text" value={facadeTitle} onChange={e => setFacadeTitle(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">الوصف الفرعي في الواجهة (تحت المانشيت)</label>
            <input type="text" value={facadeSubtitle} onChange={e => setFacadeSubtitle(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
        </div>`;

tm = tm.replace(/        <div className="mb-6">\n          <label className="block text-sm font-medium mb-2">[^]+?<\/div>/, uiInjection);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', tm, 'utf-8');
console.log('Updated ThemeManager');


// 2. Update FacadeBanner.tsx
let fb = fs.readFileSync('src/components/FacadeBanner.tsx', 'utf-8');
fb = fb.replace("{settings?.facade_title || 'صيدلية د. إيمان عبد الوهاب'}", "{settings?.theme_config?.facade_title || settings?.name || 'صيدلية د. إيمان عبد الوهاب'}");
fb = fb.replace("{settings?.facade_subtitle || 'عروض حصرية • استشارات مجانية • توصيل سريع'}", "{settings?.theme_config?.facade_subtitle || 'عروض حصرية • استشارات مجانية • توصيل سريع'}");
fs.writeFileSync('src/components/FacadeBanner.tsx', fb, 'utf-8');
console.log('Updated FacadeBanner');


// 3. Update SplashScreen.tsx
let ss = fs.readFileSync('src/components/SplashScreen.tsx', 'utf-8');
ss = ss.replace('const splashText = settings?.splash_text || settings?.facade_title || "صيدلية د. إيمان عبد الوهاب";', 'const splashText = settings?.theme_config?.splash_text || settings?.theme_config?.facade_title || settings?.name || "صيدلية د. إيمان عبد الوهاب";');
fs.writeFileSync('src/components/SplashScreen.tsx', ss, 'utf-8');
console.log('Updated SplashScreen');
