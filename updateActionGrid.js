const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf-8');

// The new ActionGrid.tsx should map over sections dynamically.
const newCode = `"use client";
import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { trackAction } from '@/utils/track';
import { motion, AnimatePresence } from 'framer-motion';

// Special native icons
import { Phone, MapPin, Activity } from 'lucide-react';

interface ActionGridProps {
  activeTourStep?: string;
  onMapClick: () => void;
  settings?: any;
  services?: any[];
  sections?: any[];
}

export default function ActionGrid({ activeTourStep, onMapClick, settings, services, sections = [] }: ActionGridProps) {
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const startPress = (value: string, name: string, type: string) => {
    const timer = setTimeout(() => {
      // Logic for long press zoom modal if needed
    }, 500);
    setPressTimer(timer);
  };
  const cancelPress = () => { if (pressTimer) clearTimeout(pressTimer); };

  const handleAction = (item: any) => {
    if (item.action_type === 'whatsapp') {
      trackAction('whatsapp_click');
      window.open(\`https://wa.me/\${item.action_value}\`, '_blank');
    } else if (item.action_type === 'link') {
      trackAction(item.icon_name + '_click');
      if (item.action_value?.startsWith('tel:')) {
        window.location.href = item.action_value;
      } else {
        window.open(item.action_value, '_blank');
      }
    } else if (item.action_type === 'modal' && item.action_value === 'map') {
      trackAction('location_click');
      onMapClick();
    } else if (item.action_type === 'copy') {
      navigator.clipboard.writeText(item.action_value);
      alert('تم النسخ: ' + item.action_value);
    } else if (item.action_type === 'talabat') {
      trackAction('talabat_click');
      window.open(item.action_value, '_blank');
    }
  };

  // Render a dynamic item
  const renderItem = (item: any) => {
    let IconComp: any = (Icons as any)[item.icon_name] || Icons.Activity;
    
    // Custom SVG Native Icons support
    if (item.icon_name === 'WhatsappNative') {
      IconComp = () => (
        <div className="w-6 h-6 shrink-0 transition-transform">
          <svg viewBox="0 0 175.216 175.552" className="w-full h-full"><path fill="#25D366" d="M87.608 0C39.254 0 0 39.254 0 87.608c0 15.484 4.069 29.992 11.191 42.534L0 175.552l46.849-11.023C58.86 171.5 72.803 175.216 87.608 175.216c48.354 0 87.608-39.254 87.608-87.608S135.962 0 87.608 0z"/><path fill="#FEFEFE" d="M130.6 113.2c-1.9 5.4-9.4 9.9-15.5 11.2-4.1.9-9.5 1.6-27.6-5.9-23.2-9.7-38.1-33.3-39.3-34.8-1.2-1.6-9.7-12.9-9.7-24.6 0-11.7 6.1-17.4 8.3-19.8 1.9-2.1 5-3.1 8-3.1.9 0 1.8 0 2.6.1 2.3.1 3.4.2 4.9 3.8 1.9 4.5 6.5 16.2 7.1 17.4.6 1.2 1.2 2.8.3 4.4-.8 1.7-1.5 2.4-2.7 3.8-1.2 1.4-2.3 2.4-3.5 3.9-1.1 1.2-2.3 2.6-1 4.8 1.3 2.2 5.8 9.6 12.5 15.5 8.6 7.7 15.8 10.1 18.2 11.2 1.8.8 3.9.6 5.3-.9 1.7-1.9 3.8-5.1 5.9-8.2 1.5-2.2 3.4-2.5 5.4-1.7 2 .8 12.8 6 15 7.1 2.2 1 3.7 1.5 4.2 2.5.6.9.6 5.3-1.3 10.6z"/></svg>
        </div>
      );
    } else if (item.icon_name === 'FacebookNative') {
      IconComp = () => (
        <div className="w-8 h-8 transition-transform"><svg viewBox="0 0 24 24" className="w-full h-full"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path fill="white" d="M15.4 12l.5-3.3h-3.2V6.5c0-.9.4-1.8 1.9-1.8h1.4V1.8S14.8 1.6 13.5 1.6c-2.6 0-4.3 1.6-4.3 4.5v2.6H6.4V12h2.8v8h3.7v-8h2.5z" /></svg></div>
      );
    } else if (item.icon_name === 'InstagramNative') {
      IconComp = () => (
        <div className="w-8 h-8 transition-transform"><svg viewBox="0 0 24 24" className="w-full h-full"><defs><linearGradient id="ig3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#f09433" /><stop offset="50%" stopColor="#dc2743" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig3)" /><path fill="white" d="M12 7.7a4.3 4.3 0 1 0 0 8.6 4.3 4.3 0 0 0 0-8.6zm0 7.1a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z" /><circle fill="white" cx="17.3" cy="6.7" r="1.1" /><path fill="white" d="M17.3 3.5H6.7A3.2 3.2 0 0 0 3.5 6.7v10.6A3.2 3.2 0 0 0 6.7 20.5h10.6a3.2 3.2 0 0 0 3.2-3.2V6.7a3.2 3.2 0 0 0-3.2-3.2zM19 17.3a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 17.3V6.7A1.7 1.7 0 0 1 6.7 5h10.6a1.7 1.7 0 0 1 1.7 1.7v10.6z" /></svg></div>
      );
    } else if (item.icon_name === 'GoogleMapsNative') {
      IconComp = () => (
        <div className="transition-transform"><svg viewBox="0 0 24 24" className="w-8 h-8"><path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg></div>
      );
    } else if (item.icon_name === 'TalabatNative') {
      IconComp = () => (
        <div className="w-9 h-9 flex items-center justify-center mb-0.5 transition-transform"><div className="bg-[#FF5A00] text-white rounded-md w-10 h-10 flex items-center justify-center font-black text-[10px] italic">talabat</div></div>
      );
    } else if (item.icon_name === 'InstapayNative') {
      IconComp = () => (
        <div className="w-9 h-9 flex items-center justify-center mb-0.5 transition-transform"><div className="bg-purple-600 text-white rounded-md w-10 h-10 flex items-center justify-center font-black text-[10px]">Insta</div></div>
      );
    } else if (item.icon_name === 'MapPin') {
      IconComp = MapPin;
    }

    const colSpan = item.col_span || 1;
    const layout = item.style_config?.layout || 'col';
    const textColor = item.style_config?.text || 'text-slate-600';
    const bgColor = item.style_config?.bg || 'bg-white';
    
    // Check if it's the map preview item
    if (item.action_type === 'modal' && item.action_value === 'map' && item.image_url) {
      return (
        <button key={item.id} onClick={() => handleAction(item)} style={{ gridColumn: \`span \${colSpan}\` }} className="w-full h-[52px] rounded-xl overflow-hidden relative group/map shadow-sm hover:shadow-md transition-all border border-slate-100 shrink-0">
          <img src={item.image_url} alt="Map" className="w-full h-full object-cover group-hover/map:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-slate-900/40 group-hover/map:bg-slate-900/25 transition-colors flex items-center justify-center">
            <div className="bg-slate-900/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 group-hover/map:scale-105 transition-transform">
              <MapPin size={14} /> {item.label}
            </div>
          </div>
        </button>
      );
    }

    // Default button rendering
    return (
      <button 
        key={item.id}
        onClick={() => handleAction(item)}
        style={{ gridColumn: \`span \${colSpan}\` }}
        className={\`flex \${layout === 'row' ? 'flex-row-reverse gap-1.5' : 'flex-col gap-1'} items-center justify-center rounded-xl p-2 group/btn hover:bg-slate-50 transition-all \${bgColor} border-2 border-slate-100 hover:border-slate-300 min-h-[58px]\`}
      >
        {layout === 'row' ? (
          <>
            <span className={\`text-[11px] font-bold \${textColor}\`}>{item.label}</span>
            <IconComp size={24} className={\`\${textColor} group-hover/btn:scale-110 transition-transform\`} />
          </>
        ) : (
          <>
            <IconComp size={24} className={\`\${textColor} group-hover/btn:scale-110 transition-transform\`} />
            <span className={\`text-[9px] font-bold \${textColor}\`}>{item.label}</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-1.5 px-3 z-10 w-full mb-24 relative max-w-[500px] mx-auto">
      {sections.filter(s => s.is_visible).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(section => (
        <div key={section.id} className="relative mt-1">
          {activeTourStep === section.section_key && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-3.5 right-4 z-50">
                <div className={\`text-[10px] font-bold text-white \${section.style_config?.badgeColor || 'bg-blue-600'} px-3 py-1 rounded-full shadow-md\`}>
                  {section.display_name}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          
          <div className={\`w-full bg-white rounded-xl border-2 \${activeTourStep === section.section_key ? \`\${section.style_config?.borderColor || 'border-blue-300'} shadow-lg\` : 'border-slate-100 shadow-sm'} p-2 pt-4 transition-all duration-300\`}>
            <div className="grid grid-cols-4 gap-1.5">
              {section.section_items && section.section_items
                .filter((item: any) => item.is_visible)
                .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                .map((item: any) => renderItem(item))
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
`;
fs.writeFileSync('src/components/ActionGrid.tsx', newCode, 'utf-8');
console.log('ActionGrid rewritten');
