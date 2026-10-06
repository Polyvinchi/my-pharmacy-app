const fs = require('fs');
let code = fs.readFileSync('src/components/SplashScreen.tsx', 'utf8');
code = code.replace('className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl p-2 relative overflow-hidden"', 'className="w-40 h-40 bg-transparent flex items-center justify-center relative overflow-hidden"');
code = code.replace('via-white/80', 'via-white/30');
fs.writeFileSync('src/components/SplashScreen.tsx', code, 'utf8');
