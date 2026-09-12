const fs = require('fs');

const gridCode = 'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';

interface ActionGridProps {
  activeTourStep?: 'splash' | 'payments' | 'socials' | 'services' | 'finished';
  onMapClick: () => void;
  pharmacy?: any;
  sections?: any[];
}

export default function ActionGrid({ activeTourStep, onMapClick, pharmacy, sections = [] }: ActionGridProps) {
  
  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order);

  const getIcon = (name: string, fallbackSize: number = 24) => {
    if (name === 'WhatsappNative') return <svg viewBox="0 0 175.216 175.552" className="w-6 h-6"><path fill="#25D366" d="M87.608 0C39.254 0 0 39.254 0 87.608c0 15.484 4.069 29.992 11.191 42.534L0 175.552l46.849-11.023C58.86 171.5 72.803 175.216 87.608 175.216c48.354 0 87.608-39.254 87.608-87.608S135.962 0 87.608 0z"/><path fill="#FEFEFE" d="M130.6 113.2c-1.9 5.4-9.4 9.9-15.5 11.2-4.1.9-9.5 1.6-27.6-5.9-23.2-9.7-38.1-33.3-39.3-34.8-1.2-1.6-9.7-12.9-9.7-24.6 0-11.7 6.1-17.4 8.3-19.8 1.9-2.1 5-3.1 8-3.1.9 0 1.8 0 2.6.1 2.3.1 3.4.2 4.9 3.8 1.9 4.5 6.5 16.2 7.1 17.4.6 1.2 1.2 2.8.3 4.4-.8 1.7-1.5 2.4-2.7 3.8-1.2 1.4-2.3 2.4-3.5 3.9-1.1 1.2-2.3 2.6-1 4.8 1.3 2.2 5.8 9.6 12.5 15.5 8.6 7.7 15.8 10.1 18.2 11.2 1.8.8 3.9.6 5.3-.9 1.7-1.9 3.8-5.1 5.9-8.2 1.5-2.2 3.4-2.5 5.4-1.7 2 .8 12.8 6 15 7.1 2.2 1 3.7 1.5 4.2 2.5.6.9.6 5.3-1.3 10.6z"/></svg>;
    if (name === 'FacebookNative') return <svg viewBox="0 0 24 24" className="w-8 h-8"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path fill="white" d="M15.4 12l.5-3.3h-3.2V6.5c0-.9.4-1.8 1.9-1.8h1.4V1.8S14.8 1.6 13.5 1.6c-2.6 0-4.3 1.6-4.3 4.5v2.6H6.4V12h2.8v8h3.7v-8h2.5z" /></svg>;
    if (name === 'InstagramNative') return <svg viewBox="0 0 24 24" className="w-8 h-8"><defs><linearGradient id="ig3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f09433" /><stop offset="50%" stopColor="#dc2743" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig3)" /><path fill="white" d="M12 7.7a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6zm0 7.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" /><circle fill="white" cx="17.3" cy="6.7" r="1.1" /><path fill="white" d="M17.3 3.5H6.7A3.2 3.2 0 0 0 3.5 6.7v10.6A3.2 3.2 0 0 0 6.7 20.5h10.6a3.2 3.2 0 0 0 3.2-3.2V6.7a3.2 3.2 0 0 0-3.2-3.2zM19 17.3a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 17.3V6.7A1.7 1.7 0 0 1 6.7 5h10.6a1.7 1.7 0 0 1 1.7 1.7v10.6z" /></svg>;
    if (name === 'GoogleMapsNative') return <svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>;
    if (name === 'AppLogo') return <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />;

    const Icon = (LucideIcons as any)[name] || LucideIcons.Activity;
    return <Icon size={fallbackSize} strokeWidth={2} className="shrink-0" />;
  }

  const renderItemAction = (item: any, children: React.ReactNode, className: string) => {
    if (item.action_type === 'link') {
      return <a key={item.id} href={item.action_value} target="_blank" className={className}>{children}</a>
    }
    if (item.action_type === 'whatsapp') {
      const waNumber = pharmacy?.social_links?.whatsapp?.replace(/\\D/g, "") || "201000000000";
      return <a key={item.id} href={\https://wa.me/\?text=\\} target="_blank" className={className}>{children}</a>
    }
    if (item.action_type === 'modal' && item.action_value === 'map') {
      return <button key={item.id} onClick={onMapClick} className={className}>{children}</button>
    }
    if (item.action_type === 'modal' && item.action_value === 'install') {
      return <button key={item.id} className={className}>{children}</button>
    }
    return <button key={item.id} className={className}>{children}</button>
  }

  const svcCell = (index: number) => \lex flex-col items-center justify-center bg-transparent rounded-xl p-2 group/btn hover:bg-slate-50 transition-all h-20 active:bg-blue-50 \\;
  const payCell = "flex flex-col items-center justify-center bg-transparent rounded-xl p-2 group/subbtn hover:border-slate-300 transition-all h-16 bg-white border-2 border-slate-100";

  return (
    <div className="flex-1 w-full bg-slate-50 overflow-y-auto overflow-x-hidden pt-8 px-4 rounded-t-[1.5rem] relative sm:rounded-none">
      
      {/* Search */}
      <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md pt-2 pb-4 -mx-1 px-1">
        <div className="relative w-full">
          <LucideIcons.Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="???? ?? ????? ?????? ?? ????..." 
            className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 pr-12 pl-4 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            dir="rtl"
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-lg">???</div>
        </div>
      </div>

      <div className="mt-4 space-y-6 px-1 relative z-10 w-full mb-24 pb-8">
        
        {sortedSections.map(sec => {
          if (!sec.is_visible) return null;
          const items = sec.section_items ? [...sec.section_items].sort((a,b) => a.sort_order - b.sort_order) : [];

          if (sec.section_key === 'services') {
            return (
              <div key={sec.id} className="w-full">
                <div className="flex justify-between items-end mb-3 px-1">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                    {sec.display_name}
                  </h3>
                </div>
                <div className={\w-full bg-white rounded-xl border-2 \ p-2 transition-all duration-300\}>
                  <div className="grid grid-cols-4 gap-1.5">
                    {items.map((item, idx) => (
                      renderItemAction(item, (
                        <>
                          <div className="text-blue-600 mb-1.5 group-hover/btn:scale-110 group-active/btn:scale-95 transition-transform drop-shadow-sm">
                            {getIcon(item.icon_name, 27)}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 text-center leading-tight">{item.label}</span>
                        </>
                      ), svcCell(idx))
                    ))}
                  </div>
                </div>
              </div>
            )
          }

          if (sec.section_key === 'payments') {
            return (
              <div key={sec.id} className="w-full">
                <div className="flex justify-between items-end mb-3 px-1">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-purple-500 rounded-full"></span>
                    {sec.display_name}
                  </h3>
                </div>
                <div className={\grid grid-cols-2 gap-3 transition-all duration-300 \\}>
                  {items.map(item => (
                    renderItemAction(item, (
                      <>
                        <div className="text-slate-600 mb-1 group-hover/subbtn:text-purple-600 transition-colors">
                          {getIcon(item.icon_name, 24)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
                      </>
                    ), payCell)
                  ))}
                </div>
              </div>
            )
          }

          if (sec.section_key === 'socials') {
            return (
              <div key={sec.id} className="w-full">
                <div className="flex justify-between items-end mb-3 px-1">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                    {sec.display_name}
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-4 gap-1.5">
                    {items.map((item) => {
                       // Beautiful custom rendering for socials
                       let customClass = "flex flex-col items-center justify-center gap-1 bg-transparent rounded-xl p-1 group/btn h-[58px] bg-white border-2 border-slate-100 transition-all ";
                       let innerClass = "group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform flex items-center justify-center";
                       
                       if (item.icon_name === 'FacebookNative') customClass += "hover:border-[#1877F2] hover:bg-[#1877F2]/10";
                       else if (item.icon_name === 'InstagramNative') customClass += "hover:border-[#cc2366] hover:bg-[#cc2366]/10";
                       else if (item.icon_name === 'GoogleMapsNative') customClass += "hover:border-[#EA4335] hover:bg-[#EA4335]/10";
                       else if (item.icon_name === 'AppLogo') customClass += "hover:border-slate-400 hover:bg-slate-500/10 relative";
                       else customClass += "hover:border-emerald-500 hover:bg-emerald-50";

                       return renderItemAction(item, (
                         <>
                           {item.icon_name === 'AppLogo' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                           <div className={innerClass}>
                             {getIcon(item.icon_name, 24)}
                           </div>
                           <span className="text-[9px] font-bold text-slate-500">{item.label}</span>
                         </>
                       ), customClass);
                    })}
                  </div>
                </div>
              </div>
            )
          }

          return null;
        })}

        {/* Restore Map Preview Component */}
        <button onClick={onMapClick} className="w-full h-[52px] rounded-xl overflow-hidden relative group/map shadow-sm hover:shadow-md active:shadow-md transition-all border border-slate-100 shrink-0">
          <img src="/map_preview.png" alt="Map" className="w-full h-full object-cover group-hover/map:scale-105 group-active/map:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-slate-900/40 group-hover/map:bg-slate-900/25 transition-colors flex items-center justify-center">
            <div className="bg-slate-900/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 group-hover/map:scale-105 transition-transform">
              <LucideIcons.MapPin size={14} /> ???? ???? ???????
            </div>
          </div>
        </button>

      </div>
    </div>
  );
}
;
fs.writeFileSync('src/components/ActionGrid.tsx', gridCode, 'utf8');

console.log('Restored beautiful styles for ActionGrid');
