const fs = require('fs');
const path = require('path');

const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

// Revert social icons size from w-8 h-8 to w-6 h-6
grid = grid.replace(/w-8 h-8 group-hover\/btn/g, 'w-6 h-6 group-hover/btn');
grid = grid.replace(/w-7 h-7 flex items-center/g, 'w-6 h-6 flex items-center');

// Revert whatsapp size
grid = grid.replace(/w-7 h-7 group-hover\/subbtn/g, 'w-5 h-5 group-hover/subbtn');

// Also MapPin size inside socials box
grid = grid.replace(/<MapPin size=\{26\}/g, '<MapPin size={22}');

fs.writeFileSync(gridPath, grid, 'utf8');

const bannerPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'FacadeBanner.tsx');
let banner = fs.readFileSync(bannerPath, 'utf8');
banner = banner.replace(/<Image\s+src="\/logo\.png"[^>]*\/>/s, '<img src="/logo.png" alt="Logo" className="w-[85%] h-[85%] object-contain drop-shadow-sm" />');
fs.writeFileSync(bannerPath, banner, 'utf8');

console.log('Icon sizes reverted and FacadeBanner img fixed');
