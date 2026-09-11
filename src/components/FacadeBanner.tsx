
'use client';

import { Share2 } from 'lucide-react';
import Image from 'next/image';

interface FacadeBannerProps {
  onShareClick: () => void;
  settings?: any;
}

export default function FacadeBanner({ onShareClick, settings }: FacadeBannerProps) {
  // Use settings or fallback
  const bgImage = settings?.pharmacy_image || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800&h=400&fit=crop';
  const showLogo = settings?.show_logo !== false;
  const showTitle = settings?.show_title !== false;
  
  return (
    <div className="w-full relative z-30 shrink-0">
      <div className="pt-8 pb-6 px-4 relative overflow-hidden rounded-b-[1.25rem] shadow-md border-b border-white/20">
        
        {/* Crystal Clear Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        
        {/* Very Subtle Gradient for text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent" />
        <div className="absolute inset-0 z-0 bg-black/10" />

        <button 
          onClick={onShareClick}
          className="absolute top-4 left-4 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-blue-900 hover:bg-white hover:shadow-xl active:scale-95 transition-all shadow-lg border border-white/50 z-20"
        >
          <Share2 size={20} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center justify-center relative z-20 mt-2">
          {showLogo && (
            <div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-[1.5rem] shadow-xl mb-3 flex items-center justify-center overflow-hidden p-2 border-2 border-white/60">
              <img src="/logo.png" alt="Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />
            </div>
          )}
          
          {showTitle && (
            <div className="text-center">
              <h1 className="text-white font-black text-2xl tracking-tight drop-shadow-lg shadow-black">
                صيدلية د. إيمان عبد الوهاب
              </h1>
              <p className="text-blue-50 text-xs mt-1.5 font-bold drop-shadow-lg shadow-black">
                عروض حصرية • استشارات مجانية • توصيل سريع
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
