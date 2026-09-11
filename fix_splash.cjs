const fs = require('fs');
const path = require('path');

// Fix ClientApp.tsx structure
const clientAppPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ClientApp.tsx');
let clientApp = fs.readFileSync(clientAppPath, 'utf8');

clientApp = clientApp.replace(
  /{tourStep === 'splash' && <SplashScreen onComplete={startTour} \/>}\s*{\/\* Mobile Shell Wrapper \*\/}\s*<div className="w-full max-w-md h-\[100dvh\] sm:h-\[90vh\] sm:max-h-\[850px\] bg-slate-50 sm:rounded-\[2rem\] sm:shadow-\[0_0_50px_rgba\(0,0,0,0\.15\)\] overflow-hidden relative flex flex-col sm:border-\[8px\] border-slate-800">/,
  '{/* Mobile Shell Wrapper */}\\n<div className="w-full sm:w-[400px] h-[100dvh] sm:h-[800px] shrink-0 sm:max-h-[90vh] bg-slate-50 sm:rounded-[2.5rem] sm:shadow-[0_0_50px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col sm:border-[8px] border-slate-800 mx-auto">\\n{tourStep === \\'splash\\' && <SplashScreen onComplete={startTour} />}'
);

fs.writeFileSync(clientAppPath, clientApp, 'utf8');

// Fix SplashScreen.tsx
const splashPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'SplashScreen.tsx');
let splash = fs.readFileSync(splashPath, 'utf8');
splash = splash.replace(/className="fixed inset-0/g, 'className="absolute inset-0');
fs.writeFileSync(splashPath, splash, 'utf8');

console.log('Splash fixed');
