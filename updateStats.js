const fs = require('fs');
let stats = fs.readFileSync('src/app/admin/statistics/page.tsx', 'utf-8');
const newCard = `{/* Page Views */}
        <div className="bg-blue-600 p-5 rounded-2xl border border-blue-700 shadow-lg flex flex-col transform hover:scale-105 transition-all md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 text-white p-2.5 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-blue-100 font-bold text-sm mb-1">عدد مرات فتح الموقع (الزيارات)</h3>
          <p className="text-4xl font-black text-white">{stats.page_view}</p>
        </div>

        {/* Opens */}`;
stats = stats.replace('{/* Opens */}', newCard);
fs.writeFileSync('src/app/admin/statistics/page.tsx', stats, 'utf-8');
