const fs = require('fs');
const lines = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf8').split('\n');
lines.splice(114, 1, '      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-8">');
fs.writeFileSync('src/app/admin/ThemeManager.tsx', lines.join('\n'), 'utf8');
