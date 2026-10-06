const fs = require('fs');
let code = fs.readFileSync('src/components/ActionGrid.tsx', 'utf-8');

code = code.replace(`                })()}
              </div>
          </div>
        )} {/* end services */}`, `                })()}
              </div>
            </div>
          </div>
        )} {/* end services */}`);

fs.writeFileSync('src/components/ActionGrid.tsx', code, 'utf-8');
