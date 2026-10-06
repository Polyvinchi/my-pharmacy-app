const fs = require('fs');
let layoutCode = fs.readFileSync('src/app/admin/layout.tsx', 'utf-8');

if (!layoutCode.includes('admin/users')) {
  layoutCode = layoutCode.replace(
    "{ name: 'الأقسام', path: '/admin/sections', icon: Component },",
    "{ name: 'الأقسام', path: '/admin/sections', icon: Component },\n    { name: 'إدارة المستخدمين', path: '/admin/users', icon: Users },"
  );
  
  layoutCode = layoutCode.replace(
    "LayoutDashboard, Tags, Component, LogOut, BarChart3, Stethoscope, Menu",
    "LayoutDashboard, Tags, Component, LogOut, BarChart3, Stethoscope, Menu, Users"
  );
  
  fs.writeFileSync('src/app/admin/layout.tsx', layoutCode, 'utf-8');
  console.log('Users menu added');
}
