const fs = require('fs');
let code = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

const replacement = `
        {/* اسم الصيدلية */}
        <div>
          <label className="block text-sm font-medium mb-2">اسم الصيدلية (الداخلي)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
        </div>

        {/* نصوص الواجهة والمتصفح */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">نصوص الواجهة الرئيسية والمتصفح</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">اسم التبويبة في المتصفح (Browser Tab Title)</label>
              <input type="text" value={tabTitle} onChange={e => setTabTitle(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" placeholder="مثال: صيدلية د. إيمان عبد الوهاب | فيصل" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">العنوان الرئيسي في واجهة الموقع (البانر)</label>
              <input type="text" value={facadeTitle} onChange={e => setFacadeTitle(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" placeholder="مثال: صيدلية د. إيمان عبد الوهاب" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">الوصف الفرعي في واجهة الموقع (البانر)</label>
              <input type="text" value={facadeSubtitle} onChange={e => setFacadeSubtitle(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" placeholder="مثال: صيدلية متكاملة - عروض حصرية وتوصيل سريع" />
            </div>
          </div>
        </div>
`;

code = code.replace(/\{\/\*[\s\S]*?<div>\s*<label className="block text-sm font-medium mb-2">[\s\S]*?<\/label>\s*<input type="text" value=\{name\} onChange=\{e => setName\(e\.target\.value\)\} required className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" \/>\s*<\/div>/, replacement);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf-8');
