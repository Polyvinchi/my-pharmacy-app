import { createClient } from "@/utils/supabase/server"
import OffersManager from "../OffersManager"

export default async function OffersPage() {
  const supabase = await createClient()
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
      <OffersManager initialOffers={offers || []} />
    </div>
  )
}
