import re
with open('src/app/admin/sections/actions.ts', 'r', encoding='utf-8') as f:
    code = f.read()

import_stmt = 'import { requirePermission } from "@/utils/rbac"\n'
if 'requirePermission }' not in code:
    code = code.replace(
        'import { createClient } from "@/utils/supabase/server"', 
        import_stmt + 'import { createClient } from "@/utils/supabase/server"'
    )
    with open('src/app/admin/sections/actions.ts', 'w', encoding='utf-8') as f:
        f.write(code)
    print('Fixed import')
else:
    print('Import already there')
