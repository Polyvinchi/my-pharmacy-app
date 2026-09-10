import { createClient } from '@/lib/supabase/server';
import SettingsManager from './SettingsManager';

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createClient();
  
  const { data: settings, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('singleton_key', 'config')
    .single();

  if (error && error.code !== 'PGRST116') {
    return <div className="p-4 text-red-600">خطأ في جلب الإعدادات: {error.message}</div>;
  }

  // Default values if no settings found
  const defaultSettings = settings || {
    phone_number: '01000000000',
    whatsapp_number: '201000000000',
    landline_number: '0233300000',
    facade_title: 'صيدلية د. إيمان عبد الوهاب',
    facade_subtitle: 'رعاية متكاملة | استشارات طبية | توصيل سريع',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4">إعدادات التطبيق الأساسية</h2>
      <SettingsManager initialSettings={defaultSettings} />
    </div>
  );
}
