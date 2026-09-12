"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Tags, Component, LogOut, BarChart3, Stethoscope, Menu } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname.includes('/login')) return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const nav = [
    { name: 'الإعدادات', path: '/admin', icon: LayoutDashboard },
    { name: 'الإحصائيات', path: '/admin/statistics', icon: BarChart3 },
    { name: 'العروض', path: '/admin/offers', icon: Tags },
    { name: 'الأقسام', path: '/admin/sections', icon: Component },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      {/* Mobile Header & Dropdown (دورب ليست منيو) */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-black text-blue-700">اللوحة الإدارية</h2>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Menu size={24} />
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
            {nav.map(item => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-white'}`}>
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all mt-2 border-t border-slate-200">
              <LogOut size={20} />
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-l border-slate-200 flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-blue-700">اللوحة الإدارية</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {nav.map(item => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all">
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
        {children}
      </main>
    </div>
  );
}