const fs = require('fs');
let code = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf8');

code = code.replace(
  'const themeConfig = { ...initialData.theme_config, primaryColor }',
  'const themeConfig = { ...initialData.theme_config, primaryColor, splash_text: splashText, splash_animation: splashAnimation }'
);

code = code.replace(
  'splash_text: splashText,\\r\\n        splash_animation: splashAnimation',
  ''
);
code = code.replace(
  'splash_text: splashText,\\n        splash_animation: splashAnimation',
  ''
);

code = code.replace(
  'const [splashText, setSplashText] = useState(initialData.splash_text || initialData.facade_title || \\'?????? ?. ????? ??? ??????\\')',
  'const [splashText, setSplashText] = useState(initialData.theme_config?.splash_text || initialData.name || \\'?????? ?. ????? ??? ??????\\')'
);

code = code.replace(
  'const [splashAnimation, setSplashAnimation] = useState(initialData.splash_animation || \\'pulse\\')',
  'const [splashAnimation, setSplashAnimation] = useState(initialData.theme_config?.splash_animation || \\'pulse\\')'
);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf8');
