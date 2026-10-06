const fs = require('fs');
let sm = fs.readFileSync('src/app/admin/sections/SectionsManager.tsx', 'utf-8');

// 1. Add imports
if (!sm.includes('addSection')) {
  sm = sm.replace('import { saveSectionItem, deleteSectionItem } from \'./actions\'', 'import { saveSectionItem, deleteSectionItem, addSection, deleteSection } from \'./actions\'');
}

// 2. Add Add Section Modal State
if (!sm.includes('isAddSectionOpen')) {
  const stateInjection = `  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [addingSection, setAddingSection] = useState(false)

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    setAddingSection(true);
    try {
      await addSection(newSectionName);
      setIsAddSectionOpen(false);
      setNewSectionName('');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      alert("Error adding section");
    } finally {
      setAddingSection(false);
    }
  }

  const handleDeleteSection = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم وكل عناصره؟')) {
      try {
        await deleteSection(id);
        setTimeout(() => window.location.reload(), 1000);
      } catch (e) {
        alert("Error deleting section");
      }
    }
  }`;
  sm = sm.replace('  const supabase = createClient()', stateInjection + '\n\n  const supabase = createClient()');
}

// 3. Add Add Section Button in the header
if (!sm.includes('إضافة قسم جديد')) {
  sm = sm.replace('<button\n              onClick={saveAllChanges}', `<button
              onClick={() => setIsAddSectionOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Plus size={18} />
              إضافة قسم جديد
            </button>
            <button
              onClick={saveAllChanges}`);
}

// 4. Add Delete Section Button in section header
if (!sm.includes('handleDeleteSection')) {
  sm = sm.replace(/className={`shrink-0 flex items-center gap-1\.5 px-3 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all border-2 \${[^]+?<\/button>/, 
    `$&
                  {sec.section_key.startsWith('custom') && (
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="حذف القسم"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}`);
}

// 5. Add Add Section Modal
if (!sm.includes('إضافة قسم جديد (Custom Section)')) {
  const modalInjection = `      {/* Add Section Modal */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg text-slate-800">إضافة قسم جديد (Custom Section)</h3>
              <button onClick={() => setIsAddSectionOpen(false)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200 transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSection} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">اسم القسم</label>
                <input 
                  type="text" 
                  value={newSectionName} 
                  onChange={e => setNewSectionName(e.target.value)} 
                  placeholder="مثال: تأمين طبي، فروعنا..." 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500" 
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddSectionOpen(false)} className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition">
                  إلغاء
                </button>
                <button type="submit" disabled={addingSection} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition">
                  {addingSection ? <><Loader2 size={16} className="animate-spin" /> جاري الحفظ...</> : <><Plus size={16} /> إضافة</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}`;
  sm = sm.replace('{/* Item Form Modal */}', modalInjection + '\n\n      {/* Item Form Modal */}');
}

fs.writeFileSync('src/app/admin/sections/SectionsManager.tsx', sm, 'utf-8');
console.log('Updated SectionsManager');
