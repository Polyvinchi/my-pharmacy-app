import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-bold text-slate-800">لوحة تحكم الصيدلية</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/admin" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">العروض</a>
          <a href="/admin/settings" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">الإعدادات</a>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <a href="/" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">عرض التطبيق →</a>
          <form action="/auth/signout" method="post">
            <button className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1.5 bg-red-50 rounded-lg">خروج</button>
          </form>
        </div>
      </header>

      {/* Admin Content */}
      <main className="p-6 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
