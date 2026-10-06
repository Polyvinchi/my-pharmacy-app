import re
with open('src/app/admin/ThemeManager.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = r'<div className="border-t pt-6">\s*<button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">\s*\{loading \? <Loader2 className="animate-spin" size=\{20\} /> : <Save size=\{20\} />\}\s*حفظ التغييرات\s*</button>\s*</div>'

replacement = """<div className="border-t pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ التغييرات
          </button>
          
          <button type="button" onClick={handleFactoryReset} disabled={loading} className="w-full md:w-auto text-red-600 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-50">
            حذف كل التعديلات (عودة للافتراضي)
          </button>
        </div>"""

new_code = re.sub(target, replacement, code)
if code != new_code:
    with open('src/app/admin/ThemeManager.tsx', 'w', encoding='utf-8') as f:
        f.write(new_code)
    print('Button fixed via Python')
else:
    print('Pattern not found')
