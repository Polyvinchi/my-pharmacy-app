const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf-8');

const roleEffect = `
  const [role, setRole] = useState<string>('super_admin');
  
  import { useEffect } from 'react';
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setRole(user.user_metadata?.role || user.app_metadata?.role || 'super_admin');
      }
    });
  }, []);
`;

// Insert the effect
code = code.replace(
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);',
  'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [role, setRole] = useState<string>(\'super_admin\');\n  import { useEffect } from \'react\';\n  useEffect(() => {\n    supabase.auth.getUser().then(({ data: { user } }) => {\n      if (user) {\n        setRole(user.user_metadata?.role || user.app_metadata?.role || \'super_admin\');\n      }\n    });\n  }, []);'
);

// We need to filter nav items based on role
const navFilter = `
  let nav = [
    { name: 'الإعدادات', path: '/admin', icon: LayoutDashboard, superOnly: true },
    { name: 'الإحصائيات', path: '/admin/statistics', icon: BarChart3, superOnly: true },
    { name: 'العروض', path: '/admin/offers', icon: Tags, superOnly: false },
    { name: 'الأقسام', path: '/admin/sections', icon: Component, superOnly: false },
    { name: 'إدارة المستخدمين', path: '/admin/users', icon: Users, superOnly: true },
  ];
  
  if (role === 'sub_admin') {
    nav = nav.filter(item => !item.superOnly);
  }
`;

code = code.replace(
  `  const nav = [
    { name: 'الإعدادات', path: '/admin', icon: LayoutDashboard },
    { name: 'الإحصائيات', path: '/admin/statistics', icon: BarChart3 },
    { name: 'العروض', path: '/admin/offers', icon: Tags },
    { name: 'الأقسام', path: '/admin/sections', icon: Component },
    { name: 'إدارة المستخدمين', path: '/admin/users', icon: Users },
  ];`,
  navFilter
);

// Also remove the "import { useEffect }" since it might already be imported or we can just add it to top. Wait, we can't import inside a function.
code = code.replace('import { useEffect } from \'react\';', '');
code = code.replace('import { useState } from \'react\';', 'import { useState, useEffect } from \'react\';');

fs.writeFileSync('src/app/admin/layout.tsx', code, 'utf-8');
console.log('Role applied to layout');
