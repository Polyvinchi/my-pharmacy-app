'use client';

import { Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FacadeBannerProps {
  onShareClick: () => void;
  settings?: any;
}

export default function FacadeBanner({ onShareClick, settings }: FacadeBannerProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!settings) return;
    const mode = settings.status_mode || 'always_open';
    if (mode === 'always_open') setIsOpen(true);
    else if (mode === 'always_closed') setIsOpen(false);
    else if (mode === 'scheduled') {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = currentHours + currentMinutes / 60;

      const openStr = settings.open_time || '09:00';
      const closeStr = settings.close_time || '23:00';
      
      const openParts = openStr.split(':').map(Number);
      const closeParts = closeStr.split(':').map(Number);
      
      const openTime = openParts[0] + (openParts[1] || 0) / 60;
      let closeTime = closeParts[0] + (closeParts[1] || 0) / 60;
      
      if (closeTime < openTime) {
        // Crosses midnight
        setIsOpen(currentTime >= openTime || currentTime <= closeTime);
      } else {
        setIsOpen(currentTime >= openTime && currentTime <= closeTime);
      }
    }
  }, [settings]);

  // Use settings or fallback
  const bgImage = settings?.cover_url || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800&h=400&fit=crop';
  
  // Custom primary color if set
  const primaryColor = settings?.primary_color;
  
  return (
    <div className="w-full relative z-30 shrink-0">
      <div className="pt-8 pb-6 px-4 relative overflow-hidden rounded-b-[1.25rem] shadow-md border-b border-white/20">
        
        {/* Background Image or Color */}
        {settings?.cover_url ? (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        ) : (
          <div 
            className="absolute inset-0 z-0"
            style={{ background: primaryColor ? `linear-gradient(135deg, ${primaryColor}, #0f172a)` : "linear-gradient(to right, #1d4ed8, #1e3a8a)" }}
          />
        )}
        
        {/* Subtle Gradient for text readability if using image */}
        {settings?.cover_url && (
          <>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent" />
            <div className="absolute inset-0 z-0 bg-black/20" />
          </>
        )}

        {/* Top Buttons / Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          
          {/* Status Badge */}
          {isOpen ? (
            <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg border border-emerald-500/30">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700">مفتوح الآن</span>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg border border-red-500/30">
              <div className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </div>
              <span className="text-[10px] font-bold text-red-700">مغلق مؤقتاً</span>
            </div>
          )}

          <button 
            onClick={onShareClick}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center text-blue-900 hover:bg-white hover:shadow-xl active:scale-95 transition-all shadow-lg border border-white/50"
          >
            <Share2 size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center relative z-20 mt-4">
          <div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-[1.5rem] shadow-xl mb-3 flex items-center justify-center overflow-hidden p-2 border-2 border-white/60">
            <img src={settings?.logo_url || "/logo.png"} alt="Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />
          </div>
          
          <div className="text-center">
            <h1 className="text-white font-black text-2xl tracking-tight drop-shadow-lg shadow-black">
              {settings?.facade_title || 'صيدلية د. إيمان عبد الوهاب'}
            </h1>
            <p className="text-blue-50 text-xs mt-1.5 font-bold drop-shadow-lg shadow-black">
              {settings?.facade_subtitle || 'عروض حصرية • استشارات مجانية • توصيل سريع'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
