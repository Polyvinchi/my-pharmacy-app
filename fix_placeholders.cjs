const fs = require('fs');

let sec = fs.readFileSync('src/app/admin/sections/SectionsManager.tsx', 'utf8');
sec = sec.replace(/placeholder=".*?"/g, 'placeholder="Paste Image URL here..."');
// Add 'copy' option to Action Type
if (!sec.includes('value="copy"')) {
    sec = sec.replace('<option value="modal">', '<option value="copy">??? ???? (???????/?????)</option>\n                  <option value="modal">');
}
fs.writeFileSync('src/app/admin/sections/SectionsManager.tsx', sec, 'utf8');

let theme = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf8');
theme = theme.replace(/placeholder=".*?"/g, 'placeholder="Paste Image URL here..."');
fs.writeFileSync('src/app/admin/ThemeManager.tsx', theme, 'utf8');

let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');
if (!grid.includes("action_type === 'copy'")) {
    const copyLogic = \if (item.action_type === 'copy') {
      return <button key={item.id} onClick={() => { navigator.clipboard.writeText(item.action_value); alert('?? ?????: ' + item.action_value); }} className={className}>{children}</button>
    }\;
    grid = grid.replace("if (item.action_type === 'whatsapp') {", copyLogic + "\\n    if (item.action_type === 'whatsapp') {");
}
fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');

console.log('Fixed placeholders and added copy action.');
