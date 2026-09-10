'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

export default function ShareModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = "https://www.imanabdel.wehab.com"; // In real app, window.location.href

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'صيدلية د. إيمان عبد الوهاب',
          text: 'رعاية صحية متكاملة، عروض حصرية، وتوصيل سريع',
          url: url,
        });
        onClose();
      } catch (err) {
        console.log('Error sharing', err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-3xl p-6 z-[60] shadow-2xl flex flex-col items-center text-center"
          >
            <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Share2 size={24} />
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-1">شارك الصيدلية</h3>
            <p className="text-xs text-slate-500 mb-6">امسح الكود أو انسخ الرابط لمشاركته مع أصدقائك</p>
            
            <div className="p-3 bg-white border-2 border-slate-100 rounded-xl mb-6 shadow-sm">
              <QRCodeSVG value={url} size={150} level="H" includeMargin={false} fgColor="#0D47A1" />
            </div>
            
            <div className="w-full flex space-x-2 space-x-reverse mb-4">
              <button 
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 active:scale-95 transition-all"
              >
                <Copy size={16} />
                <span>{copied ? 'تم النسخ!' : 'انسخ الرابط'}</span>
              </button>
              
              {/* Native Web Share API Check */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button 
                  onClick={handleNativeShare}
                  className="flex-1 flex items-center justify-center space-x-2 space-x-reverse py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <Share2 size={16} />
                  <span>مشاركة عبر...</span>
                </button>
              )}
            </div>

            {/* PWA Install Placeholder */}
            <button className="w-full flex items-center justify-center space-x-2 space-x-reverse py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-900 active:scale-95 transition-all">
              <Download size={16} />
              <span>تثبيت التطبيق على الموبايل</span>
            </button>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
