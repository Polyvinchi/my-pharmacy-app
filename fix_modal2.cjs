const fs = require('fs');
const path = require('path');
const modalPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ShareModal.tsx');

let modal = \
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, MessageCircle, X, Share2, Check, Download, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ShareModal({ isOpen, onClose, url, title }: any) {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('\\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642 \\u0645\\u062B\\u0628\\u062A \\u0628\\u0627\\u0644\\u0641\\u0639\\u0644 \\u0623\\u0648 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645 \\u0639\\u0644\\u0649 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u062A\\u0635\\u0641\\u062D!');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title, url }).catch(console.error);
    } else {
      alert('\\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645\\u0629 \\u0641\\u064A \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u062A\\u0635\\u0641\\u062D');
    }
  };

  if (!isOpen) return null;

  const qrUrl = \\\https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\\\\\\;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative flex flex-col items-center"
        >
          <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 active:scale-95 transition-all">
            <X size={16} />
          </button>
          
          <h3 className="text-lg font-black text-slate-800 mb-6 text-center">\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629 \\u0627\\u0644\\u0635\\u064A\\u062F\\u0644\\u064A\\u0629</h3>
          
          {/* QR Code */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100 mb-6 flex flex-col items-center">
            <img src={qrUrl} alt="QR Code" className="w-24 h-24 rounded-xl" />
            <span className="text-[10px] font-bold text-slate-400 mt-2">\\u0627\\u0645\\u0633\\u062D \\u0627\\u0644\\u0643\\u0648\\u062F \\u0644\\u0644\\u0632\\u064A\\u0627\\u0631\\u0629</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4 w-full">
            <a href={\\\https://wa.me/?text=\\\\\\} target="_blank" rel="noreferrer" className="flex flex-col items-center p-3 bg-green-50 rounded-2xl text-green-700 hover:bg-green-100 active:scale-95 transition-all">
              <MessageCircle size={20} className="mb-1" />
              <span className="text-[10px] font-bold">\\u0648\\u0627\\u062A\\u0633\\u0627\\u0628</span>
            </a>
            <a href={\\\https://www.facebook.com/sharer/sharer.php?u=\\\\\\} target="_blank" rel="noreferrer" className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl text-blue-700 hover:bg-blue-100 active:scale-95 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="FB" className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">\\u0641\\u064A\\u0633\\u0628\\u0648\\u0643</span>
            </a>
            <button onClick={handleNativeShare} className="flex flex-col items-center p-3 bg-indigo-50 rounded-2xl text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all">
              <Share2 size={20} className="mb-1" />
              <span className="text-[10px] font-bold">\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629...</span>
            </button>
            <button onClick={handleInstallClick} className="flex flex-col items-center p-3 bg-amber-50 rounded-2xl text-amber-700 hover:bg-amber-100 active:scale-95 transition-all relative">
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <Download size={20} className="mb-1" />
              <span className="text-[10px] font-bold">\\u062A\\u062B\\u0628\\u064A\\u062A</span>
            </button>
          </div>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 border-2 border-slate-100 transition-colors active:scale-[0.98]"
          >
            <span className="text-sm font-bold text-slate-700">{copied ? '\\u062A\\u0645 \\u0627\\u0644\\u0646\\u0633\\u062E!' : '\\u0646\\u0633\\u062E \\u0627\\u0644\\u0631\\u0627\\u0628\\u0637'}</span>
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-slate-400" />}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
\;
fs.writeFileSync(modalPath, modal, 'utf8');
console.log('ShareModal rebuilt');
