const fs = require('fs');
let code = fs.readFileSync('src/components/OffersDrawer.tsx', 'utf8');

// Add overflow-y-auto to the details container to prevent content cutoff
code = code.replace(
  'className="flex flex-col h-full bg-white pb-6"',
  'className="flex flex-col h-full bg-white pb-10 overflow-y-auto"'
);

// Remove the flex-1 from the p-6 container so it can expand naturally
code = code.replace(
  '<div className="p-6 flex-1 flex flex-col">',
  '<div className="p-6 flex flex-col pb-24">'
);

fs.writeFileSync('src/components/OffersDrawer.tsx', code, 'utf8');
