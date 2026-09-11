'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface OffersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  offers?: any[];
}

export default function OffersDrawer({ isOpen, onClose, offers = [] }: OffersDrawerProps) {
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  const handleClose = () => {
    setSelectedOffer(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col h-[95vh]"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-3 pb-2 bg-slate-50 border-b border-slate-100 relative" onClick={!selectedOffer ? handleClose : () => {}}>
              <div className="w-12 h-1.5 bg-slate-300 rounded-full cursor-pointer"></div>
              
              {!selectedOffer ? (
                <button onClick={handleClose} className="absolute left-4 top-3 text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              ) : (
                <button onClick={() => setSelectedOffer(null)} className="absolute left-4 top-3 text-slate-400 hover:text-slate-600 flex items-center">
                  <ArrowRight size={20} />
                </button>
              )}

              <h3 className="absolute right-4 top-2.5 font-bold text-slate-800 flex items-center">
                <ShoppingBag size={16} className="ml-1 text-yellow-500" />
                {selectedOffer ? 'تفاصيل العرض' : 'العروض الحصرية'}
              </h3>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto flex-1 relative bg-slate-50">
              <AnimatePresence mode="wait">
                {!selectedOffer ? (
                  <motion.div 
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-4 pb-10"
                  >
                    {offers.map(offer => (
                      <div 
                        key={offer.id} 
                        onClick={() => setSelectedOffer(offer)}
                        className="flex bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98]"
                      >
                        <div className="w-1/3 relative h-28 bg-slate-200">
                          <img src={offer.img_url || offer.img || '/logo.png'} alt={offer.title} className="w-full h-full object-cover" onError={(e: any) => { e.target.src = '/logo.png'; }} />
                          <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                            عرض!
                          </div>
                        </div>
                        <div className="w-2/3 p-3 flex flex-col justify-between">
                          <h4 className="font-bold text-sm text-slate-800 leading-tight">{offer.title}</h4>
                          <div className="flex justify-between items-end mt-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 line-through">{offer.old_price || offer.oldPrice} ج.م</span>
                              <span className="font-black text-blue-700 text-lg leading-none">{offer.price} ج.م</span>
                            </div>
                            <div className="text-blue-500 bg-blue-50 p-1.5 rounded-full">
                                <ArrowLeft size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="w-full text-center text-xs text-slate-400 mt-6 pb-4">
                      يتم تحديث العروض باستمرار.. تابعنا!
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col h-full bg-white pb-6"
                  >
                    <div className="relative w-full h-64 bg-slate-100">
                      <img src={selectedOffer.img_url || selectedOffer.img || '/logo.png'} alt={selectedOffer.title} className="w-full h-full object-contain p-4" onError={(e: any) => { e.target.src = '/logo.png'; }} />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{selectedOffer.title}</h2>
                      <div className="flex items-center space-x-4 space-x-reverse mb-6">
                        <span className="text-3xl font-black text-blue-700">{selectedOffer.price} ج.م</span>
                        {(selectedOffer.old_price || selectedOffer.oldPrice) && (
                          <span className="text-lg text-slate-400 line-through bg-slate-100 px-2 py-1 rounded-lg">
                            {selectedOffer.old_price || selectedOffer.oldPrice} ج.م
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-8 flex-1">
                        <h4 className="font-bold text-emerald-800 mb-2">معلومات العرض:</h4>
                        <p id="offer-desc" className="text-sm text-emerald-700 leading-relaxed">
                          هذا العرض حصري ومتاح لفترة محدودة داخل صيدلية د. إيمان عبد الوهاب. اطلب الآن قبل نفاذ الكمية أو انتهاء فترة العرض.
                        </p>
                      </div>

                      <div className="flex flex-col space-y-3">
                        <a 
                          href={`https://wa.me/20100000000?text=${encodeURIComponent('مرحباً، أريد طلب العرض: ' + selectedOffer.title)}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-full bg-green-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/30"
                        >
                          اطلب الآن عبر واتساب
                        </a>
                        <button 
                          onClick={() => setSelectedOffer(null)}
                          className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
                        >
                          رجوع للعروض
                        </button>
                        <button 
                          onClick={handleClose}
                          className="w-full bg-transparent text-slate-400 font-bold py-2 rounded-xl hover:text-slate-600 active:scale-95 transition-all text-sm"
                        >
                          العودة للرئيسية
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
