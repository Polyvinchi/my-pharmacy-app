const fs = require('fs');
const path = require('path');

const gridPath = path.join('e:', 'a-a-pharmacy', 'src', 'components', 'ActionGrid.tsx');
let grid = fs.readFileSync(gridPath, 'utf8');

// Reduce pt-3 to pt-2, pt-4 to pt-2.5 on boxes to tighten the top title space
grid = grid.replace(/p-2 pt-3/g, 'p-2 pt-1.5');
grid = grid.replace(/p-2 pt-4/g, 'p-2 pt-2');

// Reduce mb-1.5 to mb-1 on titles
grid = grid.replace(/mb-1\.5/g, 'mb-1');

fs.writeFileSync(gridPath, grid, 'utf8');
console.log('Title margins reduced');
