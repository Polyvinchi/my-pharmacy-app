const fs = require('fs');
const path = require('path');
const actionGridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');

let content = \
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, HeartPulse, Pill, Stethoscope, Wallet, MapPin, Phone, Search, Weight, Bike, ShoppingBag, CreditCard, Download } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ActionGridProps {
  activeTourStep: 'splash' | 'payments' | 'socials' | 'services' | 'finished';
  onMapClick: () => void;
  settings?: any;
}

export default function ActionGrid({ activeTourStep, onMapClick, settings }: ActionGridProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [enlargedNumber, setEnlargedNumber] = useState<{ number: string, label: string } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressFired = useRef<boolean>(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setToast('\\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642 \\u0645\\u062B\\u0628\\u062A \\u0628\\u0627\\u0644\\u0641\\u0639\\u0644!'); // App already installed
      setTimeout(() => setToast(null), 2500);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const startPress = (num: string, label: string) => {
    longPressFired.current = false;
    timerRef.current = setTimeout(() => {
      longPressFired.current = true;
      setEnlargedNumber({ number: num, label });
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleNumberClick = (e: React.MouseEvent, num: string, type: 'instapay' | 'vodafone') => {
    if (longPressFired.current) {
      e.preventDefault();
      return;
    }
    navigator.clipboard.writeText(num).then(() => {
      if (type === 'instapay') {
        setToast('\\u062A\\u0645 \\u0646\\u0633\\u062E \\u0631\\u0642\\u0645 \\u0625\\u0646\\u0633\\u062A\\u0627\\u0628\\u0627\\u064A');
        setTimeout(() => {
          window.location.href = 'instapay://';
        }, 1000);
      } else {
        setToast('\\u062A\\u0645 \\u0646\\u0633\\u062E \\u0631\\u0642\\u0645 \\u0645\\u062D\\u0641\\u0638\\u0629 \\u0643\\u0627\\u0634');
        setTimeout(() => {
          window.location.href = \	el:\\;
        }, 1000);
      }
      setTimeout(() => setToast(null), 2500);
    });
  };

  const formatNumberGroups = (num: string) => {
    if (num.length === 11) return [num.slice(0,3), num.slice(3,7), num.slice(7)];
    if (num.length === 10) return [num.slice(0,2), num.slice(2,6), num.slice(6)];
    return [num];
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 relative gap-2 pb-24 flex flex-col justify-start z-20 group/grid">
      
      {/* Enlarged Number Modal */}
      <AnimatePresence>
        {enlargedNumber && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setEnlargedNumber(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative border-4 border-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
              <h3 className="text-xl font-bold text-slate-500 mb-6">{enlargedNumber.label}</h3>
              <div className="flex justify-center items-center gap-3 dir-ltr font-mono text-4xl sm:text-5xl font-black text-blue-700 tracking-wider">
                {formatNumberGroups(enlargedNumber.number).map((grp, i) => (
                  <span key={i} className="bg-blue-50 px-3 py-2 rounded-xl">{grp}</span>
                ))}
              </div>
              <p className="mt-8 text-sm text-slate-400 font-medium">\\u0627\\u0636\\u063A\\u0637 \\u0641\\u064A \\u0623\\u064A \\u0645\\u0643\\u0627\\u0646 \\u0644\\u0644\\u0625\\u063A\\u0644\\u0627\\u0642</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 flex items-center gap-2 border-2 border-white min-w-max"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse shrink-0" />
            <span className="text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Section */}
      <div className="mb-2 w-full relative shrink-0">
        <div className="flex justify-between items-center mb-1">
          <div /> {/* Spacer to push to right */}
          <h3 className="text-xs font-bold text-blue-600 flex items-center">
            \\u062E\\u062F\\u0645\\u0627\\u062A\\u0646\\u0627 \\u0627\\u0644\\u0637\\u0628\\u064A\\u0629 <Activity size={14} className="ml-1" />
          </h3>
        </div>
        <div 
          className={\g-white rounded-2xl p-2.5 border-2 transition-all duration-300 relative group/section cursor-pointer shrink-0 group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50 \\}
        >
          {activeTourStep === 'services' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap shadow-lg border border-blue-200 z-50 animate-bounce">
              \\u0627\\u0643\\u062A\\u0634\\u0641 \\u062E\\u062F\\u0645\\u0627\\u062A\\u0646\\u0627 \\u0627\\u0644\\u0645\\u062E\\u062A\\u0644\\u0641\\u0629!
            </div>
          )}

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { icon: HeartPulse, label: '\\u0642\\u064A\\u0627\\u0633 \\u0636\\u063A\\u0637', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700' },
              { icon: Activity, label: '\\u0633\\u0643\\u0631 \\u062F\\u0645', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700' },
              { icon: Pill, label: '\\u062A\\u0648\\u0641\\u064A\\u0631 \\u0646\\u0648\\u0627\\u0642\\u0635', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700' },
              { icon: Stethoscope, label: '\\u0627\\u0633\\u062A\\u0634\\u0627\\u0631\\u0629', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700' },
              { icon: CreditCard, label: 'Visa', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700' },
              { icon: Bike, label: '\\u062A\\u0648\\u0635\\u064A\\u0644', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700' },
              { custom: 'talabat', label: '\\u0637\\u0644\\u0628\\u0627\\u062A', color: 'text-blue-600', hoverBg: 'hover:bg-orange-50', hoverText: 'hover:text-orange-600' },
              { icon: Weight, label: 'InBody', color: 'text-blue-600', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-700' }
            ].map((service, i) => (
              <div key={i} className={\lex flex-col items-center justify-center py-2 px-1 bg-slate-50 rounded-xl border border-transparent active:scale-95 transition-all select-none \ \\}>
                {service.custom === 'talabat' ? (
                  <div className="w-8 h-8 bg-[#FF5A00] rounded-xl flex items-center justify-center mb-1.5 shadow-sm">
                    <span className="text-white font-black text-[9px] tracking-tighter">talabat</span>
                  </div>
                ) : (
                  service.icon && <service.icon className={\w-8 h-8 mb-1.5 \\} />
                )}
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight whitespace-nowrap">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mb-2 w-full relative shrink-0">
        <h3 className="text-right text-[10px] font-bold text-slate-400 mb-1">
          \\u0627\\u0644\\u062F\\u0641\\u0639 \\u0627\\u0644\\u0625\\u0644\\u0643\\u062A\\u0631\\u0648\\u0646\\u064A (\\u0627\\u0636\\u063A\\u0637 \\u0644\\u0644\\u0646\\u0633\\u062E)
        </h3>
        <div 
          className={\elative rounded-2xl transition-all duration-300 border-2 p-2 group/section cursor-pointer group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50 \\}
        >
          {activeTourStep === 'payments' && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap shadow-lg border border-blue-200 z-50 animate-bounce">
              \\u0627\\u0636\\u063A\\u0637 \\u0644\\u0644\\u0646\\u0633\\u062E (\\u0625\\u0646\\u0633\\u062A\\u0627\\u0628\\u0627\\u064A \\u0623\\u0648 \\u0643\\u0627\\u0634)
            </div>
          )}

          <div className="absolute -top-6 left-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center shadow-sm border border-amber-100">
             \\u0636\\u063A\\u0637\\u0629 \\u0645\\u0637\\u0648\\u0644\\u0629 \\u0644\\u062A\\u0643\\u0628\\u064A\\u0631 \\u0627\\u0644\\u0631\\u0642\\u0645 <Search size={10} className="ml-1" />
          </div>
          
          <div className="flex gap-2">
            <div 
              onMouseDown={() => startPress(settings?.instapay_number || '01000000000', '\\u0631\\u0642\\u0645 \\u0625\\u0646\\u0633\\u062A\\u0627\\u0628\\u0627\\u064A')}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={() => startPress(settings?.instapay_number || '01000000000', '\\u0631\\u0642\\u0645 \\u0625\\u0646\\u0633\\u062A\\u0627\\u0628\\u0627\\u064A')}
              onTouchEnd={cancelPress}
              onClick={(e) => handleNumberClick(e, settings?.instapay_number || '01000000000', 'instapay')}
              className="flex-1 flex items-center justify-between p-2 bg-white border-2 border-slate-100 rounded-xl shadow-sm transition-all hover:bg-purple-50 hover:border-purple-200 active:scale-95 select-none cursor-pointer group/btn"
            >
              <div className="flex flex-col items-start w-full">
                <span className="font-black text-slate-800 text-sm group-hover/btn:text-purple-800 transition-colors">\\u0625\\u0646\\u0633\\u062A\\u0627\\u0628\\u0627\\u064A</span>
                <span className="text-[10px] text-slate-400 font-medium">\\u062A\\u062D\\u0648\\u064A\\u0644 \\u0628\\u0646\\u0643\\u064A</span>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                <span className="font-black italic text-purple-700 tracking-tighter text-[10px]">insta<span className="text-orange-500">pay</span></span>
              </div>
            </div>

            <div 
              onMouseDown={() => startPress(settings?.vodafone_cash_number || '01000000000', '\\u0631\\u0642\\u0645 \\u0645\\u062D\\u0641\\u0638\\u0629 \\u0643\\u0627\\u0634')}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={() => startPress(settings?.vodafone_cash_number || '01000000000', '\\u0631\\u0642\\u0645 \\u0645\\u062D\\u0641\\u0638\\u0629 \\u0643\\u0627\\u0634')}
              onTouchEnd={cancelPress}
              onClick={(e) => handleNumberClick(e, settings?.vodafone_cash_number || '01000000000', 'vodafone')}
              className="flex-1 flex items-center justify-between p-2 bg-white border-2 border-slate-100 rounded-xl shadow-sm transition-all hover:bg-red-50 hover:border-red-200 active:scale-95 select-none cursor-pointer group/btn"
            >
              <div className="flex flex-col items-start w-full">
                <span className="font-black text-slate-800 text-sm group-hover/btn:text-red-700 transition-colors">\\u0645\\u062D\\u0641\\u0638\\u0629 \\u0643\\u0627\\u0634</span>
                <span className="text-[10px] text-slate-400 font-medium">\\u0645\\u0648\\u0628\\u0627\\u064A\\u0644</span>
              </div>
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                <Wallet className="text-red-500 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Socials & Others Row */}
      <div 
        className={\elative transition-all duration-300 border-2 rounded-2xl p-2 shrink-0 bg-white group/section cursor-pointer group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50 \\}
      >
        {activeTourStep === 'socials' && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap shadow-lg border border-blue-200 z-50 animate-bounce">
            \\u062A\\u0648\\u0627\\u0635\\u0644 \\u0645\\u0639\\u0646\\u0627 \\u0628\\u0643\\u0644 \\u0633\\u0647\\u0648\\u0644\\u0629!
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-2">
          <a href={\	el:\\} className="w-full flex items-center justify-center py-2 px-2 bg-blue-50 border-2 border-blue-100 rounded-xl shadow-sm hover:bg-blue-100 hover:border-blue-300 active:scale-95 transition-all select-none">
            <span className="font-bold text-blue-700 text-xs mr-2">\\u0645\\u0648\\u0628\\u0627\\u064A\\u0644</span>
            <Phone size={16} className="text-blue-600" />
          </a>
          <a href={\https://wa.me/\\} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center py-2 px-2 bg-green-50 border-2 border-green-100 rounded-xl shadow-sm hover:bg-green-100 hover:border-green-300 active:scale-95 transition-all select-none">
            <span className="font-bold text-green-700 text-xs mr-2">\\u0648\\u0627\\u062A\\u0633\\u0627\\u0628</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
          </a>
          <a href={\	el:\\} className="w-full flex items-center justify-center py-2 px-2 bg-slate-50 border-2 border-slate-100 rounded-xl shadow-sm hover:bg-slate-100 hover:border-slate-300 active:scale-95 transition-all select-none">
            <span className="font-bold text-slate-600 text-xs mr-2">\\u0623\\u0631\\u0636\\u064A</span>
            <Phone size={16} className="text-slate-500" />
          </a>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <a href={settings?.facebook_url || '#'} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:bg-blue-50 hover:border-blue-300 active:scale-95 transition-all group/btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold text-slate-500 group-hover/btn:text-blue-600 transition-colors">\\u0641\\u064A\\u0633\\u0628\\u0648\\u0643</span>
          </a>
          <a href={settings?.instagram_url || '#'} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:bg-pink-50 hover:border-pink-300 active:scale-95 transition-all group/btn">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Instagram" className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold text-slate-500 group-hover/btn:text-pink-600 transition-colors">\\u0625\\u0646\\u0633\\u062A\\u0627</span>
          </a>
          <div onClick={onMapClick} className="flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all cursor-pointer group/btn">
            <MapPin size={24} className="text-red-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-500 group-hover/btn:text-red-600 transition-colors">\\u0627\\u0644\\u0645\\u0648\\u0642\\u0639</span>
          </div>
          <div onClick={handleInstallClick} className="flex flex-col items-center justify-center py-2.5 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:bg-amber-50 hover:border-amber-300 active:scale-95 transition-all cursor-pointer group/btn relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            <Download size={24} className="text-amber-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-500 group-hover/btn:text-amber-600 transition-colors">\\u062A\\u062B\\u0628\\u064A\\u062A App</span>
          </div>
        </div>
      </div>

      {/* Map Strip */}
      <div onClick={onMapClick} className="w-full h-12 sm:h-14 bg-white border-2 border-slate-100 rounded-2xl p-1 shadow-sm relative overflow-hidden cursor-pointer hover:border-slate-300 active:scale-95 transition-all shrink-0 mt-1 group/section group-hover/grid:opacity-50 hover:!opacity-100 hover:z-50">
        <div className="absolute inset-0 bg-slate-900/30 z-10 transition-all group-hover/section:bg-slate-900/10" />
        <div className="w-full h-full rounded-xl overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&h=200&fit=crop" alt="Map" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-1 group-hover/section:bg-red-600 transition-colors">
              \\u0627\\u0636\\u063A\\u0637 \\u0644\\u0641\\u062A\\u062D \\u0627\\u0644\\u062E\\u0631\\u064A\\u0637\\u0629 <MapPin size={12} className="text-white" />
            </span>
        </div>
      </div>

    </div>
  );
}
\;

fs.writeFileSync(actionGridPath, content, 'utf8');
