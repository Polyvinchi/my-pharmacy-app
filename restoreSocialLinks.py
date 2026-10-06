import re

with open('src/app/admin/ThemeManager.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

contact_ui = """        {/* روابط التواصل */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">أرقام التواصل والروابط (Contact & Social)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">رقم الموبايل</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">واتساب (بالكود الدولي مثل 2010...)</label>
              <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الرقم الأرضي</label>
              <input type="text" value={landline} onChange={e => setLandline(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">محفظة كاش (فودافون/إنستاباي/اتصالات)</label>
              <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رابط فيسبوك</label>
              <input type="url" value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رابط انستجرام</label>
              <input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">رابط طلبات (Talabat)</label>
              <input type="url" value={talabat} onChange={e => setTalabat(e.target.value)} className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* الألوان */}"""

if 'أرقام التواصل والروابط' not in code:
    new_code = code.replace('{/* الألوان */}', contact_ui)
    if new_code != code:
        with open('src/app/admin/ThemeManager.tsx', 'w', encoding='utf-8') as f:
            f.write(new_code)
        print('Social Links injected')
    else:
        print('Could not find marker')
else:
    print('Already present')
