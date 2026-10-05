"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, Check } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import { injectPharmacyAndOffers, clearAppCache } from './actions'

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
  const [tabTitle, setTabTitle] = useState(initialData.title_tag || initialData.name || '')
  const [facadeTitle, setFacadeTitle] = useState(initialData.theme_config?.facade_title || initialData.name || '')
  const [facadeSubtitle, setFacadeSubtitle] = useState(initialData.theme_config?.facade_subtitle || 'صيدلية متكاملة - عروض حصرية وتوصيل سريع')
  const [splashAnimation, setSplashAnimation] = useState(initialData.theme_config?.splash_animation || 'pulse')

  // Store Status Settings
  const [statusMode, setStatusMode] = useState(initialData.theme_config?.status_mode || 'always_open')
  const [openTime, setOpenTime] = useState(initialData.theme_config?.open_time || '09:00')
  const [closeTime, setCloseTime] = useState(initialData.theme_config?.close_time || '23:00')

  // New States
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || '')
  const [coverUrl, setCoverUrl] = useState(initialData.cover_url || '')

  // New advanced UI states
  const [showLogo, setShowLogo] = useState(initialData.theme_config?.show_logo ?? true)
  const [logoPosition, setLogoPosition] = useState(initialData.theme_config?.logo_position || 'center')
  const [logoShape, setLogoShape] = useState(initialData.theme_config?.logo_shape || 'rounded-full')
  const [splashLogoUrl, setSplashLogoUrl] = useState(initialData.theme_config?.splash_logo_url || '')
  const [splashBgColor, setSplashBgColor] = useState(initialData.theme_config?.splash_bg_color || '#0D47A1')
  const [textColor, setTextColor] = useState(initialData.theme_config?.text_color || '#ffffff')

  const [loading, setLoading] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
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
        close_time: closeTime,
        show_logo: showLogo,
        logo_position: logoPosition,
        logo_shape: logoShape,
        splash_logo_url: splashLogoUrl,
        splash_bg_color: splashBgColor,
        text_color: textColor,
        facade_title: facadeTitle,
        facade_subtitle: facadeSubtitle
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
        title_tag: tabTitle,
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
          
          ...payload
        }])
      }
      
      await clearAppCache();

      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    } catch (error) {
      alert('خطأ أثناء الحفظ: ' + (error as any)?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Success Toast */}
      {savedMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 animate-bounce-once">
          <Check size={18} /> تم حفظ الإعدادات بنجاح ✅
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500">إدارة كافة تفاصيل الصيدلية ومعلوماتها وشاشة البداية ومواعيد العمل.</p>
        <button onClick={async () => {
          const pass = prompt('تحذير: هذا الإجراء سيمسح بياناتك ويرجع الموقع لحالته الأولى. أدخل الباسورد للتأكيد:');
          if (pass === 'wer123@#TYXCQ!5550') {
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
          <h3 className="text-lg font-bold mb-4 text-slate-700">ألوان التطبيق</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">اللون الأساسي</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 outline-none" />
                <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-24 border rounded-lg p-2 outline-none font-mono text-sm" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">لون نص الواجهة (الغلاف)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 outline-none" />
                <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-24 border rounded-lg p-2 outline-none font-mono text-sm" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">لون شاشة البداية (Intro)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={splashBgColor} onChange={e => setSplashBgColor(e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 outline-none" />
                <input type="text" value={splashBgColor} onChange={e => setSplashBgColor(e.target.value)} className="w-24 border rounded-lg p-2 outline-none font-mono text-sm" dir="ltr" />
              </div>
            </div>
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
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold mb-2">لوجو شاشة البداية (اختياري - إذا كان مختلف عن اللوجو الأساسي)</h3>
            <ImageUploader onUpload={setSplashLogoUrl} currentImage={splashLogoUrl} label="ارفع لوجو الإنترو" folder="logos" aspect={1} shape="round" />
          </div>
        </div>

        {/* إعدادات اللوجو والصور */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">إعدادات لوجو الواجهة الرئيسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">إظهار/إخفاء اللوجو</label>
              <select value={showLogo ? "true" : "false"} onChange={e => setShowLogo(e.target.value === "true")} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="true">إظهار اللوجو</option>
                <option value="false">إخفاء اللوجو تماماً</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">مكان اللوجو</label>
              <select value={logoPosition} onChange={e => setLogoPosition(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="center">في المنتصف (Center)</option>
                <option value="right">يمين (Right)</option>
                <option value="left">يسار (Left)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">شكل اللوجو (الحواف)</label>
              <select value={logoShape} onChange={e => setLogoShape(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr">
                <option value="rounded-full">دائرة (Circle)</option>
                <option value="rounded-3xl">مربع بحواف مدورة جداً</option>
                <option value="rounded-xl">مربع بحواف مدورة</option>
                <option value="rounded-none">مربع حاد (Square)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold mb-2">اللوجو الأساسي</h3>
              <ImageUploader onUpload={setLogoUrl} currentImage={logoUrl} label="ارفع وقص لوجو الصيدلية" folder="logos" aspect={1} shape={logoShape === "rounded-full" ? "round" : "rect"} />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-2">صورة الـ Cover (الخلفية)</h3>
              <ImageUploader onUpload={setCoverUrl} currentImage={coverUrl} label="ارفع وقص خلفية الصيدلية" folder="covers" aspect={16/9} shape="rect" />
            </div>
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
