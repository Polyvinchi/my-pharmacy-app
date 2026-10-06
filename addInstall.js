const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf-8');

code = code.replace(`      } else if (item.action_type === 'modal' && item.action_value === 'map') {
        trackAction('location_click');
        onMapClick();
      } else if (item.action_type === 'copy') {`, `      } else if (item.action_type === 'modal' && item.action_value === 'map') {
        trackAction('location_click');
        onMapClick();
      } else if (item.action_type === 'modal' && item.action_value === 'install') {
        handleInstallClick();
      } else if (item.action_type === 'copy') {`);

fs.writeFileSync('src/components/ActionGrid.tsx', code, 'utf-8');
