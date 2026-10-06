const fs = require('fs');

// 1. Fix FacadeBanner.tsx
let fb = fs.readFileSync('src/components/FacadeBanner.tsx', 'utf-8');
fb = fb.replace('<div className="text-center">', '<div className={`w-full ${settings?.theme_config?.logo_position === "right" ? "text-right" : settings?.theme_config?.logo_position === "left" ? "text-left" : "text-center"}`}>');
fs.writeFileSync('src/components/FacadeBanner.tsx', fb, 'utf-8');
console.log('Fixed FacadeBanner');

// 2. Fix ThemeManager.tsx Payload
let tm = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');
// Fix themeConfig saving
const correctThemeConfig = `      const themeConfig = { 
        ...initialData.theme_config, 
        primaryColor, 
        splash_text: splashText, 
        splash_animation: splashAnimation,
        status_mode: statusMode,
        open_time: openTime,
        close_time: closeTime,
        show_logo: showLogo,
        logo_position: logoPosition,
        logo_shape: logoShape,
        splash_logo_url: splashLogoUrl,
        splash_bg_color: splashBgColor,
        text_color: textColor,
        facade_title: facadeTitle,
        facade_subtitle: facadeSubtitle
      }`;

tm = tm.replace(/      const themeConfig = \{ \n        \.\.\.initialData\.theme_config, [^]+?      \}/, correctThemeConfig);
fs.writeFileSync('src/app/admin/ThemeManager.tsx', tm, 'utf-8');
console.log('Fixed ThemeManager payload');

// 3. Add Rename Section feature to SectionsManager
let sm = fs.readFileSync('src/app/admin/sections/SectionsManager.tsx', 'utf-8');
if (!sm.includes('renameSection')) {
  // Add rename state
  const renameState = `  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingSectionName, setEditingSectionName] = useState('')

  const startRenameSection = (sec: any) => {
    setEditingSectionId(sec.id);
    setEditingSectionName(sec.display_name);
  }
  const saveRenameSection = async () => {
    if (!editingSectionName.trim()) return;
    try {
      await supabase.from('page_sections').update({ display_name: editingSectionName }).eq('id', editingSectionId);
      setSections(sections.map(s => s.id === editingSectionId ? { ...s, display_name: editingSectionName } : s));
      setEditingSectionId(null);
    } catch (e) {
      alert("Error renaming");
    }
  }`;
  sm = sm.replace('  // ─── Toggle section visibility', renameState + '\n\n  // ─── Toggle section visibility');

  // Add Edit button in section header
  const editBtn = `                  {sec.section_key.startsWith('custom') && (
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="حذف القسم"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => startRenameSection(sec)}
                    className="shrink-0 p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    title="تعديل اسم القسم"
                  >
                    <Edit2 size={16} />
                  </button>`;
  sm = sm.replace(/                  \{sec\.section_key\.startsWith\('custom'\) && \([\s\S]+?<\/button>\n                  \)\}/, editBtn);

  // Render input if editing
  const titleRender = `                    <div className="flex-1 text-right">
                      {editingSectionId === sec.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            autoFocus
                            value={editingSectionName} 
                            onChange={e => setEditingSectionName(e.target.value)} 
                            className="border rounded px-2 py-1 text-sm text-slate-800"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); saveRenameSection(); } }}
                          />
                          <button onClick={(e) => { e.stopPropagation(); saveRenameSection(); }} className="text-green-600 bg-green-50 p-1 rounded"><Check size={16}/></button>
                          <button onClick={(e) => { e.stopPropagation(); setEditingSectionId(null); }} className="text-slate-400 bg-slate-50 p-1 rounded"><X size={16}/></button>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-800">{sec.display_name}</span>
                      )}
                    </div>`;
  sm = sm.replace(/<span className="font-bold text-slate-800">\{sec\.display_name\}<\/span>/, titleRender);
}
fs.writeFileSync('src/app/admin/sections/SectionsManager.tsx', sm, 'utf-8');
console.log('Fixed SectionsManager');
