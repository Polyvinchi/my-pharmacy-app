'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FacadeBanner from './FacadeBanner';
import ActionGrid from './ActionGrid';
import SplashScreen from './SplashScreen';
import OffersDrawer from './OffersDrawer';
import ShareModal from './ShareModal';
import MapModal from './MapModal';
import { trackAction } from '@/utils/track';

export default function ClientApp({ initialData }: { initialData?: any }) {
  const [tourStep, setTourStep] = useState<'splash' | 'payments' | 'socials' | 'services' | 'finished'>('splash');
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const startTour = () => {
    setTourStep('payments');
    setTimeout(() => setTourStep('socials'), 1500);
    setTimeout(() => setTourStep('services'), 3000);
    setTimeout(() => setTourStep('finished'), 4500);
  };

  const handleOffersOpen = () => {
    trackAction('open_offers');
    setIsOffersOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-0 sm:p-4 font-sans text-slate-900 relative">
      
      {tourStep === 'splash' && <SplashScreen onComplete={startTour} settings={initialData?.settings} />}

      {/* Mobile Shell Wrapper */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[90vh] sm:max-h-[850px] bg-slate-50 sm:rounded-[2rem] sm:shadow-[0_0_50px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col sm:border-[8px] border-slate-800">

        <FacadeBanner onShareClick={() => setIsShareOpen(true)} settings={initialData?.settings} />
        
        <ActionGrid activeTourStep={tourStep} onMapClick={() => setIsMapOpen(true)} settings={initialData?.settings} services={initialData?.services} sections={initialData?.sections} />

        {/* Fixed Bottom Button (Offers) */}
        <div className="absolute bottom-0 left-0 w-full px-3 pt-1 pb-2 z-50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOffersOpen}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl font-bold shadow-xl shadow-yellow-500/40 hover:shadow-yellow-500/60 transition-all flex items-center justify-center relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 z-0"
            />
            <span className="relative z-10 text-lg flex items-center gap-2">
              🔥 العروض الحصرية والروشتة
            </span>
          </motion.button>

          {/* Developer Signature */}
          <a 
            dir="ltr" 
            href="https://mohamedayman-polyvinchi.vercel.app/" 
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 mt-2 pb-1 group cursor-pointer"
          >
            <span 
              className="text-[9px] font-medium bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-500 group-hover:from-slate-500 group-hover:to-slate-600 transition-all opacity-70 group-hover:opacity-100"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              Developed by Eng. Mohamed Ayman
            </span>
            
            <span className="text-[10px] text-slate-300 opacity-50">|</span>
            
            {/* Smart Link Badge */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-black tracking-widest text-blue-600 bg-clip-text">SMART</span>
              <span className="text-[9px] font-black tracking-widest text-slate-800">LINK</span>
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse ml-0.5 shadow-[0_0_4px_rgba(59,130,246,0.8)]"></div>
            </div>
          </a>

        </div>

      </div>

      {/* Global Modals */}
      <OffersDrawer isOpen={isOffersOpen} handleClose={() => setIsOffersOpen(false)} offers={initialData?.offers || []} whatsapp={initialData?.settings?.whatsapp_number || '20100000000'} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />

    </div>
  );
}
