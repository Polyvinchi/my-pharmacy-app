"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function injectPharmacyAndOffers() {
  const supabase = await createClient()

  // 1. Upsert Pharmacy Data
  const { data: pharmacy } = await supabase.from('pharmacies').select('id').limit(1).single()
  
  const defaultPharmacy = {
    name: 'صيدلية د. إيمان عبد الوهاب',
    slug: 'default',
    title_tag: 'صيدلية د. إيمان عبد الوهاب | عروض حصرية',
    meta_description: 'صيدلية متكاملة - عروض حصرية وتوصيل سريع',
    social_links: { whatsapp: '201000000000' },
    theme_config: { primaryColor: '#1d4ed8' },
    logo_url: null,
    cover_url: null
  }

  let pharmId = pharmacy?.id
  if (pharmId) {
    await supabase.from('pharmacies').update(defaultPharmacy).eq('id', pharmId)
  } else {
    const { data } = await supabase.from('pharmacies').insert([defaultPharmacy]).select()
    if (data && data.length > 0) {
      pharmId = data[0].id
    }
  }

  // 2. Inject Offers
  if (pharmId) {
    // delete old offers to prevent duplicates
    await supabase.from('offers').delete().eq('pharmacy_id', pharmId)

    const offers = [
      {
        pharmacy_id: pharmId,
        title: "CeraVe غسول للبشرة الدهنية 236 مل",
        discounted_price: 450,
        original_price: 520,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&h=300&fit=crop"],
        is_active: true,
        sort_order: 1
      },
      {
        pharmacy_id: pharmId,
        title: "Limitless Omega 3 - 30 كبسولة",
        discounted_price: 120,
        original_price: 150,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&h=300&fit=crop"],
        is_active: true,
        sort_order: 2
      },
      {
        pharmacy_id: pharmId,
        title: "Panadol Advance - 24 قرص",
        discounted_price: 45,
        original_price: 50,
        images: ["https://images.unsplash.com/photo-1550572017-edb143c3933c?q=80&w=300&h=300&fit=crop"],
        is_active: true,
        sort_order: 3
      },
      {
        pharmacy_id: pharmId,
        title: "Vichy سائل حماية من الشمس 50ml",
        discounted_price: 680,
        original_price: 800,
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&h=300&fit=crop"],
        is_active: true,
        sort_order: 4
      },
      {
        pharmacy_id: pharmId,
        title: "Optimum Nutrition مكمل غذائي",
        discounted_price: 2100,
        original_price: 2400,
        images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=300&h=300&fit=crop"],
        is_active: true,
        sort_order: 5
      }
    ]

    await supabase.from('offers').insert(offers)
  }

  revalidatePath('/', 'layout')
}
