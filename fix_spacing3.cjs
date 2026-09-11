const fs = require('fs');
const path = require('path');

const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

// Reduce p-2.5 to p-2 (8px), pt-4 to pt-3, pt-5 to pt-4
grid = grid.replace(/p-2\.5 pt-4/g, 'p-2 pt-3');
grid = grid.replace(/p-2\.5 pt-5/g, 'p-2 pt-4');
grid = grid.replace(/p-2\.5/g, 'p-2');

// Reduce gaps: gap-2 -> gap-1.5
grid = grid.replace(/gap-2/g, 'gap-1.5');

// Fix broken instagram logo by using an inline SVG
const instaLogo = \<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-pink-600"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>\;
grid = grid.replace(/<img src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/e\/e7\/Instagram_logo_2015\.svg"[^>]*>/, instaLogo);

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('Extra reduced padding and fixed insta');
