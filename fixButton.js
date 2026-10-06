const fs = require('fs');
let code = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

const target = `<div className="border-t pt-6">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ التغييرات
          </button>
        </div>`;

const targetCrlf = target.replace(/\n/g, '\r\n');

const replacement = `<div className="border-t pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ التغييرات
          </button>
          
          <button type="button" onClick={handleFactoryReset} disabled={loading} className="w-full md:w-auto text-red-600 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-50">
            حذف كل التعديلات (عودة للافتراضي)
          </button>
        </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf-8');
  console.log('Fixed button! (LF)');
} else if (code.includes(targetCrlf)) {
  code = code.replace(targetCrlf, replacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf-8');
  console.log('Fixed button! (CRLF)');
} else {
  console.log('Button not found');
}
