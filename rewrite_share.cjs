const fs = require('fs');
const path = require('path');

const sharePath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ShareModal.tsx');

const content = \
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '\\u0635\\u064A\\u062F\\u0644\\u064A\\u0629 \\u062F. \\u0625\\u064A\\u0645\\u0627\\u0646 \\u0639\\u0628\\u062F \\u0627\\u0644\\u0648\\u0647\\u0627\\u0628',
          text: '\\u0627\\u0643\\u062A\\u0634\\u0641 \\u062E\\u062F\\u0645\\u0627\\u062A\\u0646\\u0627 \\u0627\\u0644\\u0637\\u0628\\u064A\\u0629 \\u0648\\u0627\\u0644\\u0639\\u0631\\u0648\\u0636 \\u0627\\u0644\\u062D\\u0635\\u0631\\u064A\\u0629',
          url: window.location.href
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      setMsg('\\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629 \\u063A\\u064A\\u0631 \\u0645\\u062F\\u0639\\u0648\\u0645\\u0629 \\u0641\\u064A \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0645\\u062A\\u0635\\u0641\\u062D');
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setMsg('\\u0644\\u062A\\u062B\\u0628\\u064A\\u062A \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0622\\u064A\\u0641\\u0648\\u0646\\u060C \\u0627\\u0636\\u063A\\u0637 \\u0639\\u0644\\u0649 \\u0632\\u0631 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629 \\u062B\\u0645 Add to Home Screen');
      setTimeout(() => setMsg(null), 5000);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            
            <div className="bg-slate-50 p-6 flex flex-col items-center justify-center border-b border-slate-100 relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm"><X size={20} /></button>
              <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center mb-3 text-blue-600">
                <Share2 size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-800">\\u0634\\u0627\\u0631\\u0643 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642</h3>
              <p className="text-xs text-slate-500 mt-1">\\u0627\\u0645\\u0633\\u062D \\u0627\\u0644\\u0643\\u0648\\u062F \\u0623\\u0648 \\u0634\\u0627\\u0631\\u0643 \\u0627\\u0644\\u0631\\u0627\\u0628\\u0637 \\u0645\\u0639 \\u0623\\u0635\\u062F\\u0642\\u0627\\u0626\\u0643</p>
            </div>

            <div className="p-6 flex flex-col items-center">
              <div className="w-40 h-40 bg-white border-2 border-slate-100 rounded-2xl shadow-sm flex items-center justify-center mb-6 p-2">
                <img src="/qr.png" alt="QR Code" className="w-full h-full object-contain" />
              </div>

              {msg && <div className="text-xs font-bold text-red-500 mb-4 text-center">{msg}</div>}

              <div className="w-full flex gap-3 mb-3">
                <button onClick={handleShare} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-sm flex justify-center items-center gap-2 transition-colors">
                  <Share2 size={18} /> \\u0645\\u0634\\u0627\\u0631\\u0643\\u0629 \\u0639\\u0628\\u0631...
                </button>
                <button onClick={handleCopy} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-sm flex justify-center items-center gap-2 transition-colors">
                  {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />} 
                  {copied ? '\\u062A\\u0645 \\u0627\\u0644\\u0646\\u0633\\u062E' : '\\u0646\\u0633\\u062E \\u0627\\u0644\\u0631\\u0627\\u0628\\u0637'}
                </button>
              </div>

              <button onClick={handleInstall} className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-2xl font-bold text-sm flex justify-center items-center gap-2 transition-colors">
                <Download size={18} /> \\u062A\\u062B\\u0628\\u064A\\u062A \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642
              </button>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\;

fs.writeFileSync(sharePath, content, 'utf8');

// Also decode ActionGrid.tsx to remove any alert if present
let grid = fs.readFileSync(path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx'), 'utf8');
grid = grid.replace(/setToast\('???? ??? ?????? ?? ????? ???? ?? ????? ?????? ???????'\);/g, "setToast('\\u0644\\u062A\\u062B\\u0628\\u064A\\u062A \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0622\\u064A\\u0641\\u0648\\u0646\\u060C \\u0627\\u0636\\u063A\\u0637 \\u0639\\u0644\\u0649 \\u0632\\u0631 \\u0627\\u0644\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629 \\u062B\\u0645 Add to Home Screen');");
fs.writeFileSync(path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx'), grid, 'utf8');

console.log('ShareModal updated');
