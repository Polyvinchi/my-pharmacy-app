const fs = require('fs');
let code = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf8');

code = code.replace(
  "import ImageUploader from '@/components/ImageUploader'",
  "import ImageUploader from '@/components/ImageUploader'\nimport { injectPharmacyAndOffers } from './actions'"
);

code = code.replace(
  "<form onSubmit={handleSave} className=\"bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-8\">",
  \<div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">??????? ???????? ???????</h1>
        <button onClick={async () => {
          if(confirm('???? ??? ?????? ??????? ???? ?????? ??????????. ??????')) {
            await injectPharmacyAndOffers();
            window.location.reload();
          }
        }} type="button" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold">
          ??? ?????? ??????????
        </button>
      </div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-8">\
);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf8');
