'use client';

import { useState } from 'react';
import { addOffer, deleteOffer } from './offers-actions';
import Image from 'next/image';

type Offer = {
  id: string;
  title: string;
  price: string;
  old_price: string | null;
  img_url: string;
};

export default function OffersManager({ initialOffers }: { initialOffers: Offer[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await addOffer(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من مسح هذا العرض؟')) return;
    await deleteOffer(id);
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم العرض</label>
            <input name="title" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="مثال: خصم 20% على منتجات العناية" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">السعر الحالي</label>
            <input name="price" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="مثال: 150 ج.م" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">السعر القديم (اختياري)</label>
            <input name="oldPrice" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="مثال: 200 ج.م" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">صورة العرض</label>
            <input name="image" type="file" accept="image/*" required className="w-full px-4 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? 'جاري الإضافة...' : 'إضافة العرض'}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">العروض الحالية ({initialOffers.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialOffers.map(offer => (
            <div key={offer.id} className="border border-slate-200 rounded-xl p-3 flex gap-3 bg-slate-50 relative">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                <Image src={offer.img_url} alt={offer.title} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm leading-tight text-slate-800">{offer.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-blue-600">{offer.price}</span>
                    {offer.old_price && <span className="text-xs text-slate-400 line-through">{offer.old_price}</span>}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(offer.id)}
                  className="self-end text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition"
                >
                  مسح العرض
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
