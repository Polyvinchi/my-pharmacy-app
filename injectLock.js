const fs = require('fs');
let layoutCode = fs.readFileSync('src/app/admin/layout.tsx', 'utf-8');

if (!layoutCode.includes('import LockScreen')) {
  layoutCode = layoutCode.replace(
    'import { useState } from \'react\';',
    'import { useState } from \'react\';\nimport LockScreen from \'@/components/LockScreen\';'
  );

  layoutCode = layoutCode.replace(
    '<div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">',
    '<LockScreen>\n    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">'
  );

  layoutCode = layoutCode.replace(
    '    </div>\n  );\n}',
    '    </div>\n    </LockScreen>\n  );\n}'
  );

  fs.writeFileSync('src/app/admin/layout.tsx', layoutCode, 'utf-8');
  console.log('Layout updated with LockScreen');
}
