const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf-8');

code = code.replace(/getItemValue\('socials', 'Phone', s\?\.social_links\?\.landline/g, "getItemValue('socials', 'Phone', s?.social_links?.landline, 'action_value', 2)");
code = code.replace(/getItemValue\('socials', 'Phone', 'أرضي', 'label'\)/g, "getItemValue('socials', 'Phone', 'أرضي', 'label', 2)");

code = code.replace('const item = sec.section_items.find((i: any) => i.icon_name === iconName);', 
  'const items = sec.section_items.filter((i: any) => i.icon_name === iconName).sort((a:any,b:any)=> (a.sort_order||0) - (b.sort_order||0)); const item = index === 2 ? items[1] : items[0];');

code = code.replace("const getItemValue = (sectionKey: string, iconName: string, defaultVal: string, field = 'action_value') => {", 
  "const getItemValue = (sectionKey: string, iconName: string, defaultVal: string, field = 'action_value', index = 1) => {");

fs.writeFileSync('src/components/ActionGrid.tsx', code, 'utf-8');
