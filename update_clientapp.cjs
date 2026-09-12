const fs = require('fs');
let code = fs.readFileSync('src/components/ClientApp.tsx', 'utf8');
code = code.replace('<SplashScreen onComplete={startTour} />', '<SplashScreen onComplete={startTour} settings={initialData?.settings} />');
fs.writeFileSync('src/components/ClientApp.tsx', code, 'utf8');
