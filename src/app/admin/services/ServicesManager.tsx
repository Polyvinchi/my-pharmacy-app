'use client';

import { useState } from 'react';
import { Plus, X, Stethoscope, Save } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function ServicesManager({ initialServices }: { initialServices: any[] }) {
  const [services, setServices] = useState(initialServices);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAdd = () => {
    setServices([...services, { id: `new_${Date.now()}`, title: '', icon_name: 'Activity', is_active: true, display_order: services.length + 1, isNew: true }]);
  };

  const handleChange = (id: string, field: string, value: any) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new_')) {
      if (!confirm('متأكد من مسح الخدمة؟')) return;
      await supabase.from('services').delete().eq('id', id);
    }
    setServices(services.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const svc of services) {
        const payload = {
          title: svc.title,
          icon_name: svc.icon_name,
          is_active: svc.is_active,
          display_order: svc.display_order
        };
        if (svc.isNew) {
          await supabase.from('services').insert([payload]);
        } else {
          await supabase.from('services').update(payload).eq('id', svc.id);
        }
      }
      alert('تم الحفظ بنجاح!');
      router.refresh();
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          إدارة الخدمات <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">{services.length}</span>
        </h3>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition shadow-sm">
            <Plus size={20} /> إضافة خدمة
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
            <Save size={20} /> {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-sm">
            <tr>
              <th className="p-4">اسم الخدمة</th>
              <th className="p-4">الأيقونة (الاسم بالانجليزية)</th>
              <th className="p-4">الترتيب</th>
              <th className="p-4">الحالة</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc, idx) => (
              <tr key={svc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <input type="text" value={svc.title} onChange={e => handleChange(svc.id, 'title', e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500" placeholder="مثال: قياس ضغط" />
                </td>
                <td className="p-4">
                  <input type="text" value={svc.icon_name} onChange={e => handleChange(svc.id, 'icon_name', e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-blue-500 text-left" dir="ltr" placeholder="Activity" />
                </td>
                <td className="p-4">
                  <input type="number" value={svc.display_order} onChange={e => handleChange(svc.id, 'display_order', parseInt(e.target.value))} className="w-20 border rounded-lg p-2 outline-none focus:border-blue-500" />
                </td>
                <td className="p-4">
                  <button onClick={() => handleChange(svc.id, 'is_active', !svc.is_active)} className={`px-3 py-1.5 rounded-lg font-bold text-xs ${svc.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {svc.is_active ? 'نشط' : 'مخفي'}
                  </button>
                </td>
                <td className="p-4 text-left">
                  <button onClick={() => handleDelete(svc.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                    <X size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <Stethoscope size={48} className="mx-auto mb-4 opacity-50" />
                  لا توجد خدمات مضافة حتى الآن.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
