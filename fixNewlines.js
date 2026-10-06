const fs = require('fs');
let tm = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');
tm = tm.replace(/\\n/g, '\n');
fs.writeFileSync('src/app/admin/ThemeManager.tsx', tm, 'utf-8');
console.log('Fixed literal newlines');
