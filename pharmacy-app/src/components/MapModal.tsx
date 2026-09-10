'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { useEffect } from 'react';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] sm:max-w-4xl bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md relative z-10">
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
              <h3 className="font-bold text-slate-800 flex items-center">
                خريطة الصيدلية التفاعلية
                <MapPin className="mr-2 text-red-500" size={18} />
              </h3>
            </div>

            {/* Iframe / 3D Viewer Container */}
            <div className="flex-1 w-full bg-slate-100 relative min-h-[60vh] sm:min-h-[70vh]">
              {/* Fallback Image or Iframe */}
              {/* Replace src with your actual 3D viewer or Google Maps Embed URL */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.666113888825!2d31.1554559!3d29.9984166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU5JzU0LjMiTiAzMcKwMDknMTkuNiJF!5e0!3m2!1sen!2seg!4v1690000000000!5m2!1sen!2seg" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>
              
              {/* Loading Overlay (Optional, if using 3D scripts) */}
              {/* <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 backdrop-blur-sm pointer-events-none">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div> */}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600 font-medium">
                شارع أولاد غنيم، متفرع من شارع حسن محمد، فيصل
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
