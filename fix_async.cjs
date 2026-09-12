const fs = require('fs');

// Copy server file
fs.copyFileSync('C:/Users/hp/.gemini/antigravity/brain/9ea129ac-25f8-417a-af6a-a364f99f88e7/scratch/server2.ts', 'src/utils/supabase/server.ts');

function replaceAwait(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/const supabase = createClient\(\)/g, 'const supabase = await createClient()');
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

replaceAwait('src/app/admin/login/actions.ts');
replaceAwait('src/app/admin/offers/actions.ts');
replaceAwait('src/app/admin/offers/page.tsx');

console.log('Fixed async createClient');
