const fs = require('fs');
let tm = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');
tm = tm.replace('text_color: textColor,\\n          facade_title: facadeTitle,\\n          facade_subtitle: facadeSubtitle', 'text_color: textColor,\nfacade_title: facadeTitle,\nfacade_subtitle: facadeSubtitle');
fs.writeFileSync('src/app/admin/ThemeManager.tsx', tm, 'utf-8');
console.log('Fixed');
