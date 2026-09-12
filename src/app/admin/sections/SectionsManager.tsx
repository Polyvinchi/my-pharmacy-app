"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, X, Save, Loader2, Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Image as ImageIcon } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import { saveSectionItem, deleteSectionItem, injectBeautifulDefaults } from './actions'

export default function SectionsManager({ initialSections, initialItems }: { initialSections: any[], initialItems: any[] }) {
  const [sections, setSections] = useState(initialSections)
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  // Item Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [activeSectionId, setActiveSectionId] = useState<string>('')
  
  const [itemLabel, setItemLabel] = useState('')
  const [itemIcon, setItemIcon] = useState('Activity')
  const [itemActionType, setItemActionType] = useState('none')
  const [itemActionValue, setItemActionValue] = useState('')
  const [itemImageUrl, setItemImageUrl] = useState('')
  const [itemColor, setItemColor] = useState('text-slate-600')

  const supabase = createClient()

  const toggleVisibility = async (id: string, current: boolean) => {
    const newVal = !current;
    setSections(sections.map(s => s.id === id ? { ...s, is_visible: newVal } : s))
    await supabase.from('page_sections').update({ is_visible: newVal }).eq('id', id)
  }

  const openItemModal = (sectionId: string, item?: any) => {
    setActiveSectionId(sectionId)
    if (item) {
      setEditingItem(item)
      setItemLabel(item.label)
      setItemIcon(item.icon_name || 'Activity')
      setItemActionType(item.action_type || 'none')
      setItemActionValue(item.action_value || '')
      setItemImageUrl(item.image_url || '')
      setItemColor(item.style_config?.text || 'text-slate-600')
    } else {
      setEditingItem(null)
      setItemLabel('')
      setItemIcon('Activity')
      setItemActionType('none')
      setItemActionValue('')
      setItemImageUrl('')
      setItemColor('text-slate-600')
    }
    setIsModalOpen(true)
  }

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        section_id: activeSectionId,
        label: itemLabel,
        icon_name: itemIcon,
        action_type: itemActionType,
        action_value: itemActionValue,
        image_url: itemImageUrl || null,
        is_active: true,
        style_config: { text: itemColor }
      }
      if (editingItem) {
        await saveSectionItem({ ...data, id: editingItem.id, style_config: { ...editingItem.style_config, text: itemColor } })
      } else {
        await saveSectionItem(data)
      }
      window.location.reload()
    } catch (error) {
      alert('خطأ في الحفظ')
    } finally {
      setLoading(false)
      setIsModalOpen(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if(!confirm('حذف هذا العنصر؟')) return
    await deleteSectionItem(id)
    window.location.reload()
  }

  const commonIcons = ['Activity', 'HeartPulse', 'Stethoscope', 'Pill', 'Weight', 'Search', 'CreditCard', 'Wallet', 'Phone', 'MapPin', 'Facebook', 'Instagram', 'Twitter', 'FacebookNative', 'InstagramNative', 'GoogleMapsNative', 'WhatsappNative', 'InstapayNative', 'TalabatNative', 'AppLogo']
  const colorOptions = ['text-slate-600', 'text-blue-600', 'text-emerald-600', 'text-red-600', 'text-purple-700', 'text-orange-500', 'text-yellow-500']

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <p className="text-slate-500">مُحرك الأقسام المتطور: تحكم كامل في الأزرار، اللوجوهات، والألوان.</p>
        </div>

        <div className="space-y-4">
          {sections.map((sec) => (
            <div key={sec.id} className="border rounded-xl overflow-hidden bg-slate-50">
              <div className="flex items-center justify-between p-4 bg-white border-b">
                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}>
                  <GripVertical size={20} className="text-slate-300 cursor-grab" />
                  {expandedSection === sec.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  <div>
                    <h3 className="font-bold text-lg">{sec.display_name}</h3>
                    <p className="text-sm text-slate-500">نوع البلوك: {sec.component_type || 'grid'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleVisibility(sec.id, sec.is_visible)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors ${sec.is_visible ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}
                >
                  {sec.is_visible ? <Check size={16} /> : <X size={16} />}
                  {sec.is_visible ? 'ظاهر' : 'مخفي'}
                </button>
              </div>
              
              {expandedSection === sec.id && (
                <div className="p-4 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-700">العناصر (الأزرار والخدمات)</h4>
                    <button onClick={() => openItemModal(sec.id)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue-700">
                      <Plus size={14} /> إضافة زر جديد
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.filter(i => i.section_id === sec.id).sort((a,b)=>a.sort_order - b.sort_order).map(item => (
                      <div key={item.id} className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <GripVertical size={16} className="text-slate-200 cursor-grab" />
                          <div className={`w-10 h-10 ${item.style_config?.bg || 'bg-slate-50'} rounded-lg border flex items-center justify-center text-xs font-bold overflow-hidden`}>
                            {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : item.icon_name}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{item.label}</p>
                            {item.action_type !== 'none' && <p className="text-[10px] text-slate-500 truncate w-32">{item.action_type}: {item.action_value}</p>}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openItemModal(sec.id, item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    {items.filter(i => i.section_id === sec.id).length === 0 && (
                      <div className="col-span-full text-center text-sm text-slate-400 py-4">البلوك فاضي. أضف عنصر جديد!</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingItem ? 'تعديل الزر' : 'إضافة زر جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم الزر (Label)</label>
                <input type="text" required value={itemLabel} onChange={e => setItemLabel(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الأيقونة المدمجة</label>
                  <select value={itemIcon} onChange={e => setItemIcon(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" dir="ltr">
                    {commonIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">لون الأيقونة/النص</label>
                  <select value={itemColor} onChange={e => setItemColor(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" dir="ltr">
                    {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-purple-600 mb-1 flex items-center gap-1"><ImageIcon size={16}/> صورة مخصصة (Custom Image)</label>
                <p className="text-xs text-slate-500 mb-2">لو رفعت صورة هنا (لوجو طلبات مثلاً)، هتظهر مكان الأيقونة المدمجة.</p>
                <input type="text" value={itemImageUrl} onChange={e => setItemImageUrl(e.target.value)} placeholder="أو ضع رابط صورة خارجي هنا..." className="w-full border rounded-lg p-2 outline-none focus:border-purple-500 mb-3" dir="ltr" />
                <ImageUploader 
                  onUpload={(url) => setItemImageUrl(url)} 
                  currentImage={itemImageUrl} 
                  label="ارفع صورة (بديلة للأيقونة)" 
                  folder="section_icons" 
                />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-1">نوع الإجراء عند الضغط (Action)</label>
                <select value={itemActionType} onChange={e => setItemActionType(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500">
                  <option value="none">بدون (عرض فقط)</option>
                  <option value="copy">نسخ النص (للمحافظ الذكية وانستا)</option>
                  <option value="link">رابط خارجي (Link)</option>
                  <option value="whatsapp">رسالة واتساب</option>
                  <option value="modal">فتح نافذة (Modal)</option>
                </select>
              </div>

              {itemActionType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium mb-1">القيمة (الرابط أو النص المراد نسخه)</label>
                  <input type="text" value={itemActionValue} onChange={e => setItemActionValue(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" dir="ltr" />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
