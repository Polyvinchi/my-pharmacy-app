import { createClient } from '@/lib/supabase/server';
import OffersManager from './OffersManager';

export const revalidate = 0; // Always fresh for admin

export default async function AdminPage() {
  const supabase = await createClient();
  
  // Fetch existing offers
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">خطأ في جلب العروض: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">إضافة عرض جديد</h2>
        <OffersManager initialOffers={offers || []} />
      </div>
    </div>
  );
}
