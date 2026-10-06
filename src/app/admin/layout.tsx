"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Tags, Component, LogOut, BarChart3, Stethoscope, Menu, Users } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import LockScreen from '@/components/LockScreen';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // null = still loading. NEVER default to super_admin, otherwise a sub admin
  // briefly sees (and can click) pages they don't have access to.
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const loadAccess = useCallback(async () => {
    // getUser() asks the Supabase auth server, so it always returns the
    // latest permissions (not a stale cached session).
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setRole(null);
      setPermissions([]);
      return;
    }
    const r = user.user_metadata?.role || user.app_metadata?.role || 'super_admin';
    const raw = user.user_metadata?.permissions;
    setRole(r);
    setPermissions(Array.isArray(raw) ? raw : []);
  }, [supabase]);

  // Re-check on every page change (the layout stays mounted between pages,
  // including after logging out and in with another account).
  useEffect(() => {
    loadAccess();
  }, [pathname, loadAccess]);

  // Re-check when the auth state changes or the tab regains focus.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        loadAccess();
        router.refresh();
      }
    });
    const onFocus = () => loadAccess();
    window.addEventListener('focus', onFocus);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', onFocus);
    };
  }, [supabase, loadAccess, router]);

  if (pathname.includes('/login')) return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setPermissions([]);
    router.replace('/admin/login');
    router.refresh();
  };

  const can = (perm?: string) => {
    if (!perm) return false;
    if (permissions.includes(perm)) return true;
    return perm.endsWith(':view') && permissions.includes(perm.replace(':view', ':edit'));
  };

  const allNav = [
    { name: 'الإعدادات', path: '/admin', icon: LayoutDashboard, perm: 'settings:view' },
    { name: 'الإحصائيات', path: '/admin/statistics', icon: BarChart3, perm: 'stats:view' },
    { name: 'العروض', path: '/admin/offers', icon: Tags, perm: 'offers:view' },
    { name: 'الأقسام', path: '/admin/sections', icon: Component, perm: 'sections:view' },
    { name: 'إدارة المستخدمين', path: '/admin/users', icon: Users, superOnly: true },
  ];

  const nav = role === null
    ? []
    : role === 'sub_admin'
      ? allNav.filter(item => !item.superOnly && can(item.perm))
      : allNav;

  const navSkeleton = role === null && (
    <div className="space-y-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="h-11 rounded-xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  );

  return (
    <LockScreen>
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
            {navSkeleton}
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
          {navSkeleton}
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
    </LockScreen>
  );
}