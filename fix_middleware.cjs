const fs = require('fs');
let mw = fs.readFileSync('src/utils/supabase/middleware.ts', 'utf8');

mw = mw.replace(
  "request.nextUrl.pathname.startsWith('/admin')",
  "request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')"
);

fs.writeFileSync('src/utils/supabase/middleware.ts', mw, 'utf8');
