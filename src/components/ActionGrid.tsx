'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HeartPulse, Search, Stethoscope, Wallet, MapPin, Phone, Weight, Bike, CreditCard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface ActionGridProps {
  activeTourStep?: 'splash' | 'payments' | 'socials' | 'services' | 'finished';
  onMapClick: () => void;
  settings?: any;
}

export default function ActionGrid({ activeTourStep, onMapClick, settings }: ActionGridProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [enlargedNumber, setEnlargedNumber] = useState<{ number: string, label: string, type: 'instapay' | 'vodafone' } | null>(null);
  const { canInstall, install: pwaInstall } = usePWAInstall();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressFired = useRef<boolean>(false);

  const handleInstallClick = async () => {
    if (!canInstall) {
      setToast('لتثبيت التطبيق على الآيفون، اضغط على زر المشاركة ثم Add to Home Screen');
      setTimeout(() => setToast(null), 5000); return;
    }
    await pwaInstall();
  };

  const startPress = (num: string, label: string, type: 'instapay' | 'vodafone') => {
    longPressFired.current = false;
    timerRef.current = setTimeout(() => { longPressFired.current = true; setEnlargedNumber({ number: num, label, type }); }, 500);
  };
  const cancelPress = () => { if (timerRef.current) clearTimeout(timerRef.current); };
  const handleNumberClick = (e: React.MouseEvent, type: 'instapay' | 'vodafone') => {
    if (longPressFired.current) { e.preventDefault(); return; }
    const num = '01012345678';
    navigator.clipboard.writeText(num).then(() => {
      setToast(type === 'instapay' ? 'تم نسخ رقم إنستاباي ✅' : 'تم نسخ رقم محفظة كاش ✅');
      setTimeout(() => setToast(null), 2500);
      if (type === 'instapay') setTimeout(() => { try { window.location.href = 'instapay://'; } catch(e){} }, 1000);
      else setTimeout(() => { window.location.href = `tel:01012345678`; }, 1000);
    });
  };

  // cell with no bg, no border - vivid solid color on hover
  const cell = () => 'flex flex-col items-center justify-center bg-transparent rounded-xl p-1 group/btn transition-all h-[72px] cursor-pointer hover:bg-blue-500/15 active:bg-blue-500/15 hover:border-2 hover:border-blue-500 active:border-2 active:border-blue-500 border-2 border-transparent';
  const svcIcon = 'text-blue-500 group-hover/btn:scale-110 group-active/btn:scale-110 transition-all';
  const svcLabel = 'text-[9px] font-bold text-slate-500 whitespace-nowrap mt-0.5';

  return (
    <>
      <div className="flex-1 overflow-y-auto px-2.5 py-1.5 relative gap-2 pb-24 flex flex-col z-40 bg-slate-50/50">

        <AnimatePresence>
          {toast && (<motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-slate-100 border border-slate-700/50 px-6 py-3 rounded-2xl shadow-2xl z-50 font-bold text-xs text-center whitespace-nowrap flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />{toast}</motion.div>)}
        </AnimatePresence>

        <AnimatePresence>
          {enlargedNumber && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={() => setEnlargedNumber(null)}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-[340px] rounded-[1.5rem] p-6 shadow-2xl flex flex-col items-center border-[3px] border-white/90 bg-gradient-to-br from-[#FFB703] to-[#FB8500]" onClick={e => e.stopPropagation()}>
                <h4 className="text-sm font-bold text-white mb-6 mt-1">إملاء رقم ({enlargedNumber.label})</h4>
                <div className="flex flex-row gap-3 mb-8" dir="ltr">
                  {(() => { const m = enlargedNumber.number.replace(/\s/g,'').match(/^(\d{3})(\d{4})(\d{4})$/); return m ? (<><span className="font-mono text-3xl font-black text-slate-800">{m[1]}</span><span className="font-mono text-3xl font-black text-white">{m[2]}</span><span className="font-mono text-3xl font-black text-red-900">{m[3]}</span></>) : <span className="font-mono text-3xl font-black text-white">{enlargedNumber.number}</span>; })()}
                </div>
                <div className="bg-black/10 text-white/90 px-6 py-2.5 rounded-full text-[11px] font-bold w-full text-center">اضغط في أي مكان للإغلاق</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ SERVICES BOX ═══ */}
        <div className="relative mt-1">
          <AnimatePresence>
            {activeTourStep === 'services' && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-3.5 right-4 z-50"><div className="text-[10px] font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full shadow-md border border-blue-200">خدماتنا الطبية</div></motion.div>)}
          </AnimatePresence>
          <div className={`w-full bg-white rounded-xl border-2 ${activeTourStep === 'services' ? 'border-blue-300 shadow-lg' : 'border-slate-100 shadow-sm'} p-2 transition-all duration-300`}>
            <div className="grid grid-cols-4 gap-1.5">
              <button onTouchStart={() => {}} className={cell()}><Activity size={27} strokeWidth={2} className={svcIcon} /><span className={svcLabel}>استشارة</span></button>
              <button onTouchStart={() => {}} className={cell()}><Search size={27} strokeWidth={2} className={svcIcon} /><span className={svcLabel}>توفير نواقص</span></button>
              <button onTouchStart={() => {}} className={cell()}><HeartPulse size={27} strokeWidth={2} className={svcIcon} /><span className={svcLabel}>سكر دم</span></button>
              <button onTouchStart={() => {}} className={cell()}><Activity size={27} strokeWidth={2} className={svcIcon} /><span className={svcLabel}>قياس ضغط</span></button>
              <button onTouchStart={() => {}} className={cell()}><Stethoscope size={27} strokeWidth={2} className={svcIcon} /><span className={svcLabel}>InBody</span></button>
              <a href="https://www.talabat.com" target="_blank" onTouchStart={() => {}} className="flex flex-col items-center justify-center bg-transparent rounded-xl p-1.5 group/btn transition-all h-[72px] cursor-pointer hover:bg-[#FF5A00]/15 active:bg-[#FF5A00]/15 border-2 border-transparent hover:border-[#FF5A00] active:border-[#FF5A00]">
                <div className="w-9 h-9 flex items-center justify-center mb-0.5 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform"><div className="bg-[#FF5A00] text-white rounded-md w-10 h-10 flex items-center justify-center font-black text-[10px] italic">talabat</div></div>
                <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap mt-0.5 group-hover/btn:text-white group-active/btn:text-white transition-colors">طلبات</span>
              </a>
              <button onTouchStart={() => {}} className={cell()}><Bike size={27} strokeWidth={2} className={svcIcon} /><span className={svcLabel}>توصيل</span></button>
              <button onTouchStart={() => {}} className={cell()}><CreditCard size={27} strokeWidth={2} className={svcIcon} /><span className={svcLabel}>Visa</span></button>
            </div>
          </div>
        </div>

        {/* ═══ PAYMENTS BOX ═══ */}
        <div className="relative mt-0.5">
          <AnimatePresence>
            {activeTourStep === 'payments' && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-3.5 right-4 z-50"><div className="text-[10px] font-bold text-white bg-[#D28CFF] px-4 py-1 rounded-full shadow-md">اضغط للنسخ فوراً</div></motion.div>)}
          </AnimatePresence>
          <div className="absolute -top-2.5 left-0 right-0 flex justify-center z-10 pointer-events-none">
            <div className="text-[9px] font-bold text-amber-700 bg-[#FFF3D6] px-3 py-0.5 rounded-full flex items-center gap-1 border border-[#FFE4A0] shadow-sm"><Search size={9} /> ضغطة مطولة لتكبير الرقم</div>
          </div>
          <div className={`w-full bg-white rounded-xl border-2 ${activeTourStep === 'payments' ? 'border-[#D28CFF] shadow-lg' : 'border-slate-100 shadow-sm'} p-2 pt-4 transition-all duration-300`}>
            <p className="text-[10px] font-bold text-slate-400 text-center mb-1">الدفع الإلكتروني (اضغط للنسخ)</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button onMouseDown={() => startPress('01012345678', 'إنستاباي', 'instapay')} onMouseUp={cancelPress} onMouseLeave={cancelPress} onTouchStart={() => startPress('01012345678', 'إنستاباي', 'instapay')} onTouchEnd={cancelPress} onClick={(e) => handleNumberClick(e, 'instapay')} className="group/btn bg-white border-2 border-slate-100 rounded-xl p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-violet-500 active:border-violet-500 hover:bg-violet-500/10 active:bg-violet-500/10 hover:shadow-sm active:shadow-sm transition-all h-[60px]">
                <div className="text-right flex-1">
                  <span className="block text-[11px] font-bold text-slate-700 ">إنستاباي</span>
                  <span className="block text-[9px] text-slate-400  transition-colors">تحويل بنكي</span>
                </div>
                <div className="shrink-0 w-14 h-8 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform ">
                  <img src="/instapay.png" alt="InstaPay" className="w-full h-full object-contain" />
                </div>
              </button>
              <button onMouseDown={() => startPress('01012345678', 'محفظة كاش', 'vodafone')} onMouseUp={cancelPress} onMouseLeave={cancelPress} onTouchStart={() => startPress('01012345678', 'محفظة كاش', 'vodafone')} onTouchEnd={cancelPress} onClick={(e) => handleNumberClick(e, 'vodafone')} className="group/btn bg-white border-2 border-slate-100 rounded-xl p-2 flex flex-row-reverse items-center justify-between gap-1 hover:border-red-500 active:border-red-500 hover:bg-red-500/10 active:bg-red-500/10 hover:shadow-sm active:shadow-sm transition-all h-[60px]">
                <div className="text-right flex-1">
                  <span className="block text-[11px] font-bold text-slate-700 ">محفظة كاش</span>
                  <span className="block text-[9px] text-slate-400  transition-colors">موبايل</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-red-50/60 flex items-center justify-center text-red-500 group-hover/btn:scale-110 group-active/btn:scale-110 transition-all shrink-0">
                  <Wallet size={24} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ SOCIALS BOX ═══ */}
        <div className="relative mt-0.5 mb-1">
          <AnimatePresence>
            {activeTourStep === 'socials' && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-50"><div className="text-[10px] font-bold text-white bg-[#5D9CFF] px-6 py-1 rounded-full shadow-md">تواصل معنا</div></motion.div>)}
          </AnimatePresence>
          <div className={`w-full bg-white rounded-xl border-2 ${activeTourStep === 'socials' ? 'border-[#5D9CFF] shadow-lg' : 'border-slate-100 shadow-sm'} p-2 pt-3 transition-all duration-300`}>
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              <a href="tel:01000000000" onTouchStart={() => {}} className="flex flex-row-reverse items-center justify-center gap-1.5 bg-transparent rounded-xl p-2 group/subbtn hover:border-blue-500 active:border-blue-500 hover:bg-blue-500/10 active:bg-blue-500/10 transition-all h-12 bg-white border-2 border-slate-100">
                <span className="text-[11px] font-bold text-blue-600 ">موبايل</span>
                <Phone size={24} className="text-blue-500  group-hover/subbtn:scale-110 group-active/subbtn:scale-110 transition-all" />
              </a>
              <a href="https://wa.me/201000000000" target="_blank" onTouchStart={() => {}} className="flex flex-row-reverse items-center justify-center gap-1.5 bg-transparent rounded-xl p-2 group/subbtn hover:border-[#25D366] active:border-[#25D366] hover:bg-[#25D366]/10 active:bg-[#25D366]/10 transition-all h-12 bg-white border-2 border-slate-100">
                <span className="text-[11px] font-bold text-green-700 ">واتساب</span>
                <div className="w-6 h-6 shrink-0 group-hover/subbtn:scale-110 group-active/subbtn:scale-110 transition-transform">
                  <svg viewBox="0 0 175.216 175.552" className="w-full h-full"><path fill="#25D366" d="M87.608 0C39.254 0 0 39.254 0 87.608c0 15.484 4.069 29.992 11.191 42.534L0 175.552l46.849-11.023C58.86 171.5 72.803 175.216 87.608 175.216c48.354 0 87.608-39.254 87.608-87.608S135.962 0 87.608 0z"/><path fill="#FEFEFE" d="M130.6 113.2c-1.9 5.4-9.4 9.9-15.5 11.2-4.1.9-9.5 1.6-27.6-5.9-23.2-9.7-38.1-33.3-39.3-34.8-1.2-1.6-9.7-12.9-9.7-24.6 0-11.7 6.1-17.4 8.3-19.8 1.9-2.1 5-3.1 8-3.1.9 0 1.8 0 2.6.1 2.3.1 3.4.2 4.9 3.8 1.9 4.5 6.5 16.2 7.1 17.4.6 1.2 1.2 2.8.3 4.4-.8 1.7-1.5 2.4-2.7 3.8-1.2 1.4-2.3 2.4-3.5 3.9-1.1 1.2-2.3 2.6-1 4.8 1.3 2.2 5.8 9.6 12.5 15.5 8.6 7.7 15.8 10.1 18.2 11.2 1.8.8 3.9.6 5.3-.9 1.7-1.9 3.8-5.1 5.9-8.2 1.5-2.2 3.4-2.5 5.4-1.7 2 .8 12.8 6 15 7.1 2.2 1 3.7 1.5 4.2 2.5.6.9.6 5.3-1.3 10.6z"/></svg>
                </div>
              </a>
              <a href="tel:0220000000" onTouchStart={() => {}} className="flex flex-row-reverse items-center justify-center gap-1.5 bg-transparent rounded-xl p-2 group/subbtn hover:border-slate-400 active:border-slate-400 hover:bg-slate-500/10 active:bg-slate-500/10 transition-all h-12 bg-white border-2 border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 ">أرضي</span>
                <Phone size={24} className="text-slate-500  group-hover/subbtn:scale-110 group-active/subbtn:scale-110 transition-all" />
              </a>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <a href="https://facebook.com" target="_blank" onTouchStart={() => {}} className="flex flex-col items-center justify-center gap-1 bg-transparent rounded-xl p-1 group/btn hover:border-[#1877F2] active:border-[#1877F2] hover:bg-[#1877F2]/10 active:bg-[#1877F2]/10 transition-all h-[58px] bg-white border-2 border-slate-100">
                <div className="w-8 h-8 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform"><svg viewBox="0 0 24 24" className="w-full h-full"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path fill="white" d="M15.4 12l.5-3.3h-3.2V6.5c0-.9.4-1.8 1.9-1.8h1.4V1.8S14.8 1.6 13.5 1.6c-2.6 0-4.3 1.6-4.3 4.5v2.6H6.4V12h2.8v8h3.7v-8h2.5z" /></svg></div>
                <span className="text-[9px] font-bold text-slate-500 ">فيسبوك</span>
              </a>
              <a href="https://instagram.com" target="_blank" onTouchStart={() => {}} className="flex flex-col items-center justify-center gap-1 bg-transparent rounded-xl p-1 group/btn hover:border-[#cc2366] active:border-[#cc2366] hover:bg-[#cc2366]/10 active:bg-[#cc2366]/10 transition-all h-[58px] bg-white border-2 border-slate-100">
                <div className="w-8 h-8 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform"><svg viewBox="0 0 24 24" className="w-full h-full"><defs><linearGradient id="ig3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f09433" /><stop offset="50%" stopColor="#dc2743" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig3)" /><path fill="white" d="M12 7.7a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6zm0 7.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" /><circle fill="white" cx="17.3" cy="6.7" r="1.1" /><path fill="white" d="M17.3 3.5H6.7A3.2 3.2 0 0 0 3.5 6.7v10.6A3.2 3.2 0 0 0 6.7 20.5h10.6a3.2 3.2 0 0 0 3.2-3.2V6.7a3.2 3.2 0 0 0-3.2-3.2zM19 17.3a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 17.3V6.7A1.7 1.7 0 0 1 6.7 5h10.6a1.7 1.7 0 0 1 1.7 1.7v10.6z" /></svg></div>
                <span className="text-[9px] font-bold text-slate-500 ">إنستا</span>
              </a>
              <a href="https://maps.google.com/?q=%D8%B5%D9%8A%D8%AF%D9%84%D9%8A%D8%A9+%D8%AF+%D8%A5%D9%8A%D9%85%D8%A7%D9%86+%D8%B9%D8%A8%D8%AF+%D8%A7%D9%84%D9%88%D9%87%D8%A7%D8%A8" target="_blank" onTouchStart={() => {}} className="flex flex-col items-center justify-center gap-1 bg-transparent rounded-xl p-1 group/btn hover:border-[#EA4335] active:border-[#EA4335] hover:bg-[#EA4335]/10 active:bg-[#EA4335]/10 transition-all h-[58px] bg-white border-2 border-slate-100">
                <div className="group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform"><svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg></div>
                <span className="text-[9px] font-bold text-slate-500 ">الموقع</span>
              </a>
              <button onClick={handleInstallClick} onTouchStart={() => {}} className="flex flex-col items-center justify-center gap-1 bg-transparent rounded-xl p-1 group/btn hover:border-slate-400 active:border-slate-400 hover:bg-slate-500/10 active:bg-slate-500/10 transition-all h-[58px] relative bg-white border-2 border-slate-100">
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <div className="w-6 h-6 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform "><img src="/logo.png" alt="Logo" className="w-full h-full object-contain" /></div>
                <span className="text-[9px] font-bold text-slate-500  whitespace-nowrap">تثبيت App</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAP */}
        <button onClick={onMapClick} onTouchStart={() => {}} className="w-full h-[52px] rounded-xl overflow-hidden relative group/map shadow-sm hover:shadow-md active:shadow-md transition-all border border-slate-100 shrink-0">
          <img src="/map_preview.png" alt="Map" className="w-full h-full object-cover group-hover/map:scale-105 group-active/map:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-slate-900/40 group-hover/map:bg-slate-900/25 transition-colors flex items-center justify-center">
            <div className="bg-slate-900/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 group-hover/map:scale-105 transition-transform">
              <MapPin size={14} /> اضغط لفتح الخريطة
            </div>
          </div>
        </button>

      </div>
    </>
  );
}