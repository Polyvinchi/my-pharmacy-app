"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2 } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import { injectPharmacyAndOffers } from './actions'

export default function ThemeManager({ initialData }: { initialData: any }) {
  const [name, setName] = useState(initialData.name || '')
  const [whatsapp, setWhatsapp] = useState(initialData.social_links?.whatsapp || '')
  const [phone, setPhone] = useState(initialData.social_links?.phone || '')
  const [landline, setLandline] = useState(initialData.social_links?.landline || '')
  const [instapay, setInstapay] = useState(initialData.social_links?.instapay || '')
  const [wallet, setWallet] = useState(initialData.social_links?.wallet || '')
  const [facebook, setFacebook] = useState(initialData.social_links?.facebook || '')
  const [instagram, setInstagram] = useState(initialData.social_links?.instagram || '')
  const [talabat, setTalabat] = useState(initialData.social_links?.talabat || '')
  const [primaryColor, setPrimaryColor] = useState(initialData.theme_config?.primaryColor || '#1e40af')
  
  // Splash Screen settings
  const [splashText, setSplashText] = useState(initialData.theme_config?.splash_text || initialData.name || 'صيدلية د. إيمان عبد الوهاب')
  const [splashAnimation, setSplashAnimation] = useState(initialData.theme_config?.splash_animation || 'pulse')

  // Store Status Settings
  const [statusMode, setStatusMode] = useState(initialData.theme_config?.status_mode || 'always_open')
  const [openTime, setOpenTime] = useState(initialData.theme_config?.open_time || '09:00')
  const [closeTime, setCloseTime] = useState(initialData.theme_config?.close_time || '23:00')

  // New States
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || '')
  const [coverUrl, setCoverUrl] = useState(initialData.cover_url || '')

  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const themeConfig = { 
        ...initialData.theme_config, 
        primaryColor, 
        splash_text: splashText, 
        splash_animation: splashAnimation,
        status_mode: statusMode,
        open_time: openTime,
        close_time: closeTime
      }
      const socialLinks = { 
        ...initialData.social_links, 
        whatsapp,
        phone,
        landline,
        instapay,
        wallet,
        facebook,
        instagram,
        talabat
      }
      
      const payload = {
        name,
        theme_config: themeConfig,
        social_links: socialLinks,
        logo_url: logoUrl || null,
        cover_url: coverUrl || null
      }

      if (initialData.id) {
        await supabase.from('pharmacies').update(payload).eq('id', initialData.id)
      } else {
        await supabase.from('pharmacies').insert([{
          slug: 'default',
          title_tag: name,
          ...payload
        }])
      }
      alert('تم حفظ الإعدادات بنجاح!')
    } catch (error) {
      alert('خطأ أثناء الحفظ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500">إدارة كافة تفاصيل الصيدلية ومعلوماتها وشاشة البداية ومواعيد العمل.</p>
        <button onClick={async () => {
          const pass = prompt('تحذير: هذا الإجراء سيمسح بياناتك ويرجع الموقع لحالته الأولى. أدخل الباسورد للتأكيد:');
          if (pass === '2025') {
            if(confirm('هل أنت متأكد تماماً من إرجاع الإعدادات الافتراضية؟')) {
              await injectPharmacyAndOffers();
              window.location.reload();
            }
          } else if (pass !== null) {
            alert('كلمة المرور غير صحيحة!');
          }
        }} type="button" className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition border border-red-200 shadow-sm flex items-center gap-2">
          إرجاع الإعدادات الافتراضية
        </button>
      </div>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-8">
        
        {/* اسم الصيدلية */}
        <div>
          <label className="block text-sm font-medium mb-2">اسم الصيدلية</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
        </div>

        {/* أرقام التواصل */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">أرقام التواصل</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">رقم الواتساب</label>
              <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="مثال: 20100000000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رقم الموبايل</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="مثال: 01000000000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الخط الأرضي</label>
              <input type="text" value={landline} onChange={e => setLandline(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="مثال: 022000000" />
            </div>
          </div>
        </div>

        {/* السوشيال ميديا وطلبات */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">روابط السوشيال والخدمات</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">رابط فيسبوك</label>
              <input type="text" value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رابط انستجرام</label>
              <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رابط طلبات (Talabat)</label>
              <input type="text" value={talabat} onChange={e => setTalabat(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="https://talabat.com/..." />
            </div>
          </div>
        </div>

        {/* الدفع الإلكتروني */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">أرقام الدفع الإلكتروني</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">رقم انستا باي (InstaPay)</label>
              <input type="text" value={instapay} onChange={e => setInstapay(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="مثال: 01000000000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رقم المحفظة (فودافون كاش الخ)</label>
              <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="مثال: 01000000000" />
            </div>
          </div>
        </div>

        {/* حالة الصيدلية ومواعيد العمل */}
        <div className="border-t pt-6 bg-slate-50 -mx-6 px-6 pb-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">حالة الصيدلية (مفتوح/مغلق)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">حالة العمل</label>
              <select value={statusMode} onChange={e => setStatusMode(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="always_open">مفتوح دائماً (24 ساعة)</option>
                <option value="always_closed">مغلق مؤقتاً</option>
                <option value="scheduled">مواعيد محددة</option>
              </select>
            </div>
            
            {statusMode === 'scheduled' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">وقت الفتح</label>
                  <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">وقت الإغلاق</label>
                  <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* الألوان */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium mb-2">اللون الأساسي (Primary Color)</label>
          <div className="flex items-center gap-4">
            <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full md:w-1/2 border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" />
            <div className="w-12 h-12 rounded-lg border shadow-sm shrink-0" style={{ backgroundColor: primaryColor }}></div>
          </div>
        </div>

        {/* شاشة البداية */}
        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">نص شاشة البداية (Splash Text)</label>
            <input type="text" value={splashText} onChange={e => setSplashText(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">أنيميشن اللوجو في البداية</label>
            <select value={splashAnimation} onChange={e => setSplashAnimation(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr">
              <option value="pulse">نبض (Pulse)</option>
              <option value="bounce">قفز (Bounce)</option>
              <option value="spin">دوران (Spin)</option>
            </select>
          </div>
        </div>

        {/* الصور */}
        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-700">لوجو الصيدلية</h3>
            <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="أو ضع رابط صورة خارجي هنا..." className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 mb-3" dir="ltr" />
            <ImageUploader 
              onUpload={setLogoUrl} 
              currentImage={logoUrl} 
              label="ارفع لوجو ليظهر في التطبيق" 
              folder="logos" 
            />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-slate-700">صورة الـ Cover (الخلفية)</h3>
            <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="أو ضع رابط صورة خارجي هنا..." className="w-full border rounded-lg p-3 outline-none focus:border-blue-500 mb-3" dir="ltr" />
            <ImageUploader 
              onUpload={setCoverUrl} 
              currentImage={coverUrl} 
              label="ارفع صورة لتكون خلفية القسم العلوي" 
              folder="covers" 
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ التغييرات
          </button>
        </div>
      </form>
    </>
  )
}
