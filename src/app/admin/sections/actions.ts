"use server"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function seedDefaultSections() {
  const supabase = await createClient()
  
  // 1. Get first pharmacy
  const { data: pharmacy } = await supabase.from('pharmacies').select('id').limit(1).single()
  if (!pharmacy) throw new Error("No pharmacy found. Please save settings first.")

  // 2. Insert Sections
  const sections = [
    { pharmacy_id: pharmacy.id, section_key: 'services', display_name: 'خدماتنا الطبية', sort_order: 1, is_visible: true },
    { pharmacy_id: pharmacy.id, section_key: 'payments', display_name: 'الدفع الإلكتروني', sort_order: 2, is_visible: true },
    { pharmacy_id: pharmacy.id, section_key: 'socials', display_name: 'تواصل معنا', sort_order: 3, is_visible: true }
  ]
  const { data: insertedSections } = await supabase.from('page_sections').insert(sections).select()
  
  if (!insertedSections) return;

  // 3. Insert Items
  const srv = insertedSections.find(s => s.section_key === 'services')?.id
  const pay = insertedSections.find(s => s.section_key === 'payments')?.id
  const soc = insertedSections.find(s => s.section_key === 'socials')?.id

  const items = []
  if (srv) {
    items.push(
      { section_id: srv, label: 'قياس ضغط', icon_name: 'Activity', sort_order: 1 },
      { section_id: srv, label: 'مستوى السكر', icon_name: 'HeartPulse', sort_order: 2 },
      { section_id: srv, label: 'تحليل وزن', icon_name: 'Weight', sort_order: 3 },
      { section_id: srv, label: 'استشارات', icon_name: 'Stethoscope', sort_order: 4 }
    )
  }
  if (pay) {
    items.push(
      { section_id: pay, label: 'بطاقة ائتمان', icon_name: 'CreditCard', sort_order: 1 },
      { section_id: pay, label: 'محفظة إلكترونية', icon_name: 'Wallet', sort_order: 2 }
    )
  }
  if (soc) {
    items.push(
      { section_id: soc, label: 'فيسبوك', icon_name: 'FacebookNative', action_type: 'link', action_value: 'https://facebook.com', sort_order: 1 },
      { section_id: soc, label: 'إنستا', icon_name: 'InstagramNative', action_type: 'link', action_value: 'https://instagram.com', sort_order: 2 },
      { section_id: soc, label: 'الموقع', icon_name: 'GoogleMapsNative', action_type: 'modal', action_value: 'map', sort_order: 3 },
      { section_id: soc, label: 'تثبيت App', icon_name: 'AppLogo', action_type: 'modal', action_value: 'install', sort_order: 4 }
    )
  }

  if (items.length > 0) {
    await supabase.from('section_items').insert(items)
  }
  
  revalidatePath('/', 'layout')
}

export async function saveSectionItem(item: any) {
  const supabase = await createClient()
  if (item.id) {
    await supabase.from('section_items').update(item).eq('id', item.id)
  } else {
    await supabase.from('section_items').insert([item])
  }
  revalidatePath('/', 'layout')
}

export async function deleteSectionItem(id: string) {
  const supabase = await createClient()
  await supabase.from('section_items').delete().eq('id', id)
  revalidatePath('/', 'layout')
}

