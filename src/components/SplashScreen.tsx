'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete, settings }: { onComplete: () => void, settings?: any }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash after 1.8s
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete(); // Trigger the next phase (the tour)
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Read settings
  const splashLogo = settings?.logo_url || "/logo.png";
  const splashText = settings?.splash_text || settings?.facade_title || "صيدلية د. إيمان عبد الوهاب";
  const bgColor = settings?.primary_color || "#0D47A1";
  const animationType = settings?.splash_animation || "pulse"; // pulse, spin, bounce

  // Determine Logo Animation
  let logoAnimate: any = { scale: 1, opacity: 1 };
  let logoTransition: any = { duration: 0.8 };
  
  if (animationType === "pulse") {
    logoAnimate = { scale: [0.8, 1.05, 1], opacity: 1 };
    logoTransition = { duration: 0.8, ease: "easeInOut" };
  } else if (animationType === "spin") {
    logoAnimate = { rotate: 360, scale: 1, opacity: 1 };
    logoTransition = { duration: 1, ease: "easeInOut" };
  } else if (animationType === "bounce") {
    logoAnimate = { y: [0, -20, 0], scale: 1, opacity: 1 };
    logoTransition = { duration: 0.8, ease: "easeOut" };
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={logoAnimate}
            transition={logoTransition}
            className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl p-2 relative overflow-hidden"
          >
            {/* Shimmer sweep */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 z-20"
            />
            
            <img 
              src={splashLogo} 
              alt="Logo" 
              className="w-full h-full object-contain z-10 p-1"
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white font-black text-2xl mt-6 tracking-tight text-center px-4"
          >
            {splashText}
          </motion.h1>
          
          {/* Loading Dots */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex space-x-2 space-x-reverse mt-4"
          >
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-yellow-400 rounded-full" />
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-yellow-400 rounded-full" />
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-yellow-400 rounded-full" />
          </motion.div>

          {/* Developer Signature */}
          <motion.a 
            href="https://mohamedayman-polyvinchi.vercel.app/" 
            target="_blank" 
            rel="noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.8 }}
            dir="ltr" 
            className="absolute bottom-8 w-full flex items-center justify-center gap-2 text-center group cursor-pointer"
          >
            <span 
              className="text-[10px] font-medium text-white/50 group-hover:text-white/80 transition-all"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              Developed by Eng. Mohamed Ayman
            </span>
            
            <span className="text-[10px] text-white/30">|</span>
            
            {/* Smart Link Badge */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black tracking-widest text-white">SMART</span>
              <span className="text-[10px] font-black tracking-widest text-yellow-400">LINK</span>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse ml-0.5 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
            </div>
          </motion.a>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
