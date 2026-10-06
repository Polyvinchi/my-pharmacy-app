const fs = require('fs');
let code = fs.readFileSync('src/app/admin/ThemeManager.tsx', 'utf-8');

const resetLogic = `
  const handleFactoryReset = async () => {
    if (!confirm('هل أنت متأكد تماماً من إرجاع جميع الإعدادات لحالتها الافتراضية الأصلية؟ (هذا الإجراء سيحذف اللوجو والألوان وكل التعديلات)')) return;
    
    const pass = prompt('تحذير: هذا الإجراء سيمسح بيانات الثيم بالكامل. أدخل الباسورد الخاص بك للتأكيد:');
    if (!pass) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("المستخدم غير مسجل");

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: pass
      });

      if (authError) {
        throw new Error("كلمة المرور غير صحيحة، تم الإلغاء.");
      }

      if (initialData.id) {
        const payload = {
          theme_config: {},
          logo_url: null,
          cover_url: null,
          social_links: {}
        };
        await supabase.from('pharmacies').update(payload).eq('id', initialData.id);
        await clearAppCache();
        alert('تم العودة للافتراضي بنجاح! سيتم إعادة تحميل الصفحة.');
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
`;
code = code.replace('  const handleSave = async (e: React.FormEvent) => {', resetLogic);

const saveBtn = `<div className="border-t pt-6">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ التغييرات
          </button>
        </div>`;
const newBtns = `<div className="border-t pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ التغييرات
          </button>
          
          <button type="button" onClick={handleFactoryReset} disabled={loading} className="w-full md:w-auto text-red-600 bg-red-50 hover:bg-red-100 px-6 py-3 rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-50">
            حذف كل التعديلات (عودة للافتراضي)
          </button>
        </div>`;
code = code.replace(saveBtn, newBtns);

fs.writeFileSync('src/app/admin/ThemeManager.tsx', code, 'utf-8');
console.log('Factory Reset added');
