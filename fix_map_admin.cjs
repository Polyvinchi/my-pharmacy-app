const fs = require('fs');
let code = fs.readFileSync('src/app/admin/sections/SectionsManager.tsx', 'utf8');

code = code.replace(
  "expandedSection === sec.id && sec.component_type !== 'map'",
  "expandedSection === sec.id"
);

fs.writeFileSync('src/app/admin/sections/SectionsManager.tsx', code, 'utf8');
