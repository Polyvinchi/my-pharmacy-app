const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

code = code.replace(
  '<a href={\https://wa.me',
  '<a key={item.id} href={\https://wa.me'
);

fs.writeFileSync('src/components/ActionGrid.tsx', code, 'utf8');
