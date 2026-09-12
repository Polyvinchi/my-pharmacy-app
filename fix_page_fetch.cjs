const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const query = \let { data: offers } = await supabase.from('offers').select('*').eq('is_active', true).order('sort_order', { ascending: true });

  const { data: sections } = await supabase
    .from('page_sections')
    .select('*, section_items(*)')
    .order('sort_order');\;

code = code.replace(
  "let { data: offers } = await supabase.from('offers').select('*').eq('is_active', true).order('sort_order', { ascending: true });",
  query
);

code = code.replace(
  "offers: offers",
  "offers: offers,\n    sections: sections"
);

fs.writeFileSync('src/app/page.tsx', code, 'utf8');
