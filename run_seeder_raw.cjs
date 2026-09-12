require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: pharmacy } = await supabase.from('pharmacies').select('id').limit(1).single();
  if (!pharmacy) return console.log("No pharmacy");

  await supabase.from('page_sections').delete().eq('pharmacy_id', pharmacy.id);

  const sections = [
    { 
      pharmacy_id: pharmacy.id, section_key: 'services', display_name: '??????? ??????', 
      sort_order: 1, is_visible: true, component_type: 'grid', style_config: { badgeColor: 'bg-blue-600', borderColor: 'border-blue-300' }
    },
    { 
      pharmacy_id: pharmacy.id, section_key: 'payments', display_name: '????? ??????????', 
      sort_order: 2, is_visible: true, component_type: 'grid', style_config: { badgeColor: 'bg-purple-500' }
    },
    { 
      pharmacy_id: pharmacy.id, section_key: 'socials', display_name: '????? ????', 
      sort_order: 3, is_visible: true, component_type: 'grid', style_config: { badgeColor: 'bg-emerald-500' }
    },
    { 
      pharmacy_id: pharmacy.id, section_key: 'map_preview', display_name: '????? ????????', 
      sort_order: 4, is_visible: true, component_type: 'map', style_config: {}
    }
  ];
  const { data: insertedSections, error: secErr } = await supabase.from('page_sections').insert(sections).select();
  if (secErr) return console.log(secErr);

  const srv = insertedSections.find(s => s.section_key === 'services')?.id;
  const pay = insertedSections.find(s => s.section_key === 'payments')?.id;
  const soc = insertedSections.find(s => s.section_key === 'socials')?.id;
  const map = insertedSections.find(s => s.section_key === 'map_preview')?.id;

  const items = [];
  
  if (srv) {
    items.push(
      { section_id: srv, label: '???????', icon_name: 'Activity', sort_order: 1, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: '????? ?????', icon_name: 'Search', sort_order: 2, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: '??? ??', icon_name: 'HeartPulse', sort_order: 3, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: '???? ???', icon_name: 'Activity', sort_order: 4, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'InBody', icon_name: 'Stethoscope', sort_order: 5, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: '?????', icon_name: 'TalabatNative', sort_order: 6, col_span: 1, style_config: { text: 'text-white', bg: 'bg-[#FF5A00]', border: 'border-[#FF5A00]' } },
      { section_id: srv, label: '?????', icon_name: 'Bike', sort_order: 7, col_span: 1, style_config: { text: 'text-blue-600' } },
      { section_id: srv, label: 'Visa', icon_name: 'CreditCard', sort_order: 8, col_span: 1, style_config: { text: 'text-blue-600' } }
    );
  }
  
  if (pay) {
    items.push(
      { section_id: pay, label: '????????', icon_name: 'InstapayNative', sort_order: 1, col_span: 1, style_config: { text: 'text-purple-700' } },
      { section_id: pay, label: '????? ???', icon_name: 'Wallet', sort_order: 2, col_span: 1, style_config: { text: 'text-red-600' } }
    );
  }
  
  if (soc) {
    items.push(
      { section_id: soc, label: '??????', icon_name: 'Phone', action_type: 'link', action_value: 'tel:01000000000', sort_order: 1, col_span: 2, style_config: { text: 'text-blue-600', layout: 'row' } },
      { section_id: soc, label: '??????', icon_name: 'WhatsappNative', action_type: 'whatsapp', action_value: '?????', sort_order: 2, col_span: 2, style_config: { text: 'text-green-600', layout: 'row' } },
      { section_id: soc, label: '????', icon_name: 'Phone', action_type: 'link', action_value: 'tel:0220000000', sort_order: 3, col_span: 4, style_config: { text: 'text-slate-600', layout: 'row' } },
      { section_id: soc, label: '??????', icon_name: 'FacebookNative', action_type: 'link', action_value: 'https://facebook.com', sort_order: 4, col_span: 1 },
      { section_id: soc, label: '?????', icon_name: 'InstagramNative', action_type: 'link', action_value: 'https://instagram.com', sort_order: 5, col_span: 1 },
      { section_id: soc, label: '??????', icon_name: 'GoogleMapsNative', action_type: 'modal', action_value: 'map', sort_order: 6, col_span: 1 },
      { section_id: soc, label: '????? App', icon_name: 'AppLogo', action_type: 'modal', action_value: 'install', sort_order: 7, col_span: 1, style_config: { hasPulse: true } }
    );
  }
  
  if (map) {
    items.push(
      { section_id: map, label: '???? ???? ???????', icon_name: 'MapPin', action_type: 'modal', action_value: 'map', sort_order: 1, col_span: 4, image_url: '/map_preview.png' }
    );
  }

  const { error: itemsErr } = await supabase.from('section_items').insert(items);
  if (itemsErr) return console.log(itemsErr);
  
  console.log("DB Seeded Successfully");
}
run();
