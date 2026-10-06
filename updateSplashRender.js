const fs = require('fs');
let code = fs.readFileSync('src/components/SplashScreen.tsx', 'utf-8');

const readSettings = `
  const splashLogo = settings?.theme_config?.splash_logo_url || settings?.logo_url || "/logo.png";
  const splashText = settings?.theme_config?.splash_text || settings?.theme_config?.facade_title || settings?.name || "صيدلية د. إيمان عبد الوهاب";
  const bgColor = settings?.theme_config?.splash_bg_color || settings?.theme_config?.primaryColor || "#0D47A1";
  const bgImage = settings?.theme_config?.splash_bg_image || settings?.splash_bg_image;
  const animationType = settings?.splash_animation || "pulse"; // pulse, spin, bounce
  
  const logoShape = settings?.theme_config?.splash_logo_shape || "rounded-3xl";
  const logoX = settings?.theme_config?.splash_logo_x || 0;
  const logoY = settings?.theme_config?.splash_logo_y || 0;
`;

code = code.replace(
  '  const animationType = settings?.splash_animation || "pulse"; // pulse, spin, bounce',
  '  const animationType = settings?.splash_animation || "pulse"; // pulse, spin, bounce\n  const logoShape = settings?.theme_config?.splash_logo_shape || "rounded-3xl";\n  const logoX = settings?.theme_config?.splash_logo_x || 0;\n  const logoY = settings?.theme_config?.splash_logo_y || 0;'
);

const logoRender = `{/* Logo */}
          {logoShape !== 'hidden' && (
            <div style={{ transform: \`translate(\${logoX}px, \${logoY}px)\` }} className="z-10 relative">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={logoAnimate}
                transition={logoTransition}
                className={\`w-40 h-40 bg-white/10 flex items-center justify-center relative overflow-hidden backdrop-blur-sm \${logoShape}\`}
              >
                {/* Shimmer sweep */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 z-20"
                />
                
                <img 
                  src={splashLogo} 
                  alt="Logo" 
                  className={\`w-full h-full object-contain z-10 p-2 \${logoShape}\`}
                />
              </motion.div>
            </div>
          )}`;

const oldLogo = `{/* Logo */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={logoAnimate}
            transition={logoTransition}
            className="w-40 h-40 bg-transparent flex items-center justify-center relative overflow-hidden"
          >
            {/* Shimmer sweep */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 z-20"
            />
            
            <img 
              src={splashLogo} 
              alt="Logo" 
              className="w-full h-full object-contain z-10 p-1"
            />
          </motion.div>`;

code = code.replace(oldLogo, logoRender);

fs.writeFileSync('src/components/SplashScreen.tsx', code, 'utf-8');
console.log('Updated SplashScreen.tsx');
