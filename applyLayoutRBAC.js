const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf-8');

const navLogic = `  const nav = [
    { name: 'الإعدادات الأساسية', href: '/admin', icon: LayoutDashboard, requiredPermission: 'settings:view' },
    { name: 'إدارة العروض', href: '/admin/offers', icon: Tags, requiredPermission: 'offers:view' },
    { name: 'إدارة الأقسام', href: '/admin/sections', icon: Grid, requiredPermission: 'sections:view' },
    { name: 'الإحصائيات والزيارات', href: '/admin/stats', icon: BarChart3, requiredPermission: 'stats:view' },
    { name: 'إدارة الموظفين', href: '/admin/users', icon: Users, superOnly: true },
  ]`;

// Replacing the old nav definition
code = code.replace(/const nav = \[\s*\{ name: 'الإعدادات الأساسية'.+?\s+\]/s, navLogic);

// Replacing isSuperAdmin
code = code.replace(/const isSuperAdmin = role !== 'sub_admin';/, `const isSuperAdmin = role === 'super_admin' || (!role && user.email === 'admin@pharmacy.com');
  const permissions = user.user_metadata?.permissions || [];`);

// Replacing filter logic
code = code.replace(/!isSuperAdmin && item\.superOnly/g, `!isSuperAdmin && (item.superOnly || (!permissions.includes(item.requiredPermission)))`);

fs.writeFileSync('src/app/admin/layout.tsx', code, 'utf-8');
console.log('Layout updated with permissions!');
