import { createClient } from "@/utils/supabase/server"
import { getAccess, firstAllowedPage } from "@/utils/rbac"
import SectionsManager from "./SectionsManager"
import NoAccess from "@/components/NoAccess"
import { redirect } from "next/navigation"

export default async function SectionsPage() {
  const access = await getAccess()
  if (!access.userId) redirect('/admin/login')
  if (!access.can('sections:view')) return <NoAccess fallback={firstAllowedPage(access)} />

  const supabase = await createClient()
  const canEdit = access.can('sections:edit');
  
  // Fetch sections
  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .order('sort_order', { ascending: true })

  // Fetch section items
  const { data: items } = await supabase
    .from('section_items')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">إدارة الأقسام وترتيبها</h1>
      <SectionsManager initialSections={sections || []} initialItems={items || []} canEdit={canEdit} />
    </div>
  )
}
