const fs = require('fs');

// Fix page.tsx - address field
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
page = page.replace(/streetAddress.*\n/, 'streetAddress": "\u0634\u0627\u0631\u0639 \u0623\u0648\u0644\u0627\u062f \u063a\u0646\u064a\u0645\u060c \u0623\u0645\u0627\u0645 \u0645\u0633\u062c\u062f \u0627\u0644\u0645\u0644\u0643 \u0641\u0635\u0644\u060c \u062d\u062f\u0627\u0626\u0642 \u0627\u0644\u0642\u0628\u0629",\n');
fs.writeFileSync('src/app/page.tsx', page, 'utf8');

// Fix MapModal.tsx if address text is there
let map = fs.readFileSync('src/components/MapModal.tsx', 'utf8');
// Replace any address-like text with the new one
map = map.replace(/[^\u0000-\u007F\s]+ [^\u0000-\u007F\s]+ [^\u0000-\u007F\s]+ [^\u0000-\u007F\s]+ [^\u0000-\u007F\s]+ [^\u0000-\u007F\s]+ [^\u0000-\u007F\s]+ [^\u0000-\u007F\s]+/g, (m) => {
  if (m.includes('?')) return '\u0634\u0627\u0631\u0639 \u0623\u0648\u0644\u0627\u062f \u063a\u0646\u064a\u0645\u060c \u062d\u062f\u0627\u0626\u0642 \u0627\u0644\u0642\u0628\u0629';
  return m;
});
fs.writeFileSync('src/components/MapModal.tsx', map, 'utf8');

console.log('Address updated');
