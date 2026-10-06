import { createClient } from "@/utils/supabase/server"
import ThemeManager from "./ThemeManager"
import { redirect } from "next/navigation"
import { getAccess, firstAllowedPage } from "@/utils/rbac"
import NoAccess from "@/components/NoAccess"

export default async function AdminOverview() {
  const access = await getAccess()
  if (!access.userId) redirect('/admin/login')

  if (!access.can('settings:view')) {
    const next = firstAllowedPage(access)
    if (next && next !== '/admin') redirect(next)
    return <NoAccess />
  }

  const canEdit = access.can('settings:edit')
  const supabase = await createClient()
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">إعدادات الصيدلية والثيم</h1>
      {!canEdit && (
        <div className="mb-4 bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-xl text-sm font-medium">
          وضع العرض فقط — لا تملك صلاحية تعديل الإعدادات.
        </div>
      )}
      <fieldset disabled={!canEdit} className={!canEdit ? 'opacity-70 pointer-events-none select-none' : ''}>
        <ThemeManager initialData={pharmacy || {}} />
      </fieldset>
    </div>
  )
}
