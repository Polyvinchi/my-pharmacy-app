'use client';

import { useState, useRef } from 'react';
import { addOffer, deleteOffer, editOffer } from './offers-actions';
import { Plus, X, Package2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type Offer = {
  id: string;
  title: string;
  price: string;
  old_price: string | null;
  img_url: string;
  description?: string;
  discounted_price?: string;
  original_price?: string;
  images?: string[];
  img?: string;
  is_active?: boolean;
  condition_text?: string;
  bundle_items?: string[];
  discount_percentage?: number | null;
  sort_order?: number;
};

export default function OffersManager({ initialOffers }: { initialOffers: Offer[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const [bundleItems, setBundleItems] = useState<string[]>([]);
  const [bundleInput, setBundleInput] = useState('');
  
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const [isActive, setIsActive] = useState(true);

  function openAddModal() {
    setEditingOffer(null);
    setBundleItems([]);
    setImageUrls([]);
    setIsActive(true);
    setError('');
    setIsModalOpen(true);
  }

  function handleEditClick(offer: Offer) {
    setEditingOffer(offer);
    setBundleItems(offer.bundle_items || []);
    setImageUrls(offer.images || (offer.img_url ? [offer.img_url] : []));
    setIsActive(offer.is_active ?? true);
    setError('');
    setIsModalOpen(true);
  }

  function closeAndReset() {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingOffer(null);
      setBundleItems([]);
      setImageUrls([]);
      setBundleInput('');
      setImageUrlInput('');
      setIsActive(true);
      formRef.current?.reset();
      setError('');
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('bundleItems', JSON.stringify(bundleItems));
    formData.append('isActive', isActive.toString());
    formData.append('externalImages', JSON.stringify(imageUrls));
    
    let result;
    if (editingOffer) {
      formData.append('id', editingOffer.id);
      result = await editOffer(formData);
    } else {
      result = await addOffer(formData);
    }
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      closeAndReset();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من مسح هذا العرض؟')) return;
    await deleteOffer(id);
  }

  function addBundleItem() {
    if (bundleInput.trim()) {
      setBundleItems([...bundleItems, bundleInput.trim()]);
      setBundleInput('');
    }
  }

  function removeBundleItem(index: number) {
    setBundleItems(bundleItems.filter((_, i) => i !== index));
  }
  
  function addImageUrl() {
    if (imageUrlInput.trim()) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  }
  
  function removeImageUrl(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          إدارة العروض <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">{initialOffers.length}</span>
        </h3>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm active:scale-95">
          <Plus size={20} /> إضافة عرض جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialOffers.map(offer => {
          const hasMultipleImages = offer.images && offer.images.length > 1;
          
          return (
            <div key={offer.id} className={`border ${offer.is_active === false ? 'border-dashed border-slate-300 opacity-75 grayscale-[0.3]' : 'border-slate-200'} rounded-2xl p-4 flex gap-4 bg-white relative group shadow-sm hover:shadow-md transition-all`}>
              
              {/* Discount Badge Admin Preview */}
              {offer.discount_percentage && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                  -{offer.discount_percentage}%
                </div>
              )}
              
              <div className="w-28 h-28 relative rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                <img 
                  src={offer.image_url || offer.img_url || offer.images?.[0] || offer.img || '/logo.png'} 
                  alt={offer.title || 'Offer'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e: any) => { e.target.src = '/logo.png'; }} 
                />
                {hasMultipleImages && (
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                    <ImageIcon size={10} /> +{offer.images!.length}
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm leading-tight text-slate-800 line-clamp-2 mb-1">{offer.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 text-lg leading-none">{offer.new_price || offer.price || offer.discounted_price}</span>
                    {(offer.old_price || offer.original_price) && <span className="text-xs text-slate-400 line-through">{offer.old_price || offer.original_price}</span>}
                  </div>
                  {offer.is_active === false && (
                    <span className="inline-block mt-1 bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">مخفي</span>
                  )}
                  {offer.bundle_items && offer.bundle_items.length > 0 && (
                    <span className="inline-block mt-1 ml-1 bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">مجمع</span>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-3 border-t pt-3">
                  <button onClick={() => handleEditClick(offer)} className="flex-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 py-1.5 rounded-lg transition font-bold active:scale-95">
                    تعديل
                  </button>
                  <button onClick={() => handleDelete(offer.id)} className="flex-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition font-bold active:scale-95">
                    حذف
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {initialOffers.length === 0 && (
        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <Package2 size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-500 mb-2">لا توجد عروض حالياً</h3>
          <button onClick={openAddModal} className="text-blue-600 font-bold hover:underline">أضف عرضك الأول الآن</button>
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={closeAndReset}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-5 border-b bg-slate-50 shrink-0">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Package2 className="text-blue-600" />
                  {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
                </h2>
                <button onClick={closeAndReset} className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-6 flex-1">
                <form ref={formRef} id="offerForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">اسم المنتج أو العرض *</label>
                        <input name="title" defaultValue={editingOffer?.title || ''} key={editingOffer?.id + 'title'} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition" placeholder="مثال: مجموعة العناية بالبشرة" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">السعر الحالي *</label>
                          <input name="price" defaultValue={editingOffer?.price || editingOffer?.discounted_price || ''} key={editingOffer?.id + 'price'} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition" placeholder="مثال: 150" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">السعر القديم</label>
                          <input name="oldPrice" defaultValue={editingOffer?.old_price || editingOffer?.original_price || ''} key={editingOffer?.id + 'old'} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition" placeholder="مثال: 200" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">ترتيب العرض (Index)</label>
                        <input name="sortOrder" type="number" defaultValue={editingOffer?.sort_order || 0} key={editingOffer?.id + 'sort'} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition" placeholder="رقم الترتيب (مثل 1, 2, 3)" />
                      </div>
                      
                      <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50">
                        <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                          <ImageIcon size={16} className="text-blue-500" />
                          صور العرض
                        </label>
                        
                        <div>
                          <p className="text-xs text-slate-500 mb-1">1. ارفع صور من جهازك (يمكنك اختيار أكثر من صورة):</p>
                          <input name="images" type="file" multiple accept="image/*" className="w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                        </div>
                        
                        <div className="relative flex items-center justify-center">
                          <span className="bg-slate-200 h-px flex-1"></span>
                          <span className="px-2 text-xs text-slate-400 font-bold">أو</span>
                          <span className="bg-slate-200 h-px flex-1"></span>
                        </div>
                        
                        <div>
                          <p className="text-xs text-slate-500 mb-1">2. أضف روابط (URLs) للصور:</p>
                          <div className="flex gap-2">
                            <input 
                              type="url" 
                              value={imageUrlInput} 
                              onChange={(e) => setImageUrlInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                              className="flex-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                              placeholder="https://example.com/image.jpg" 
                            />
                            <button type="button" onClick={addImageUrl} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300 transition flex items-center justify-center shrink-0">
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {imageUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {imageUrls.map((url, index) => (
                              <div key={index} className="relative group w-12 h-12 rounded-lg border overflow-hidden bg-white">
                                <img src={url} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImageUrl(index)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {editingOffer && imageUrls.length === 0 && (
                          <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                            ⚠️ العرض حالياً بدون روابط صور. يرجى رفع صورة أو إضافة رابط لكي يظهر للمستخدمين.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Advanced Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">وصف العرض / التفاصيل</label>
                        <textarea name="description" defaultValue={editingOffer?.description || ''} key={editingOffer?.id + 'desc'} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition" placeholder="اكتب تفاصيل ومميزات العرض هنا..." />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">شروط العرض (اختياري)</label>
                          <input name="conditionText" type="text" defaultValue={editingOffer?.condition_text || ''} key={editingOffer?.id + 'cond'} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition" placeholder="مثال: الحد الأقصى للطلب 2 لكل عميل" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">حالة العرض</label>
                          <button type="button" onClick={() => setIsActive(!isActive)} className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-lg font-bold transition-colors text-sm ${isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                            {isActive ? 'نشط (ظاهر)' : 'مخفي (مسودة)'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Bundle Items */}
                      <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                        <label className="block text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                          <Package2 size={16} className="text-indigo-500" />
                          عرض مجمع (Bundle)
                        </label>
                        <p className="text-xs text-slate-500 mb-3">إذا كان هذا العرض يتكون من أكثر من منتج، أضفهم هنا.</p>
                        
                        <div className="flex gap-2 mb-3">
                          <input 
                            type="text" 
                            value={bundleInput} 
                            onChange={(e) => setBundleInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBundleItem())}
                            className="flex-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                            placeholder="مثال: غسول سيرافي 236 مل" 
                          />
                          <button type="button" onClick={addBundleItem} className="bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition flex items-center gap-1 text-sm">
                            <Plus size={16} /> إضافة
                          </button>
                        </div>

                        {bundleItems.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {bundleItems.map((item, index) => (
                              <div key={index} className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-1 rounded text-xs flex items-center gap-1.5">
                                {item}
                                <button type="button" onClick={() => removeBundleItem(index)} className="text-indigo-400 hover:text-red-500 transition">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-bold">
                      {error}
                    </div>
                  )}
                </form>
              </div>
              
              {/* Footer */}
              <div className="border-t p-5 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={closeAndReset} className="px-6 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition">
                  إلغاء
                </button>
                <button type="submit" form="offerForm" disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg disabled:opacity-50 min-w-[140px] flex justify-center">
                  {loading ? 'جاري الحفظ...' : (editingOffer ? 'حفظ التعديلات' : 'نشر العرض')}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
