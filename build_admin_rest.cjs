const fs = require('fs');

// Copy sections page
if (!fs.existsSync('src/app/admin/sections')) fs.mkdirSync('src/app/admin/sections', { recursive: true });
fs.copyFileSync('C:/Users/hp/.gemini/antigravity/brain/9ea129ac-25f8-417a-af6a-a364f99f88e7/scratch/sections_page.tsx', 'src/app/admin/sections/page.tsx');

// Sections Manager
const sectionsManager = "use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, X, MoveUp, MoveDown, Save, Loader2 } from 'lucide-react'

export default function SectionsManager({ initialSections, initialItems }: { initialSections: any[], initialItems: any[] }) {
  const [sections, setSections] = useState(initialSections)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const toggleVisibility = (id: string, current: boolean) => {
    setSections(sections.map(s => s.id === id ? { ...s, is_visible: !current } : s))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      for (const sec of sections) {
        await supabase.from('page_sections').update({ is_visible: sec.is_visible, sort_order: sec.sort_order }).eq('id', sec.id)
      }
      alert('?? ????? ?????!')
    } catch (error) {
      alert('??? ??? ????? ?????')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500">???? ?? ???? ?????? ????? ?????? ????????.</p>
        <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          ??? ?????????
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((sec, index) => (
          <div key={sec.id} className={\lex items-center justify-between p-4 border rounded-xl \\}>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button className="p-1 hover:bg-slate-200 rounded text-slate-500"><MoveUp size={16} /></button>
                <button className="p-1 hover:bg-slate-200 rounded text-slate-500"><MoveDown size={16} /></button>
              </div>
              <div>
                <h3 className="font-bold text-lg">{sec.display_name}</h3>
                <p className="text-sm text-slate-500">???????: {sec.section_key}</p>
              </div>
            </div>
            
            <button 
              onClick={() => toggleVisibility(sec.id, sec.is_visible)}
              className={\px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors \\}
            >
              {sec.is_visible ? <Check size={16} /> : <X size={16} />}
              {sec.is_visible ? '???? ???????' : '????'}
            </button>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="text-center p-8 text-slate-400">?? ???? ????? ????? ?? ????? ???????? ??? ????. (?? ?????? ????? ???????)</div>
        )}
      </div>
    </div>
  )
}
;
fs.writeFileSync('src/app/admin/sections/SectionsManager.tsx', sectionsManager, 'utf8');

// Theme Manager (page.tsx)
const themePage = import { createClient } from "@/utils/supabase/server"
import ThemeManager from "./ThemeManager"

export default async function AdminOverview() {
  const supabase = await createClient()
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">??????? ???????? ??????</h1>
      <ThemeManager initialData={pharmacy || {}} />
    </div>
  )
}
;
fs.writeFileSync('src/app/admin/page.tsx', themePage, 'utf8');

const themeManager = "use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2 } from 'lucide-react'

export default function ThemeManager({ initialData }: { initialData: any }) {
  const [name, setName] = useState(initialData.name || '')
  const [whatsapp, setWhatsapp] = useState(initialData.social_links?.whatsapp || '')
  const [primaryColor, setPrimaryColor] = useState(initialData.theme_config?.primaryColor || '#1e40af')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const themeConfig = { ...initialData.theme_config, primaryColor }
      const socialLinks = { ...initialData.social_links, whatsapp }
      
      if (initialData.id) {
        await supabase.from('pharmacies').update({
          name,
          theme_config: themeConfig,
          social_links: socialLinks
        }).eq('id', initialData.id)
      } else {
        await supabase.from('pharmacies').insert([{
          slug: 'default',
          name,
          title_tag: name,
          theme_config: themeConfig,
          social_links: socialLinks
        }])
      }
      alert('?? ??? ?????????!')
    } catch (error) {
      alert('??? ????? ?????')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">??? ????????</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">??? ???????? (??????)</label>
          <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} dir="ltr" placeholder="????: 201000000000" className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">????? ??????? (Primary Color)</label>
          <div className="flex gap-3">
            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="h-12 w-12 rounded cursor-pointer" />
            <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} dir="ltr" className="flex-1 border rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t flex justify-end">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          ??? ?????????
        </button>
      </div>
    </form>
  )
}
;
fs.writeFileSync('src/app/admin/ThemeManager.tsx', themeManager, 'utf8');

console.log('Rest of admin built');
