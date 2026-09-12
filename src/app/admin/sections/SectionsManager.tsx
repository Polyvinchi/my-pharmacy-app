"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, X, Save, Loader2, Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Eye, EyeOff, Image as ImageIcon } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import { saveSectionItem, deleteSectionItem } from './actions'

export default function SectionsManager({ initialSections, initialItems }: { initialSections: any[], initialItems: any[] }) {
  const [sections, setSections] = useState(initialSections)
  const [items, setItems] = useState(initialItems)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Item Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [activeSectionId, setActiveSectionId] = useState<string>('')

  const [itemLabel, setItemLabel] = useState('')
  const [itemIcon, setItemIcon] = useState('Activity')
  const [itemActionType, setItemActionType] = useState('none')
  const [itemActionValue, setItemActionValue] = useState('')
  const [itemImageUrl, setItemImageUrl] = useState('')
  const [itemColor, setItemColor] = useState('text-slate-600')

  const supabase = createClient()

  // ── Toggle section visibility (local only, pending save) ──
  const toggleSectionVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    setHasChanges(true)
    setSaved(false)
  }

  // ── Toggle item visibility (local only, pending save) ──
  const toggleItemVisibility = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, is_visible: i.is_visible === false ? true : false } : i))
    setHasChanges(true)
    setSaved(false)
  }

  // ── Save ALL pending changes at once ──
  const saveAllChanges = async () => {
    setSaving(true)
    try {
      for (const sec of sections) {
        const orig = initialSections.find(s => s.id === sec.id)
        if (orig && orig.is_visible !== sec.is_visible) {
          await supabase.from('page_sections').update({ is_visible: sec.is_visible }).eq('id', sec.id)
        }
      }
      for (const item of items) {
        const orig = initialItems.find(i => i.id === item.id)
        const origVisible = orig?.is_visible !== false
        const curVisible = item.is_visible !== false
        if (orig && origVisible !== curVisible) {
          await supabase.from('section_items').update({ is_visible: curVisible }).eq('id', item.id)
        }
      }
      setHasChanges(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  // ── Item Modal ──
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
    setModalLoading(true)
    try {
      const data = {
        section_id: activeSectionId,
        label: itemLabel,
        icon_name: itemIcon,
        action_type: itemActionType,
        action_value: itemActionValue || null,
        image_url: itemImageUrl || null,
        is_visible: true,
        style_config: { text: itemColor }
      }
      if (editingItem) {
        await saveSectionItem({ ...data, id: editingItem.id })
      } else {
        await saveSectionItem(data)
      }
      setIsModalOpen(false)
      window.location.reload()
    } catch (err: any) {
      alert('خطأ في الحفظ: ' + (err?.message || 'تفاصيل غير متاحة'))
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('حذف هذا العنصر؟')) return
    await deleteSectionItem(id)
    window.location.reload()
  }

  const commonIcons = ['Activity', 'HeartPulse', 'Stethoscope', 'Pill', 'Weight', 'Search', 'CreditCard', 'Wallet', 'Phone', 'MapPin', 'Facebook', 'Instagram', 'Twitter', 'FacebookNative', 'InstagramNative', 'GoogleMapsNative', 'WhatsappNative', 'InstapayNative', 'TalabatNative', 'AppLogo', 'Bike']
  const colorOptions = ['text-slate-600', 'text-blue-600', 'text-emerald-600', 'text-red-600', 'text-purple-700', 'text-orange-500', 'text-yellow-500']

  return (
    <div className="space-y-6 pb-28">

      {/* ── Floating Save Bar (shows only when there are pending changes) ── */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center justify-between gap-4 border border-slate-700">
            <span className="text-sm font-bold">⚠️ يوجد تعديلات لم تُحفظ</span>
            <button
              onClick={saveAllChanges}
              disabled={saving}
              className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition disabled:opacity-60 active:scale-95"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </div>
      )}

      {/* ── Saved Toast ── */}
      {saved && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2">
          <Check size={18} /> تم الحفظ بنجاح ✅
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500 text-sm mb-5">
          اضغط على <Eye size={14} className="inline" /> لإخفاء/إظهار أي قسم أو عنصر، ثم اضغط <strong>حفظ التعديلات</strong>.
        </p>

        <div className="space-y-3">
          {sections.map((sec) => {
            const secItems = items.filter(i => i.section_id === sec.id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            const isExpanded = expandedSection === sec.id
            const hiddenCount = secItems.filter(i => i.is_active === false).length

            return (
              <div
                key={sec.id}
                className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                  sec.is_visible ? 'border-slate-200 bg-white' : 'border-dashed border-slate-200 bg-slate-50'
                }`}
              >
                {/* Section Header Row */}
                <div className="flex items-center gap-2 p-3">
                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                    className="flex items-center gap-2 flex-1 text-right min-w-0"
                  >
                    <GripVertical size={16} className="text-slate-200 shrink-0" />
                    {isExpanded
                      ? <ChevronUp size={16} className="text-slate-400 shrink-0" />
                      : <ChevronDown size={16} className="text-slate-400 shrink-0" />
                    }
                    <div className="min-w-0 text-right">
                      <h3 className={`font-bold text-sm sm:text-base leading-tight ${sec.is_visible ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                        {sec.display_name}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        نوع البلوك: {sec.component_type || 'grid'}
                        {hiddenCount > 0 && <span className="mr-1 text-orange-400">· {hiddenCount} عنصر مخفي</span>}
                        {!sec.is_visible && <span className="mr-1 text-red-400 font-bold">· القسم مخفي بالكامل</span>}
                      </p>
                    </div>
                  </button>

                  {/* Section visibility toggle button */}
                  <button
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all border-2 ${
                      sec.is_visible
                        ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {sec.is_visible ? <><Check size={14} /> ظاهر</> : <><X size={14} /> مخفي</>}
                  </button>
                </div>

                {/* Expanded: items list */}
                {isExpanded && (
                  <div className="border-t p-3 bg-slate-50/60 space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500">العناصر الداخلية ({secItems.length})</span>
                      <button
                        onClick={() => openItemModal(sec.id)}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-700 transition"
                      >
                        <Plus size={13} /> إضافة زر
                      </button>
                    </div>

                    {secItems.length === 0 ? (
                      <div className="text-center text-sm text-slate-400 py-6 border-2 border-dashed rounded-xl">
                        القسم فارغ — أضف عنصر جديد
                      </div>
                    ) : (
                      secItems.map(item => (
                        <div
                          key={item.id}
                          className={`bg-white p-2.5 rounded-xl border-2 flex items-center justify-between gap-2 transition-all ${
                            item.is_visible !== false ? 'border-slate-200' : 'border-dashed border-slate-200 opacity-60'
                          }`}
                        >
                          {/* Item info */}
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className={`w-9 h-9 shrink-0 ${item.style_config?.bg || 'bg-slate-50'} rounded-lg border flex items-center justify-center text-[9px] font-bold overflow-hidden`}>
                              {item.image_url
                                ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                : item.icon_name}
                            </div>
                            <div className="min-w-0">
                              <p className={`font-bold text-sm truncate ${item.is_visible !== false ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                                {item.label}
                              </p>
                              {item.action_type && item.action_type !== 'none' && (
                                <p className="text-[10px] text-slate-400 truncate">{item.action_type}: {item.action_value}</p>
                              )}
                            </div>
                          </div>

                          {/* Item action buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => toggleItemVisibility(item.id)}
                              title={item.is_visible !== false ? 'اخفِ' : 'أظهر'}
                              className={`p-1.5 rounded-lg transition border ${
                                item.is_visible !== false
                                  ? 'border-transparent text-slate-300 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50'
                                  : 'border-orange-200 text-orange-500 bg-orange-50'
                              }`}
                            >
                              {item.is_visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button
                              onClick={() => openItemModal(sec.id, item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-200"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Item Edit/Add Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b bg-slate-50 rounded-t-2xl sticky top-0">
              <h2 className="text-lg font-black text-slate-800">
                {editingItem ? '✏️ تعديل العنصر' : '➕ إضافة زر جديد'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الزر / العنصر *</label>
                <input
                  type="text" required
                  value={itemLabel} onChange={e => setItemLabel(e.target.value)}
                  className="w-full border-2 rounded-xl p-3 outline-none focus:border-blue-500 transition"
                  placeholder="مثال: واتساب"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الأيقونة</label>
                  <select value={itemIcon} onChange={e => setItemIcon(e.target.value)} className="w-full border-2 rounded-xl p-2.5 outline-none focus:border-blue-500" dir="ltr">
                    {commonIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">اللون</label>
                  <select value={itemColor} onChange={e => setItemColor(e.target.value)} className="w-full border-2 rounded-xl p-2.5 outline-none focus:border-blue-500" dir="ltr">
                    {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="border-2 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <label className="block text-sm font-bold text-purple-700 flex items-center gap-1">
                  <ImageIcon size={15} /> صورة مخصصة (بديل للأيقونة)
                </label>
                <input
                  type="text" value={itemImageUrl} onChange={e => setItemImageUrl(e.target.value)}
                  placeholder="رابط صورة..."
                  className="w-full border-2 rounded-xl p-2.5 outline-none focus:border-purple-400 text-sm" dir="ltr"
                />
                <ImageUploader onUpload={(url) => setItemImageUrl(url)} currentImage={itemImageUrl} label="أو ارفع صورة من جهازك" folder="section_icons" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الإجراء عند الضغط</label>
                <select value={itemActionType} onChange={e => setItemActionType(e.target.value)} className="w-full border-2 rounded-xl p-2.5 outline-none focus:border-blue-500">
                  <option value="none">بدون إجراء (عرض فقط)</option>
                  <option value="copy">نسخ رقم / نص</option>
                  <option value="link">رابط خارجي (Link)</option>
                  <option value="whatsapp">إرسال رسالة واتساب</option>
                  <option value="modal">فتح نافذة (map / install)</option>
                </select>
              </div>

              {itemActionType !== 'none' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">القيمة (الرابط / النص)</label>
                  <input
                    type="text" value={itemActionValue} onChange={e => setItemActionValue(e.target.value)}
                    className="w-full border-2 rounded-xl p-2.5 outline-none focus:border-blue-500" dir="ltr"
                    placeholder="https://... أو رقم موبايل"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition">
                  إلغاء
                </button>
                <button type="submit" disabled={modalLoading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition">
                  {modalLoading ? <><Loader2 size={16} className="animate-spin" /> جاري الحفظ...</> : <><Save size={16} /> حفظ</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
