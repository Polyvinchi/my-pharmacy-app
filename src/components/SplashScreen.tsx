'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash after 1.5s
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete(); // Trigger the next phase (the tour)
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D47A1]"
        >
          {/* Logo with Shimmer/Pulse Effect */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl p-2 relative overflow-hidden"
          >
            {/* Shimmer sweep */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 z-20"
            />
            
            <Image 
              src="/logo.png" 
              alt="صيدلية إيمان عبد الوهاب" 
              width={120} 
              height={120} 
              className="object-contain z-10"
              priority
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white font-black text-2xl mt-6 tracking-tight"
          >
            صيدلية د. إيمان عبد الوهاب
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.8 }}
            dir="ltr" 
            className="absolute bottom-8 w-full text-center"
          >
            <a 
              href="https://mohamedayman-polyvinchi.vercel.app/" 
              target="_blank" 
              rel="noreferrer"
              className="text-[10px] font-medium text-white/50 hover:text-white/80 transition-all"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              Developed by Eng. Mohamed Ayman
            </a>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
