const fs = require('fs');

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');
pageCode = pageCode.replace(
  "const { data: sections } = await supabase.from('page_sections').select('*');",
  "const { data: sections } = await supabase.from('page_sections').select('*, section_items(*)').order('sort_order', { ascending: true });"
);
fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');
