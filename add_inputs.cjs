const fs = require('fs');

let theme = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf8');
theme = theme.replace(
  '<ImageUploader',
  '<input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="?? ?? ???? ???? ???..." className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 mb-3" dir="ltr" />\n            <ImageUploader'
);
theme = theme.replace(
  '<ImageUploader \\n              onUpload={setCoverUrl}',
  '<input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="?? ?? ???? ???? ???..." className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 mb-3" dir="ltr" />\n            <ImageUploader \n              onUpload={setCoverUrl}'
);
fs.writeFileSync('src/app/admin/ThemeManager.tsx', theme, 'utf8');

let sections = fs.readFileSync('src/app/admin/sections/SectionsManager.tsx', 'utf8');
sections = sections.replace(
  '<ImageUploader',
  '<input type="text" value={itemImageUrl} onChange={e => setItemImageUrl(e.target.value)} placeholder="?? ?? ???? ???? ???..." className="w-full border rounded-lg p-2 outline-none focus:border-purple-500 mb-3" dir="ltr" />\n                <ImageUploader'
);
fs.writeFileSync('src/app/admin/sections/SectionsManager.tsx', sections, 'utf8');
