'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface OffersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Offer { id: string | number; title: string; price: string; old_price?: string; oldPrice?: string; img_url?: string; img?: string; }
export default function OffersDrawer({ isOpen, onClose, offers = [] }: OffersDrawerProps & { offers?: Offer[] }) {
  

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col h-[95vh]"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-3 pb-2 bg-slate-50 border-b border-slate-100 relative" onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
              <button onClick={onClose} className="absolute left-4 top-3 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
              <h3 className="absolute right-4 top-2.5 font-bold text-slate-800 flex items-center">
                <ShoppingBag size={16} className="ml-1 text-yellow-500" />
                العروض الحصرية
              </h3>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto p-4 space-y-4 pb-10">
              {offers.map(offer => (
                <div key={offer.id} className="flex bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="w-1/3 relative h-28 bg-slate-200">
                    <Image src={offer.img_url || offer.img || '/map_preview.png'} alt={offer.title} fill sizes="(max-width: 768px) 33vw, 150px" className="object-cover" />
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      خصم 
                    </div>
                  </div>
                  <div className="w-2/3 p-3 flex flex-col justify-between">
                    <h4 className="font-bold text-sm text-slate-800 leading-tight">{offer.title}</h4>
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through">{offer.old_price || offer.oldPrice}</span>
                        <span className="font-black text-blue-700 text-lg leading-none">{offer.price}</span>
                      </div>
                      <a href={`https://wa.me/20100000000?text=أريد طلب العرض: ${offer.title}`} target="_blank" rel="noreferrer" className="bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-600 active:scale-95 transition-transform">
                        اطلب الآن
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="w-full text-center text-xs text-slate-400 mt-6 pb-4">
                يتم تحديث العروض باستمرار.. تابعنا!
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
