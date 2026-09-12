const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');

// Update renderItemAction to accept key
code = code.replace(
  'const renderItemAction = (item: any, children: React.ReactNode, className: string) => {',
  'const renderItemAction = (item: any, children: React.ReactNode, className: string) => {'
);
code = code.replace(
  '<a href={item.action_value}',
  '<a key={item.id} href={item.action_value}'
);
code = code.replace(
  '<a href={\\\https://wa.me',
  '<a key={item.id} href={\\\https://wa.me'
);
code = code.replace(
  '<button onClick={onMapClick}',
  '<button key={item.id} onClick={onMapClick}'
);
code = code.replace(
  '<button className={className}>',
  '<button key={item.id} className={className}>'
);

fs.writeFileSync('src/components/ActionGrid.tsx', code, 'utf8');
console.log('Keys fixed');
