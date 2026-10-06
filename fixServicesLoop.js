const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf-8');

// Replace the services mapping logic
// Instead of services, we will use `const servicesItems = sections?.find(s=>s.section_key === 'services')?.section_items || [];`
const newServicesCode = `              <div className="grid grid-cols-4 gap-1.5">
                {(() => {
                  const servicesItems = sections?.find((s: any) => s.section_key === 'services')?.section_items || [];
                  if (servicesItems.length > 0) {
                    return servicesItems.filter((s: any) => s.is_visible !== false).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)).map((svc: any) => {
                      if (svc.icon_name?.toLowerCase() === 'talabatnative' || svc.icon_name?.toLowerCase() === 'talabat') {
                        return (
                          <a key={svc.id} href={svc.action_value || "https://www.talabat.com"} target="_blank" onClick={() => trackAction('talabat_click')} onTouchStart={() => {}} className="flex flex-col items-center justify-center bg-transparent rounded-xl p-1.5 group/btn transition-all h-[72px] cursor-pointer hover:bg-[#FF5A00]/15 active:bg-[#FF5A00]/15 border-2 border-transparent hover:border-[#FF5A00] active:border-[#FF5A00]">
                            <div className="w-9 h-9 flex items-center justify-center mb-0.5 group-hover/btn:scale-110 group-active/btn:scale-110 transition-transform"><div className="bg-[#FF5A00] text-white rounded-md w-10 h-10 flex items-center justify-center font-black text-[10px] italic">talabat</div></div>
                            <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap mt-0.5 group-hover/btn:text-white group-active/btn:text-white transition-colors">{svc.label}</span>
                          </a>
                        );
                      }
                      
                      const IconComp = (Icons as any)[svc.icon_name] || Icons.Activity;
                      return (
                        <button key={svc.id} onTouchStart={() => {}} className={cell()}>
                          <IconComp size={27} strokeWidth={2} className={svcIcon} />
                          <span className={svcLabel}>{svc.label}</span>
                        </button>
                      );
                    });
                  }
                  return null;
                })()}
              </div>`;

code = code.replace(/<div className="grid grid-cols-4 gap-1\.5">[\s\S]*?\{services && services\.length > 0 \? \([\s\S]*?\) : \([\s\S]*?<\/div>/, newServicesCode);

fs.writeFileSync('src/components/ActionGrid.tsx', code, 'utf-8');
console.log('Fixed services loop');
