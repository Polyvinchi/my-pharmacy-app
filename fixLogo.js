const fs = require('fs');
let code = fs.readFileSync('src/components/FacadeBanner.tsx', 'utf-8');

// Fix vertical padding to avoid overlap with absolute top buttons
code = code.replace('pt-8 pb-6 px-4 relative overflow-hidden', 'pt-16 pb-6 px-4 relative overflow-hidden');

// Remove mt-4 to avoid extra unnecessary space since we added pt-16
code = code.replace('flex flex-col relative z-20 mt-4', 'flex flex-col relative z-20 mt-2');

// Fix logo background, border, clipping, and scale
code = code.replace(
  /<div className=\{\`w-24 h-24 bg-white\/95 backdrop-blur-sm \$\{settings\?\.theme_config\?\.logo_shape \|\| "rounded-full"\} shadow-xl mb-3 flex items-center justify-center overflow-hidden p-2 border-2 border-white\/60\`\}>[\s\S]*?<img src=\{settings\?\.logo_url \|\| "\/logo\.png"\} alt="Logo" className="w-\[85%\] h-\[85%\] object-contain drop-shadow-sm" \/>[\s\S]*?<\/div>/,
  `<div className={\`w-28 h-28 bg-transparent \${settings?.theme_config?.logo_shape || "rounded-full"} mb-3 flex items-center justify-center overflow-hidden border border-white/30\`}>
            <img src={settings?.logo_url || "/logo.png"} alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>`
);

fs.writeFileSync('src/components/FacadeBanner.tsx', code, 'utf-8');
