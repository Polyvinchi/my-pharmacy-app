import { createClient } from "@/utils/supabase/server"
import ThemeManager from "./ThemeManager"
import { redirect } from "next/navigation"

export default async function AdminOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const role = user.user_metadata?.role || user.app_metadata?.role
  if (role === 'sub_admin') {
    redirect('/admin/offers')
  }

  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">إعدادات الصيدلية والثيم</h1>
      <ThemeManager initialData={pharmacy || {}} />
    </div>
  )
}
