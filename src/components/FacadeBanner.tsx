import Image from 'next/image';
import { Share2 } from 'lucide-react';

export default function FacadeBanner({ onShareClick, settings }: { onShareClick?: () => void, settings?: any }) {
  return (
    <div className="relative w-full overflow-hidden shadow-2xl rounded-b-xl z-10 flex flex-col">
      {/* The Blue Signboard */}
      <div className="bg-gradient-to-b from-[#0D47A1] to-[#0a3880] w-full pt-8 pb-6 px-4 flex flex-col items-center justify-center relative border-b-4 border-yellow-500">
        
        {/* Share Button */}
        <button 
          onClick={onShareClick}
          className="absolute top-4 left-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all group"
        >
          <Share2 size={20} className="text-white" />
          <span className="absolute -bottom-8 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            مشاركة التطبيق
          </span>
        </button>

        {/* Spotlights Effect (Illuminated Signboard) */}
        <div className="absolute top-0 w-full flex justify-between px-14">
          <div className="w-4 h-4 bg-white rounded-full blur-[8px] opacity-70"></div>
          <div className="w-4 h-4 bg-white rounded-full blur-[8px] opacity-70"></div>
          <div className="w-4 h-4 bg-white rounded-full blur-[8px] opacity-70"></div>
        </div>

        {/* Logo and Typography */}
        <div className="flex flex-col items-center space-y-3 z-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner p-1">
            <Image 
              src="/logo.png" 
              alt="شعار صيدلية إيمان عبد الوهاب" 
              width={90} 
              height={90} 
              className="object-contain"
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-white font-black text-2xl tracking-tight drop-shadow-md">
              صيدلية د. إيمان عبد الوهاب
            </h1>
            <p className="text-blue-100 text-xs mt-1 font-medium">
              عروض حصرية • استشارات مجانية • توصيل سريع
            </p>
          </div>
        </div>
      </div>

      {/* The Red Pillars / Storefront Glass Illusion */}
      <div className="h-4 bg-gradient-to-r from-[#C62828] via-slate-200 to-[#C62828] w-full flex justify-between">
        <div className="w-8 h-full bg-[#C62828] shadow-inner"></div>
        <div className="w-8 h-full bg-[#C62828] shadow-inner"></div>
      </div>
    </div>
  );
}
