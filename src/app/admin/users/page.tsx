import { createClient } from "@/utils/supabase/server"
import UsersManager from "./UsersManager"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const role = user.user_metadata?.role || user.app_metadata?.role
  if (role === 'sub_admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">عفواً، لا تملك صلاحية</h2>
        <p className="text-slate-500">هذه الصفحة مخصصة للمدير الرئيسي (Super Admin) فقط.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">إدارة المستخدمين والصلاحيات</h1>
      <UsersManager />
    </div>
  )
}
