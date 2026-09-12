import { createClient } from "@/utils/supabase/server"
import SectionsManager from "./SectionsManager"

export default async function SectionsPage() {
  const supabase = await createClient()
  
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
      <SectionsManager initialSections={sections || []} initialItems={items || []} />
    </div>
  )
}
