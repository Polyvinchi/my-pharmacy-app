import { createClient } from "@/utils/supabase/server"
import ThemeManager from "./ThemeManager"

export default async function AdminOverview() {
  const supabase = await createClient()
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">إعدادات الصيدلية والثيم</h1>
      <ThemeManager initialData={pharmacy || {}} />
    </div>
  )
}
