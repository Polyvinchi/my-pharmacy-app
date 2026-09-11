const fs = require('fs');
const path = require('path');

// 1. Fix FacadeBanner
const facadePath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'FacadeBanner.tsx');
let facade = \
'use client';

import { Share2 } from 'lucide-react';
import Image from 'next/image';

interface FacadeBannerProps {
  onShareClick: () => void;
  settings?: any;
}

export default function FacadeBanner({ onShareClick, settings }: FacadeBannerProps) {
  // Use settings or fallback
  const bgImage = settings?.pharmacy_image || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800&h=400&fit=crop';
  const showLogo = settings?.show_logo !== false;
  const showTitle = settings?.show_title !== false;
  
  return (
    <div className="w-full relative z-30 shrink-0">
      <div className="pt-8 pb-6 px-4 relative overflow-hidden rounded-b-[2rem] shadow-md border-b border-white/20">
        
        {/* Crystal Clear Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: \\\url(\\\)\\\ }}
        />
        
        {/* Very Subtle Gradient for text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent" />
        <div className="absolute inset-0 z-0 bg-black/10" />

        <button 
          onClick={onShareClick}
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 active:scale-95 transition-all shadow-sm border border-white/30 z-20"
        >
          <Share2 size={18} />
        </button>

        <div className="flex flex-col items-center justify-center relative z-20 mt-2">
          {showLogo && (
            <div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-[1.5rem] shadow-xl mb-3 flex items-center justify-center overflow-hidden p-2 border-2 border-white/60">
              <Image 
                src="/logo.png" 
                alt="\\u0635\\u064A\\u062F\\u0644\\u064A\\u0629 \\u062F. \\u0625\\u064A\\u0645\\u0627\\u0646 \\u0639\\u0628\\u062F \\u0627\\u0644\\u0648\\u0647\\u0627\\u0628" 
                width={90} 
                height={90} 
                className="object-contain drop-shadow-sm"
              />
            </div>
          )}
          
          {showTitle && (
            <div className="text-center">
              <h1 className="text-white font-black text-2xl tracking-tight drop-shadow-lg shadow-black">
                \\u0635\\u064A\\u062F\\u0644\\u064A\\u0629 \\u062F. \\u0625\\u064A\\u0645\\u0627\\u0646 \\u0639\\u0628\\u062F \\u0627\\u0644\\u0648\\u0647\\u0627\\u0628
              </h1>
              <p className="text-blue-50 text-xs mt-1.5 font-bold drop-shadow-lg shadow-black">
                \\u0639\\u0631\\u0648\\u0636 \\u062D\\u0635\\u0631\\u064A\\u0629 \\u2022 \\u0627\\u0633\\u062A\\u0634\\u0627\\u0631\\u0627\\u062A \\u0645\\u062C\\u0627\\u0646\\u064A\\u0629 \\u2022 \\u062A\\u0648\\u0635\\u064A\\u0644 \\u0633\\u0631\\u064A\\u0639
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
\;
fs.writeFileSync(facadePath, facade, 'utf8');


// 2. Fix ActionGrid Tooltip style (vibrant blue, smooth fade instead of bounce) and align "??????? ??????"
const actionGridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(actionGridPath, 'utf8');

// Replace Tooltip styles globally
// From: bg-blue-100 text-blue-800 ... animate-bounce
// To: bg-blue-600 text-white ... animate-in fade-in slide-in-from-bottom-2 duration-500
grid = grid.replace(/bg-blue-100 text-blue-800 px-3 py-1\.5 rounded-xl font-bold text-xs whitespace-nowrap shadow-lg border border-blue-200 z-50 animate-bounce/g, 
  'bg-blue-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap shadow-xl border border-blue-500 z-50 transition-all duration-500 opacity-100 translate-y-0');

// Fix text alignment of "??????? ??????" to ensure it's right-aligned
// Current: <h3 className="text-xs font-bold text-blue-600 flex items-center">
grid = grid.replace(/<div className="flex justify-between items-center mb-1">[\s\S]*?<div \/> \{\/\* Spacer to push to right \*\/\}[\s\S]*?<h3 className="text-xs font-bold text-blue-600 flex items-center">/g, 
  \<div className="flex justify-end items-center mb-1 w-full text-right">
          <h3 className="text-xs font-bold text-blue-600 flex items-center justify-end dir-rtl w-full">\);

fs.writeFileSync(actionGridPath, grid, 'utf8');


// 3. Fix ShareModal.tsx to use pure native navigator.share without falling back to modal if it succeeds
const shareModalPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ShareModal.tsx');
let shareModal = \
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Facebook, MessageCircle, X, Share2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ShareModal({ isOpen, onClose, url, title }: any) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (navigator.share) {
        navigator.share({
          title: title,
          url: url
        }).then(() => onClose()).catch(console.error);
      }
    }
  }, [isOpen, url, title, onClose]);

  if (!isOpen) return null;

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
          className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200">
            <X size={16} />
          </button>
          
          <h3 className="text-lg font-black text-slate-800 mb-6 text-center">\\u0645\\u0634\\u0627\\u0631\\u0643\\u0629 \\u0627\\u0644\\u0635\\u064A\\u062F\\u0644\\u064A\\u0629</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <a href={\https://wa.me/?text=\\} target="_blank" rel="noreferrer" className="flex flex-col items-center p-4 bg-green-50 rounded-2xl text-green-700 hover:bg-green-100">
              <MessageCircle size={24} className="mb-2" />
              <span className="text-xs font-bold">\\u0648\\u0627\\u062A\\u0633\\u0627\\u0628</span>
            </a>
            <a href={\https://www.facebook.com/sharer/sharer.php?u=\\} target="_blank" rel="noreferrer" className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl text-blue-700 hover:bg-blue-100">
              <Facebook size={24} className="mb-2" />
              <span className="text-xs font-bold">\\u0641\\u064A\\u0633\\u0628\\u0648\\u0643</span>
            </a>
          </div>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 border-2 border-slate-100 transition-colors"
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
fs.writeFileSync(shareModalPath, shareModal, 'utf8');

console.log('All fixed!');
