import re
with open('src/app/admin/offers/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

if 'hasPermission' not in code:
    code = code.replace('import { createClient } from "@/utils/supabase/server"', 
                       'import { createClient } from "@/utils/supabase/server"\nimport { hasPermission } from "@/utils/rbac"')
    code = code.replace('const supabase = await createClient()',
                       "const supabase = await createClient()\n  const canEdit = await hasPermission('offers:edit');")
    code = code.replace('<OffersManager initialOffers={offers || []} />',
                       '<OffersManager initialOffers={offers || []} canEdit={canEdit} />')

with open('src/app/admin/offers/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

with open('src/app/admin/sections/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

if 'hasPermission' not in code:
    code = code.replace('import { createClient } from "@/utils/supabase/server"', 
                       'import { createClient } from "@/utils/supabase/server"\nimport { hasPermission } from "@/utils/rbac"')
    code = code.replace('const supabase = await createClient()',
                       "const supabase = await createClient()\n  const canEdit = await hasPermission('sections:edit');")
    code = code.replace('<SectionsManager initialSections={sections || []} />',
                       '<SectionsManager initialSections={sections || []} canEdit={canEdit} />')

with open('src/app/admin/sections/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
    
print('Pages updated')
