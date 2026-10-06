const fs = require('fs');

const secureFile = (file, permission) => {
  let code = fs.readFileSync(file, 'utf-8');

  const importStmt = `import { requirePermission } from '@/utils/rbac';\n`;
  if (!code.includes('requirePermission')) {
    code = code.replace(/import \{ createClient \} from '@\/utils\/supabase\/server';/, importStmt + `import { createClient } from '@/utils/supabase/server';`);
  }

  // Common function names to secure
  const functionsToSecure = ['addOffer', 'deleteOffer', 'editOffer', 'addSection', 'deleteSection', 'updateSectionOrder'];
  
  functionsToSecure.forEach(func => {
    const regex = new RegExp(`export async function ${func}\\((.*?)\\) \\{`);
    code = code.replace(regex, `export async function ${func}($1) {\n  await requirePermission('${permission}');`);
  });

  fs.writeFileSync(file, code, 'utf-8');
};

secureFile('src/app/admin/offers-actions.ts', 'offers:edit');
secureFile('src/app/admin/sections-actions.ts', 'sections:edit');

console.log('Actions secured');