export async function injectBeautifulDefaults() {
  const supabase = await createClient()
  
  const { data: pharmacy } = await supabase.from('pharmacies').select('id').limit(1).single()
  if (!pharmacy) throw new Error("No pharmacy found. Please save settings first.")

  await supabase.from('page_sections').delete().eq('pharmacy_id', pharmacy.id);

  const sections = [
    { 
      pharmacy_id: pharmacy.id, section_key: 'services', display_name: 'خدماتنا الطبية', 
      sort_order: 1, is_visible: true, component_type: 'grid', style_config: { badgeColor: 'bg-blue-600', borderColor: 'border-blue-300' }
    },
    { 
      pharmacy_id: pharmacy.id, section_key: 'payments', display_name: 'الدفع الإلكتروني', 
      sort_order: 2, is_visible: true, component_type: 'grid', style_config: { badgeColor: 'bg-purple-500' }
    },
    { 
      pharmacy_id: pharmacy.id, section_key: 'socials', display_name: 'تواصل معنا', 
      sort_order: 3, is_visible: true, component_type: 'grid', style_config: { badgeColor: 'bg-emerald-500' }
    },
    { 
      pharmacy_id: pharmacy.id, section_key: 'map_preview', display_name: 'خريطة الصيدلية', 
      sort_order: 4, is_visible: true, component_type: 'map', style_config: {}
    }
  ]
  const { data: insertedSections } = await supabase.from('page_sections').insert(sections).select()
  if (!insertedSections) return;

  const srv = insertedSections.find(s => s.section_key === 'services')?.id
  const pay = insertedSections.find(s => s.section_key === 'payments')?.id
  const soc = insertedSections.find(s => s.section_key === 'socials')?.id
  const map = insertedSections.find(s => s.section_key === 'map_preview')?.id

  const items = []
  
  if (srv) {
    items.push(
      { section_id: srv, label: 'استشارة', icon_name: 'Activity', sort_order: 1, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'توفير نواقص', icon_name: 'Search', sort_order: 2, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'سكر دم', icon_name: 'HeartPulse', sort_order: 3, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'قياس ضغط', icon_name: 'Activity', sort_order: 4, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'InBody', icon_name: 'Stethoscope', sort_order: 5, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'طلبات', icon_name: 'TalabatNative', sort_order: 6, col_span: 1, style_config: { text: 'text-white', bg: 'bg-[#FF5A00]', border: 'border-[#FF5A00]' } },
      { section_id: srv, label: 'توصيل', icon_name: 'Bike', sort_order: 7, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'Visa', icon_name: 'CreditCard', sort_order: 8, col_span: 1, style_config: { text: 'text-blue-600' } }
    )
  }
  
  if (pay) {
    items.push(
      { section_id: pay, label: 'إنستاباي', icon_name: 'InstapayNative', sort_order: 1, col_span: 1, style_config: { text: 'text-purple-700' } },
      { section_id: pay, label: 'محفظة كاش', icon_name: 'Wallet', sort_order: 2, col_span: 1, style_config: { text: 'text-red-600' } }
    )
  }
  
  if (soc) {
    items.push(
      { section_id: soc, label: 'موبايل', icon_name: 'Phone', action_type: 'link', action_value: 'tel:01000000000', sort_order: 1, col_span: 2, style_config: { text: 'text-blue-600', layout: 'row' } },
      { section_id: soc, label: 'واتساب', icon_name: 'WhatsappNative', action_type: 'whatsapp', action_value: 'مرحبا', sort_order: 2, col_span: 2, style_config: { text: 'text-green-600', layout: 'row' } },
      { section_id: soc, label: 'أرضي', icon_name: 'Phone', action_type: 'link', action_value: 'tel:0220000000', sort_order: 3, col_span: 4, style_config: { text: 'text-slate-600', layout: 'row' } },
      { section_id: soc, label: 'فيسبوك', icon_name: 'FacebookNative', action_type: 'link', action_value: 'https://facebook.com', sort_order: 4, col_span: 1 },
      { section_id: soc, label: 'إنستا', icon_name: 'InstagramNative', action_type: 'link', action_value: 'https://instagram.com', sort_order: 5, col_span: 1 },
      { section_id: soc, label: 'الموقع', icon_name: 'GoogleMapsNative', action_type: 'modal', action_value: 'map', sort_order: 6, col_span: 1 },
      { section_id: soc, label: 'تثبيت App', icon_name: 'AppLogo', action_type: 'modal', action_value: 'install', sort_order: 7, col_span: 1, style_config: { hasPulse: true } }
    )
  }
  
  if (map) {
    items.push(
      { section_id: map, label: 'اضغط لفتح الخريطة', icon_name: 'MapPin', action_type: 'modal', action_value: 'map', sort_order: 1, col_span: 4, image_url: '/map_preview.png' }
    )
  }

  if (items.length > 0) {
    await supabase.from('section_items').insert(items)
  }
  
  revalidatePath('/', 'layout')
}
