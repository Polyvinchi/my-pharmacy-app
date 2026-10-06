const fs = require('fs');

let actions = fs.readFileSync('src/app/admin/sections/actions.ts', 'utf-8');

const newActions = `
export async function addSection(display_name: string) {
  const supabase = await createClient()
  const { data: pharmacy } = await supabase.from('pharmacies').select('id').limit(1).single()
  if (!pharmacy) throw new Error("No pharmacy found")

  const section_key = 'custom_' + Date.now()
  const newSection = {
    pharmacy_id: pharmacy.id,
    section_key,
    display_name,
    sort_order: 99,
    is_visible: true,
    component_type: 'grid',
    style_config: { badgeColor: 'bg-blue-600', borderColor: 'border-blue-300' }
  }

  const { error } = await supabase.from('page_sections').insert([newSection])
  if (error) throw new Error(error.message)
  revalidatePath('/', 'layout')
}

export async function deleteSection(id: string) {
  const supabase = await createClient()
  await supabase.from('page_sections').delete().eq('id', id)
  revalidatePath('/', 'layout')
}
`;

if (!actions.includes('addSection')) {
  actions += newActions;
  fs.writeFileSync('src/app/admin/sections/actions.ts', actions, 'utf-8');
}
console.log('Added addSection to actions.ts');
