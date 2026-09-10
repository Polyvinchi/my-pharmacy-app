'use client';

import { useState } from 'react';
import { updateSettings } from './settings-actions';

export default function SettingsManager({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);
    
    if (result.error) {
      setMsg(`خطأ: ${result.error}`);
    } else {
      setMsg('تم حفظ الإعدادات بنجاح!');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3">نصوص الواجهة الرئيسية</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اسم الصيدلية</label>
              <input name="facade_title" defaultValue={initialSettings.facade_title} required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الشعار / الوصف</label>
              <input name="facade_subtitle" defaultValue={initialSettings.facade_subtitle} required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3">أرقام التواصل</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الموبايل</label>
              <input name="phone_number" defaultValue={initialSettings.phone_number} required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الواتساب (مع كود الدولة 20+)</label>
              <input name="whatsapp_number" defaultValue={initialSettings.whatsapp_number} required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الخط الأرضي</label>
              <input name="landline_number" defaultValue={initialSettings.landline_number} required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" />
            </div>
          </div>
        </div>

      </div>

      {msg && (
        <div className={`p-3 rounded-lg text-sm font-bold ${msg.includes('خطأ') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {msg}
        </div>
      )}

      <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
        {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
      </button>
    </form>
  );
}
