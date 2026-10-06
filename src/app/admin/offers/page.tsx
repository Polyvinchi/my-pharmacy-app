import { createClient } from "@/utils/supabase/server"
import { getAccess, firstAllowedPage } from "@/utils/rbac"
import OffersManager from "../OffersManager"
import NoAccess from "@/components/NoAccess"
import { redirect } from "next/navigation"

export default async function OffersPage() {
  const access = await getAccess()
  if (!access.userId) redirect('/admin/login')
  if (!access.can('offers:view')) return <NoAccess fallback={firstAllowedPage(access)} />

  const supabase = await createClient()
  const canEdit = access.can('offers:edit');
  // Fetch offers
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .order('sort_order', { ascending: true })

  // Note: we fetch all offers, including inactive ones for the admin panel

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">إدارة العروض</h1>
      </div>
      <OffersManager initialOffers={offers || []} canEdit={canEdit} />
    </div>
  )
}
