const fs = require('fs');
const path = require('path');

const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

grid = grid.replace(/<div className="relative mt-2">/, '<div className="relative mt-0.5">');

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('Gap reduced');
