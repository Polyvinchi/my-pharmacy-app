const fs = require('fs');
const path = require('path');

// Fix middleware redirect
let mw = fs.readFileSync('src/utils/supabase/middleware.ts', 'utf8');
mw = mw.replace("url.pathname = '/login'", "url.pathname = '/admin/login'");
fs.writeFileSync('src/utils/supabase/middleware.ts', mw, 'utf8');

// Ensure directories
const dirs = ['src/app/admin/login', 'src/app/admin/offers', 'src/app/admin/sections'];
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// Write Login Action & Page
const loginAction = "use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
  const supabase = createClient()
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    redirect("/admin/login?error=Could not authenticate user")
  }

  revalidatePath("/", "layout")
  redirect("/admin")
}
;
fs.writeFileSync('src/app/admin/login/actions.ts', loginAction, 'utf8');

const loginPage = import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-8">???? ??????</h1>
        {searchParams.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {searchParams.error}
          </div>
        )}
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              ?????? ??????????
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
              ???? ??????
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              dir="ltr"
            />
          </div>
          <button
            formAction={login}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition-all mt-4"
          >
            ????? ??????
          </button>
        </form>
      </div>
    </div>
  )
}
;
fs.writeFileSync('src/app/admin/login/page.tsx', loginPage, 'utf8');

// Write Admin Layout
const adminLayout = "use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Tags, Component, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  if (pathname.includes('/login')) return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const nav = [
    { name: '?????????', path: '/admin', icon: LayoutDashboard },
    { name: '??????', path: '/admin/offers', icon: Tags },
    { name: '???????', path: '/admin/sections', icon: Component },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-l border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-blue-700">?????? ????????</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {nav.map(item => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={\lex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all \\}>
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all">
            <LogOut size={20} />
            ????? ??????
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
;
fs.writeFileSync('src/app/admin/layout.tsx', adminLayout, 'utf8');

// Dashboard Overview (page.tsx)
const adminOverview = export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">??????? ???????? ??????</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500">???? ????? ??????? ??????? ???????...</p>
      </div>
    </div>
  )
}
;
fs.writeFileSync('src/app/admin/page.tsx', adminOverview, 'utf8');

// Offers Placeholder
const offersPage = export default function AdminOffers() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">????? ??????</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p className="text-slate-500">???? ????? ????? ????? ?????? ???? ?????...</p>
      </div>
    </div>
  )
}
;
fs.writeFileSync('src/app/admin/offers/page.tsx', offersPage, 'utf8');

console.log('Admin layout and pages created successfully!');
