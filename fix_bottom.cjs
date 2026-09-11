const fs = require('fs');
const path = require('path');

const clientAppPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ClientApp.tsx');
let clientApp = fs.readFileSync(clientAppPath, 'utf8');

// Hide bottom button during splash screen
clientApp = clientApp.replace(
  /{isShareOpen && <ShareModal/g,
  '{tourStep !== "splash" && (\n          <div className="absolute bottom-0 left-0 w-full px-4 pt-1.5 pb-1 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">\n            <motion.button\n              whileHover={{ scale: 1.02 }}\n              whileTap={{ scale: 0.98 }}\n              onClick={() => setIsOffersOpen(true)}\n              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-2.5 rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all"\n            >\n              <span className="text-sm">\\u0627\\u0644\\u0639\\u0631\\u0648\\u0636 \\u0627\\u0644\\u062D\\u0635\\u0631\\u064A\\u0629 \\u0648\\u0627\\u0644\\u0631\\u0648\\u0634\\u062A\\u0629</span>\n              <span className="text-lg">??</span>\n            </motion.button>\n          </div>\n        )}\n\n        {isShareOpen && <ShareModal'
);

// Remove the old bottom button (since we prepended it above)
clientApp = clientApp.replace(
  /<div className="absolute bottom-0 left-0 w-full px-4 pt-2 pb-1 bg-white\/90 backdrop-blur-md border-t border-slate-100 z-50 shadow-\[0_-10px_40px_-15px_rgba\(0,0,0,0\.1\)\]">\s*<motion\.button[\s\S]*?<\/motion\.button>\s*<\/div>/,
  ''
);

fs.writeFileSync(clientAppPath, clientApp, 'utf8');

const splashPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'SplashScreen.tsx');
let splash = fs.readFileSync(splashPath, 'utf8');
splash = splash.replace(/className="absolute inset-0 z-50/g, 'className="absolute inset-0 z-[100]');
fs.writeFileSync(splashPath, splash, 'utf8');

console.log('ClientApp fixed');
