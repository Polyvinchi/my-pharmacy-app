const fs = require('fs');
let code = fs.readFileSync('src/components/FacadeBanner.tsx', 'utf8');

// Modify the style to use cover_url if it exists
code = code.replace(
  'style={{ background: settings?.primary_color ? \linear-gradient(135deg, \, #0f172a)\ : "linear-gradient(to right, #1d4ed8, #1e3a8a)" }}',
  'style={{ background: pharmacy?.cover_url ? \url(\)\ : (settings?.primary_color ? \linear-gradient(135deg, \, #0f172a)\ : "linear-gradient(to right, #1d4ed8, #1e3a8a)"), backgroundSize: "cover", backgroundPosition: "center" }}'
);

// Modify the logo to use logo_url if it exists
code = code.replace(
  '<div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3">',
  '<div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 overflow-hidden">'
);
code = code.replace(
  '<img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />',
  '<img src={pharmacy?.logo_url || "/logo.png"} alt="Logo" className="w-full h-full object-contain p-1" />'
);

fs.writeFileSync('src/components/FacadeBanner.tsx', code, 'utf8');
