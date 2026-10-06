import os
import re

def secure_file(filepath, permission, functions_to_secure):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    import_stmt = "import { requirePermission } from '@/utils/rbac';\n"
    if 'requirePermission' not in code:
        code = code.replace(
            "import { createClient } from '@/utils/supabase/server';", 
            import_stmt + "import { createClient } from '@/utils/supabase/server';"
        )

    for func in functions_to_secure:
        pattern = rf'export async function {func}\((.*?)\) \{{'
        replacement = f"export async function {func}(\\1) {{\n  await requirePermission('{permission}');"
        code = re.sub(pattern, replacement, code)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Secured {filepath}")

secure_file('src/app/admin/offers-actions.ts', 'offers:edit', ['addOffer', 'deleteOffer', 'editOffer'])
secure_file('src/app/admin/sections/actions.ts', 'sections:edit', ['addSection', 'deleteSection', 'updateSectionOrder'])
