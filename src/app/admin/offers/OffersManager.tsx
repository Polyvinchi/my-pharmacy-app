"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { createOffer, updateOffer, deleteOffer } from './actions'
import { Plus, Edit2, Trash2, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'

export default function OffersManager({ initialOffers }: { initialOffers: any[] }) {
  const [offers, setOffers] = useState(initialOffers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Form State
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountedPrice, setDiscountedPrice] = useState('')
  const [badgeText, setBadgeText] = useState('عرض!')
  const [isBundle, setIsBundle] = useState(false)
  const [hasQty, setHasQty] = useState(true)
  const [maxQty, setMaxQty] = useState('10')
  const [isActive, setIsActive] = useState(true)
  const [images, setImages] = useState<string[]>([])
  
  const [uploading, setUploading] = useState(false)

  const openModal = (offer?: any) => {
    if (offer) {
      setEditingOffer(offer)
      setTitle(offer.title)
      setDesc(offer.description || '')
      setOriginalPrice(offer.original_price?.toString() || '')
      setDiscountedPrice(offer.discounted_price?.toString() || '')
      setBadgeText(offer.badge_text || '')
      setIsBundle(offer.is_bundle || false)
      setHasQty(offer.has_quantity_selector || false)
      setMaxQty(offer.max_quantity?.toString() || '10')
      setIsActive(offer.is_active)
      setImages(offer.images || [])
    } else {
      setEditingOffer(null)
      setTitle('')
      setDesc('')
      setOriginalPrice('')
      setDiscountedPrice('')
      setBadgeText('عرض!')
      setIsBundle(false)
      setHasQty(true)
      setMaxQty('10')
      setIsActive(true)
      setImages([])
    }
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      
      const newUrls: string[] = []
      const files = Array.from(e.target.files)
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const filePath = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('pharmacy-assets')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('pharmacy-assets').getPublicUrl(filePath)
        newUrls.push(data.publicUrl)
      }
      
      setImages(prev => [...prev, ...newUrls])
    } catch (error: any) {
      alert('مشكلة في رفع الصورة: ' + (error.message || 'تأكد من إعدادات الـ Storage (RLS)'))
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      title,
      description: desc,
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      discounted_price: parseFloat(discountedPrice),
      badge_text: badgeText,
      is_bundle: isBundle,
      has_quantity_selector: hasQty,
      max_quantity: parseInt(maxQty),
      is_active: isActive,
      images,
      // pharmacy_id logic omitted for now assuming single tenant or handled by RLS defaults
    }

    try {
      if (editingOffer) {
        await updateOffer(editingOffer.id, data)
        setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...data } : o))
      } else {
        await createOffer(data)
        // Refresh page to get new ID or optimistic update
        window.location.reload()
      }
      setIsModalOpen(false)
    } catch (error) {
      alert('Error saving offer')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return
    try {
      await deleteOffer(id)
      setOffers(offers.filter(o => o.id !== id))
    } catch (error) {
      alert('Error deleting offer')
    }
  }

  return (
    <div>
      <button onClick={() => openModal()} className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
        <Plus size={20} /> إضافة عرض جديد
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className={`bg-white rounded-2xl p-4 border shadow-sm ${!offer.is_active ? 'opacity-60' : 'border-slate-200'}`}>
            <div className="aspect-video bg-slate-100 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
              {offer.images && offer.images.length > 0 ? (
                <img src={offer.images[0]} alt={offer.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-slate-300" size={40} />
              )}
              {!offer.is_active && (
                <div className="absolute top-2 right-2 bg-slate-800 text-white text-xs px-2 py-1 rounded">غير نشط</div>
              )}
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">{offer.title}</h3>
            <div className="flex gap-2 items-center mb-4">
              <span className="text-xl font-black text-blue-600">{offer.discounted_price} ج.م</span>
              {offer.original_price && <span className="text-sm text-slate-400 line-through">{offer.original_price} ج.م</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModal(offer)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-slate-200">
                <Edit2 size={16} /> تعديل
              </button>
              <button onClick={() => handleDelete(offer.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingOffer ? 'تعديل عرض' : 'إضافة عرض جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">اسم العرض</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">الوصف</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500 min-h-[100px]"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">السعر بعد الخصم (ج.م) *</label>
                  <input type="number" required step="0.01" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">السعر الأصلي (ج.م)</label>
                  <input type="number" step="0.01" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">نص البادج (Badge)</label>
                  <input type="text" value={badgeText} onChange={e => setBadgeText(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">أقصى كمية للطلب</label>
                  <input type="number" value={maxQty} onChange={e => setMaxQty(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm font-medium">عرض نشط يظهر للعملاء</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isBundle} onChange={e => setIsBundle(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm font-medium">عرض مجمع (Bundle)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={hasQty} onChange={e => setHasQty(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm font-medium">إظهار محدد الكمية</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">صور العرض</label>
                <div className="flex gap-4 flex-wrap mb-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 bg-slate-100 rounded-lg overflow-hidden border">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors">
                    {uploading ? <Loader2 className="animate-spin text-blue-500" /> : <Upload className="text-slate-400" />}
                    <span className="text-xs text-slate-500 mt-2">رفع صورة</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white py-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100">إلغاء</button>
                <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  حفظ العرض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
