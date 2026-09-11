
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { canInstall, install: pwaInstall } = usePWAInstall();
  const [msg, setMsg] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'صيدلية د. إيمان عبد الوهاب',
          text: 'اكتشف خدماتنا الطبية والعروض الحصرية',
          url
        });
      } catch (err) { console.log(err); }
    } else {
      await handleCopy();
    }
  };

  const handleInstall = async () => {
    if (!canInstall) {
      setMsg('لتثبيت التطبيق على الآيفون، اضغط على زر المشاركة ثم Add to Home Screen');
      setTimeout(() => setMsg(null), 5000); return;
    }
    await pwaInstall();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[2rem] w-full max-w-[340px] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="bg-slate-50 p-5 flex flex-col items-center border-b border-slate-100 relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                <X size={18} />
              </button>
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-2 text-blue-600">
                <Share2 size={22} />
              </div>
              <h3 className="text-base font-black text-slate-800">شارك التطبيق</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">امسح الكود أو شارك الرابط مع أصدقائك</p>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col items-center">
              {/* QR Code - generated dynamically */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 shadow-sm mb-4">
                {url ? (
                  <QRCodeSVG
                    value={url}
                    size={150}
                    bgColor="#ffffff"
                    fgColor="#1e293b"
                    level="M"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-[150px] h-[150px] flex items-center justify-center text-slate-300 text-xs">جاري التحميل...</div>
                )}
              </div>

              {msg && (
                <div className="text-[10px] font-bold text-orange-600 mb-3 text-center px-3 py-2 bg-orange-50 rounded-xl border border-orange-100 w-full">{msg}</div>
              )}

              {/* Action buttons */}
              <div className="w-full flex gap-2 mb-2">
                <button onClick={handleShare} className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-1.5 transition-colors">
                  <Share2 size={16} /> مشاركة عبر...
                </button>
                <button onClick={handleCopy} className="flex-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-1.5 transition-colors">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  {copied ? 'تم النسخ' : 'نسخ الرابط'}
                </button>
              </div>

              <button onClick={handleInstall} className="w-full bg-slate-900 hover:bg-black active:bg-black text-white py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-colors">
                <Download size={16} /> تثبيت التطبيق
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
