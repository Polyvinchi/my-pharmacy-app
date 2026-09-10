'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HeartPulse, Pill, Stethoscope, Wallet, MapPin, Phone, Search } from 'lucide-react';
import { useState, useRef } from 'react';

interface ActionGridProps {
  activeTourStep: 'splash' | 'payments' | 'socials' | 'services' | 'finished';
  onMapClick: () => void;
  settings?: any;
}

export default function ActionGrid({ activeTourStep, onMapClick, settings }: ActionGridProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [enlargedNumber, setEnlargedNumber] = useState<{ number: string, label: string } | null>(null);
  
  // Custom Long Press hook logic simplified for inline use
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressFired = useRef<boolean>(false);

  const handlePointerDown = (number: string, label: string) => {
    longPressFired.current = false;
    timerRef.current = setTimeout(() => {
      longPressFired.current = true;
      setEnlargedNumber({ number, label });
    }, 600); // 600ms for long press
  };

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleLinkClick = (e: React.MouseEvent, url: string, target: string = '_self') => {
    if (longPressFired.current) {
      e.preventDefault();
      return;
    }
    if (target === '_blank') {
      window.open(url, target);
    } else {
      window.location.href = url;
    }
  };

  const handleCopy = (text: string, provider: string, fallbackUrl: string) => {
    navigator.clipboard.writeText(text);
    setToast(`تم نسخ رقم ${provider} بنجاح!`);
    
    // Try to open the app if possible (only on mobile)
    setTimeout(() => {
      setToast(null);
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && fallbackUrl && fallbackUrl !== '#') {
        window.location.href = fallbackUrl;
      }
    }, 1500);
  };

  const formatNumberGroups = (num: string) => {
    if (num.length === 11) return [num.slice(0,3), num.slice(3,7), num.slice(7)]; // e.g. 010 0000 0000
    if (num.length === 10) return [num.slice(0,2), num.slice(2,6), num.slice(6)]; // e.g. 02 3330 0000
    return [num];
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-3 relative h-full gap-2 pb-28 group/grid z-20">
      
      {/* Enlarged Number Modal */}
      <AnimatePresence>
        {enlargedNumber && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setEnlargedNumber(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md cursor-pointer"
          >
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-4 border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <h2 className="text-white font-bold text-lg mb-6 drop-shadow-md">إملاء رقم ({enlargedNumber.label})</h2>
              <div className="flex justify-center items-center gap-2 text-4xl font-black tracking-widest text-white drop-shadow-xl" style={{ direction: 'ltr' }}>
                {formatNumberGroups(enlargedNumber.number).map((group, idx) => (
                  <span key={idx} className={`${idx===0?'text-slate-800':idx===1?'text-white':'text-red-800'}`}>
                    {group}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-white/80 text-xs font-medium bg-black/10 py-2 rounded-xl">اضغط في أي مكان للإغلاق</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] font-bold flex items-center space-x-2 space-x-reverse whitespace-nowrap"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Section */}
      <motion.div 
        animate={activeTourStep === 'services' ? { scale: 1, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.4)" } : { scale: 1, boxShadow: "none" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className={`bg-white rounded-2xl p-3 border-2 transition-all duration-300 relative group cursor-pointer flex-shrink-0 group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50 ${activeTourStep === 'services' ? 'border-blue-400 z-40' : 'border-slate-100 hover:border-emerald-300 shadow-sm'}`}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-emerald-100/70 border border-emerald-300 backdrop-blur-md text-emerald-900 text-sm px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.5)] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] scale-90 group-hover:scale-100 origin-bottom">
          اكتشف خدماتنا الطبية المتكاملة
        </div>

        <AnimatePresence>
          {activeTourStep === 'services' && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.9}} className="absolute -top-8 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg shadow-lg font-bold z-50">
              خدماتنا
            </motion.div>
          )}
        </AnimatePresence>
        <h2 className="text-slate-800 font-bold mb-2 text-xs flex items-center">
          <Activity className="w-3 h-3 ml-1 text-blue-600" />
          خدماتنا الطبية
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: HeartPulse, label: 'قياس ضغط' },
            { icon: Activity, label: 'سكر دم' },
            { icon: Pill, label: 'توفير نواقص' },
            { icon: Stethoscope, label: 'استشارة' }
          ].map((service, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-2 px-1 bg-slate-50 rounded-xl border border-transparent hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
              <service.icon className="w-8 h-8 text-blue-600 mb-2 group-hover:text-emerald-500 transition-colors" />
              <span className="text-[9px] font-bold text-slate-700 whitespace-nowrap">{service.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payments Section */}
      <motion.div
        animate={activeTourStep === 'payments' ? { scale: 1, boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.3)" } : { scale: 1, boxShadow: "none" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className={`relative rounded-2xl transition-all duration-300 group cursor-pointer border-2 p-2 flex-shrink-0 group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50 ${activeTourStep === 'payments' ? 'z-40 bg-white/50 border-purple-200' : 'border-slate-100 bg-white hover:border-emerald-300'}`}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-emerald-100/70 border border-emerald-300 backdrop-blur-md text-emerald-900 text-sm px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.5)] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] scale-90 group-hover:scale-100 origin-bottom">
          اضغط لنسخ الرقم (إنستاباي أو كاش)
        </div>

        <AnimatePresence>
          {activeTourStep === 'payments' && (
             <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.9}} className="absolute -top-8 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-lg shadow-lg font-bold z-50">
               اضغط للنسخ فوراً
             </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="text-slate-500 font-semibold text-[10px] group-hover:text-emerald-700 transition-colors">الدفع الإلكتروني (اضغط للنسخ)</h2>
          <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-0.5"><Search size={8}/> ضغطة مطولة لتكبير الرقم</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy('01000000000', 'إنستاباي', 'instapay://')}
            onDoubleClick={() => setEnlargedNumber({ number: '01000000000', label: 'إنستاباي' })}
            onPointerDown={() => handlePointerDown('01000000000', 'إنستاباي')}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="flex items-center p-2 bg-white border-2 border-slate-100 rounded-xl shadow-sm transition-all hover:border-emerald-400 select-none"
          >
            <div className="w-20 h-10 flex items-center justify-center ml-1 bg-transparent transition-all flex-shrink-0 pointer-events-none">
              <img src="/instapay.png" alt="InstaPay" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <div className="text-right pointer-events-none">
              <div className="text-sm font-bold text-slate-800">إنستاباي</div>
              <div className="text-[10px] text-slate-500">تحويل بنكي</div>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy('01000000000', 'فودافون كاش', 'tel:*9*7*01000000000*#')}
            onDoubleClick={() => setEnlargedNumber({ number: '01000000000', label: 'فودافون كاش' })}
            onPointerDown={() => handlePointerDown('01000000000', 'فودافون كاش')}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="flex items-center p-2 bg-white border-2 border-slate-100 rounded-xl shadow-sm transition-all hover:border-emerald-400 select-none"
          >
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0 pointer-events-none">
              <Wallet size={24} />
            </div>
            <div className="text-right pointer-events-none">
              <div className="text-sm font-bold text-slate-800">محفظة كاش</div>
              <div className="text-[10px] text-slate-500">موبايل</div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Socials, Communication & Location */}
      <motion.div 
        animate={activeTourStep === 'socials' ? { scale: 1, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.4)" } : { scale: 1, boxShadow: "none" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className={`relative transition-all duration-300 group cursor-pointer border-2 rounded-2xl p-2 flex-shrink-0 bg-white group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50 ${activeTourStep === 'socials' ? 'z-40 border-blue-200 bg-blue-50/50' : 'border-slate-100 hover:border-emerald-300'}`}
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-emerald-100/70 border border-emerald-300 backdrop-blur-md text-emerald-900 text-sm px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.5)] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] scale-90 group-hover:scale-100 origin-bottom">
          تواصل معنا بأسهل الطرق
        </div>

        <AnimatePresence>
          {activeTourStep === 'socials' && (
             <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.9}} className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg shadow-lg font-bold whitespace-nowrap z-50">
               تواصل معنا
             </motion.div>
          )}
        </AnimatePresence>
        
        {/* Communication Row */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <button 
            onClick={(e) => handleLinkClick(e, 'tel:01000000000')}
            onContextMenu={(e) => e.preventDefault()}
            onDoubleClick={(e) => { e.preventDefault(); setEnlargedNumber({ number: '01000000000', label: 'اتصال هاتفي' }); }}
            onPointerDown={() => handlePointerDown('01000000000', 'اتصال هاتفي')}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full flex items-center justify-center py-2 px-2 bg-blue-50 border-2 border-blue-100 rounded-xl shadow-sm hover:border-blue-400 hover:bg-blue-100 transition-colors select-none"
            style={{ WebkitTouchCallout: 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" className="ml-1.5 pointer-events-none" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span className="text-[11px] font-bold text-blue-700 pointer-events-none">موبايل</span>
          </button>

          <button 
            onClick={(e) => handleLinkClick(e, 'https://wa.me/201000000000', '_blank')}
            onContextMenu={(e) => e.preventDefault()}
            onDoubleClick={(e) => { e.preventDefault(); setEnlargedNumber({ number: '01000000000', label: 'واتساب' }); }}
            onPointerDown={() => handlePointerDown('01000000000', 'واتساب')}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full flex items-center justify-center py-2 px-2 bg-green-50 border-2 border-green-100 rounded-xl shadow-sm hover:border-green-400 hover:bg-green-100 transition-colors select-none"
            style={{ WebkitTouchCallout: 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" className="ml-1.5 pointer-events-none"><path fill="#16a34a" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            <span className="text-[11px] font-bold text-green-700 pointer-events-none">واتساب</span>
          </button>

          <button 
            onClick={(e) => handleLinkClick(e, 'tel:0233300000')}
            onContextMenu={(e) => e.preventDefault()}
            onDoubleClick={(e) => { e.preventDefault(); setEnlargedNumber({ number: '0233300000', label: 'الخط الأرضي' }); }}
            onPointerDown={() => handlePointerDown('0233300000', 'الخط الأرضي')}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full flex items-center justify-center py-2 px-2 bg-slate-50 border-2 border-slate-100 rounded-xl shadow-sm hover:border-slate-400 hover:bg-slate-100 transition-colors select-none"
            style={{ WebkitTouchCallout: 'none' }}
          >
            <Phone size={26} className="ml-1.5 text-slate-500 pointer-events-none" strokeWidth={2} />
            <span className="text-[11px] font-bold text-slate-700 pointer-events-none">أرضي</span>
          </button>
        </div>

        {/* Socials & Others Row */}
        <div className="grid grid-cols-4 gap-3">
          <a href="#" className="flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28" className="mb-1.5"><path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/></svg>
            <span className="text-[9px] font-bold text-slate-600">فيسبوك</span>
          </a>
          
          <a href="#" className="flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-pink-300 hover:bg-pink-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28" className="mb-1.5"><radialGradient id="yOrnnhliCrdS2gy~4tD8ma" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fd5"/><stop offset=".328" stopColor="#ff543f"/><stop offset=".348" stopColor="#fc5245"/><stop offset=".504" stopColor="#e64771"/><stop offset=".643" stopColor="#d53e91"/><stop offset=".761" stopColor="#cc39a4"/><stop offset=".841" stopColor="#c837ab"/></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8ma)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"/><radialGradient id="yOrnnhliCrdS2gy~4tD8mb" cx="11.786" cy="5.54" r="29.813" gradientTransform="matrix(1 0 0 .6663 0 1.849)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4168c9"/><stop offset=".999" stopColor="#4168c9" stopOpacity="0"/></radialGradient><path fill="url(#yOrnnhliCrdS2gy~4tD8mb)" d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20 c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20 C42.014,38.383,38.417,41.986,34.017,41.99z"/><path fill="#fff" d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5 s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"/><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"/><path fill="#fff" d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12 C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"/></svg>
            <span className="text-[9px] font-bold text-slate-600">إنستا</span>
          </a>

          <a href="https://www.google.com/maps/search/?api=1&query=29.9984,31.1578" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-red-300 hover:bg-red-50 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" className="mb-1.5"><path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span className="text-[9px] font-bold text-slate-600">الموقع</span>
          </a>

          <button onClick={() => {}} className="relative flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all group/install overflow-hidden active:scale-95">
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white z-10 animate-pulse" />
            <img src="/logo.png" alt="App Logo" className="w-7 h-7 object-contain mb-1.5 drop-shadow-sm group-hover/install:scale-110 transition-transform" />
            <span className="text-[9px] font-bold text-slate-800">تثبيت App</span>
          </button>
        </div>
      </motion.div>

      {/* 3D Map Placeholder (Shrunk) */}
      <div onClick={onMapClick} className="w-full h-14 bg-white border-2 border-slate-100 rounded-2xl p-1 shadow-sm relative overflow-hidden group cursor-pointer hover:border-emerald-400 transition-all duration-300 flex-shrink-0 group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-100/70 border border-emerald-300 backdrop-blur-md text-emerald-900 text-sm px-4 py-2 rounded-xl shadow-[0_0_25px_rgba(52,211,153,0.5)] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] scale-90 group-hover:scale-100 origin-bottom">
          تصفح الخريطة 3D التفاعلية
        </div>
        <div className="w-full h-full rounded-xl overflow-hidden relative">
          <img src="/map_preview.png" alt="Map 3D Preview" className="w-full h-full object-cover opacity-80 mix-blend-multiply filter blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end justify-center pb-2 pointer-events-none">
            <span className="text-white text-[9px] font-bold bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-1">
              <MapPin size={10} className="text-red-400" />
              اضغط لفتح الخريطة
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
