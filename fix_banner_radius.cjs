const fs = require('fs');
const path = require('path');

const bannerPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'FacadeBanner.tsx');
let banner = fs.readFileSync(bannerPath, 'utf8');

banner = banner.replace(/rounded-b-\[2rem\]/g, 'rounded-b-[1.25rem]');

fs.writeFileSync(bannerPath, banner, 'utf8');
console.log('Banner radius reduced');
