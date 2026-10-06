import re

with open('src/app/admin/OffersManager.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix the specific button without closing bracket
code = code.replace(
    '{canEdit && <button onClick={openAddModal} className="text-blue-600 font-bold hover:underline">\n            أضف العرض الأول الآن\n          </button>\n        </div>',
    '{canEdit && <button onClick={openAddModal} className="text-blue-600 font-bold hover:underline">\n            أضف العرض الأول الآن\n          </button>}\n        </div>'
)

with open('src/app/admin/OffersManager.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print('Fixed OffersManager missing bracket')
