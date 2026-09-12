import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, X, ArrowRight, Package2, Info } from 'lucide-react';
import { useState } from 'react';

export default function OffersDrawer({ isOpen, handleClose, offers, whatsapp }: { isOpen: boolean, handleClose: () => void, offers: any[], whatsapp: string }) {
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Filter out inactive offers
  const activeOffers = offers.filter(o => o.is_active !== false);

  if (!isOpen && selectedOffer) {
    setTimeout(() => setSelectedOffer(null), 300);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-slate-50 rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col h-[95vh]"
          >
            {/* Handle Bar */}
            <div className="w-full bg-white border-b border-slate-100 flex flex-col items-center pt-3 pb-3 rounded-t-3xl relative z-10 shadow-sm">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full cursor-pointer mb-4" onClick={!selectedOffer ? handleClose : () => {}}></div>
              
              <div className="w-full px-5 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center text-lg leading-none">
                  <ShoppingBag size={18} className="ml-2 text-yellow-500" />
                  العروض الحصرية
                </h3>

                {!selectedOffer ? (
                  <button onClick={handleClose} className="text-slate-500 hover:text-slate-800 bg-slate-100 p-1.5 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                ) : (
                  <button onClick={() => { setSelectedOffer(null); setCurrentImgIndex(0); }} className="text-slate-500 hover:text-slate-800 bg-slate-100 p-1.5 rounded-full flex items-center transition-colors">
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
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
                    {activeOffers.map(offer => {
                      const displayPrice = offer.price || offer.discounted_price;
                      const oldPrice = offer.old_price || offer.original_price;
                      const primaryImg = offer.img_url || offer.images?.[0] || offer.img || '/logo.png';

                      return (
                        <div 
                          key={offer.id} 
                          onClick={() => setSelectedOffer(offer)}
                          className="flex bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                          <div className="w-1/3 relative h-32 bg-slate-100">
                            <img src={primaryImg} alt={offer.title} className="w-full h-full object-cover" onError={(e: any) => { e.target.src = '/logo.png'; }} />
                            {offer.discount_percentage ? (
                              <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-bl-xl shadow-sm">
                                -{offer.discount_percentage}%
                              </div>
                            ) : (
                              <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                عرض!
                              </div>
                            )}
                            {offer.bundle_items && offer.bundle_items.length > 0 && (
                              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                <Package2 size={10} /> عرض مجمع
                              </div>
                            )}
                          </div>
                          <div className="w-2/3 p-3 flex flex-col justify-between">
                            <h4 className="font-bold text-sm text-slate-800 leading-tight line-clamp-2">{offer.title}</h4>
                            <div className="flex justify-between items-end mt-2">
                              <div className="flex flex-col">
                                {oldPrice && <span className="text-[11px] text-slate-400 line-through">{oldPrice} ج.م</span>}
                                <span className="font-black text-blue-700 text-lg leading-none">{displayPrice} ج.م</span>
                              </div>
                              <div className="text-blue-500 bg-blue-50 p-1.5 rounded-full">
                                  <ArrowLeft size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {activeOffers.length === 0 && (
                      <div className="text-center text-slate-400 py-10 text-sm">لا توجد عروض متاحة حالياً.</div>
                    )}
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
                    className="flex flex-col h-full bg-slate-50 pb-10 overflow-y-auto"
                  >
                    {/* Carousel */}
                    <div className="relative w-full h-64 bg-white border-b border-slate-100">
                      {selectedOffer.discount_percentage && (
                        <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg">
                          خصم {selectedOffer.discount_percentage}%
                        </div>
                      )}
                      
                      <img 
                        src={selectedOffer.images && selectedOffer.images.length > 0 ? selectedOffer.images[currentImgIndex] : (selectedOffer.img_url || selectedOffer.img || '/logo.png')} 
                        alt={selectedOffer.title} 
                        className="w-full h-full object-contain p-2" 
                        onError={(e: any) => { e.target.src = '/logo.png'; }} 
                      />
                      
                      {selectedOffer.images && selectedOffer.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                          {selectedOffer.images.map((_: any, i: number) => (
                            <div 
                              key={i} 
                              onClick={() => setCurrentImgIndex(i)}
                              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === currentImgIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col pb-24">
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
                        <h2 className="text-xl font-black text-slate-800 mb-3 leading-tight">{selectedOffer.title}</h2>
                        
                        <div className="flex items-center space-x-4 space-x-reverse border-t border-slate-100 pt-3 mt-3">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-bold mb-0.5">السعر بعد الخصم</span>
                            <span className="text-3xl font-black text-blue-700 leading-none">{(selectedOffer.price || selectedOffer.discounted_price)} ج.م</span>
                          </div>
                          {((selectedOffer.old_price || selectedOffer.original_price)) && (
                            <div className="flex flex-col items-end flex-1">
                              <span className="text-xs text-slate-400 mb-0.5">السعر القديم</span>
                              <span className="text-lg text-slate-400 line-through font-medium">
                                {(selectedOffer.old_price || selectedOffer.original_price)} ج.م
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedOffer.bundle_items && selectedOffer.bundle_items.length > 0 && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-4">
                          <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <Package2 size={18} /> محتويات العرض المجمع:
                          </h4>
                          <ul className="space-y-2">
                            {selectedOffer.bundle_items.map((item: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                                <span className="text-blue-400 mt-1">•</span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-4">
                        <h4 className="font-bold text-emerald-800 mb-2">وصف العرض / التفاصيل:</h4>
                        <p id="offer-desc" className="text-sm text-emerald-700 leading-relaxed whitespace-pre-wrap">
                          {selectedOffer.description || "هذا العرض حصري لعملائنا من خلال التطبيق فقط. استمتع بخصم إضافي والتوصيل السريع."}
                        </p>
                      </div>

                      {/* Display condition text if exists */}
                      {selectedOffer.condition_text && (
                        <div className="bg-orange-50 text-orange-700 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 border border-orange-100">
                          <Info size={20} className="text-orange-500 shrink-0" />
                          <span className="leading-relaxed">{selectedOffer.condition_text}</span>
                        </div>
                      )}

                      <div className="flex flex-col space-y-3 mt-4">
                        <a 
                          href={`https://wa.me/${whatsapp.replace('+', '')}?text=${encodeURIComponent('مرحباً، أود طلب العرض: ' + selectedOffer.title)}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-full bg-green-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/20"
                        >
                          اطلب الآن عبر واتساب
                        </a>
                        <button 
                          onClick={() => { setSelectedOffer(null); setCurrentImgIndex(0); }}
                          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          العودة للعروض
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
