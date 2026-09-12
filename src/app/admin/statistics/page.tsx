import { createClient } from '@/utils/supabase/server';
import { BarChart3, Activity, Download, MousePointerClick, Smartphone, Search, Map, Phone } from 'lucide-react';

export default async function StatisticsPage() {
  const supabase = await createClient();
  
  // Fetch stats from action_logs if it exists
  const { data: logs, error } = await supabase.from('action_logs').select('action_type, created_at');
  
  let stats = {
    open_offers: 0,
    copy_instapay: 0,
    copy_wallet: 0,
    whatsapp_click: 0,
    facebook_click: 0,
    instagram_click: 0,
    talabat_click: 0,
    call_mobile: 0,
    call_landline: 0,
    location_click: 0,
    install_app_click: 0,
  };
  
  if (logs && !error) {
    logs.forEach(log => {
      if (log.action_type in stats) {
        stats[log.action_type as keyof typeof stats]++;
      }
    });
  }

  const hasTable = !error;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            إحصائيات الاستخدام
          </h1>
          <p className="text-slate-500 text-sm">شاهد تفاعل العملاء مع التطبيق والخدمات</p>
        </div>
      </div>

      {!hasTable && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-orange-700 font-bold text-sm mb-6">
          ⚠️ يرجى التأكد من تشغيل كود الـ SQL لإنشاء جدول `action_logs` في Supabase لكي تظهر الإحصائيات الحقيقية.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
        {/* Opens */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-yellow-100 text-yellow-600 p-2.5 rounded-xl">
              <MousePointerClick size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">مرات فتح العروض</h3>
          <p className="text-3xl font-black text-slate-800">{stats.open_offers}</p>
        </div>

        {/* Instapay */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 text-purple-600 p-2.5 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">نسخ رقم انستاباي</h3>
          <p className="text-3xl font-black text-slate-800">{stats.copy_instapay}</p>
        </div>

        {/* Wallet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-100 text-red-600 p-2.5 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">نسخ رقم المحفظة</h3>
          <p className="text-3xl font-black text-slate-800">{stats.copy_wallet}</p>
        </div>

        {/* Install App */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl">
              <Download size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">محاولات تثبيت التطبيق</h3>
          <p className="text-3xl font-black text-slate-800">{stats.install_app_click}</p>
        </div>

        {/* WhatsApp */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-100 text-green-600 p-2.5 rounded-xl">
              <Smartphone size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">الضغط على واتساب</h3>
          <p className="text-3xl font-black text-slate-800">{stats.whatsapp_click}</p>
        </div>
        
        {/* Mobile Call */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-100 text-slate-600 p-2.5 rounded-xl">
              <Phone size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">الاتصال بالموبايل</h3>
          <p className="text-3xl font-black text-slate-800">{stats.call_mobile}</p>
        </div>

        {/* Map */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">
              <Map size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">فتح الخريطة</h3>
          <p className="text-3xl font-black text-slate-800">{stats.location_click}</p>
        </div>
        
        {/* Facebook */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 text-blue-500 p-2.5 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">زيارة فيسبوك</h3>
          <p className="text-3xl font-black text-slate-800">{stats.facebook_click}</p>
        </div>
        
        {/* Talabat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">فتح طلبات (Talabat)</h3>
          <p className="text-3xl font-black text-slate-800">{stats.talabat_click}</p>
        </div>

        {/* Instagram */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-pink-100 text-pink-600 p-2.5 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm mb-1">زيارة انستجرام</h3>
          <p className="text-3xl font-black text-slate-800">{stats.instagram_click}</p>
        </div>

      </div>
    </div>
  );
}
