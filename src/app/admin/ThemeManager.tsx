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
  const [splashText, setSplashText] = useState(initialData.theme_config?.splash_text || initialData.name || 'ØµÙŠØ¯Ù„ÙŠØ© Ø¯. Ø¥ÙŠÙ…Ø§Ù† Ø¹Ø¨Ø¯ Ø§Ù„ÙˆÙ‡Ø§Ø¨')
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
        text_color: textColor
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
      
      await clearAppCache();

      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    } catch (error) {
      alert('Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„Ø­ÙØ¸: ' + (error as any)?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Success Toast */}
      {savedMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 animate-bounce-once">
          <Check size={18} /> ØªÙ… Ø­ÙØ¸ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø¨Ù†Ø¬Ø§Ø­ âœ…
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500">Ø¥Ø¯Ø§Ø±Ø© ÙƒØ§ÙØ© ØªÙØ§ØµÙŠÙ„ Ø§Ù„ØµÙŠØ¯Ù„ÙŠØ© ÙˆÙ…Ø¹Ù„ÙˆÙ…Ø§ØªÙ‡Ø§ ÙˆØ´Ø§Ø´Ø© Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© ÙˆÙ…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„Ø¹Ù…Ù„.</p>
        <button onClick={async () => {
          const pass = prompt('ØªØ­Ø°ÙŠØ±: Ù‡Ø°Ø§ Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡ Ø³ÙŠÙ…Ø³Ø­ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ÙˆÙŠØ±Ø¬Ø¹ Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ù„Ø­Ø§Ù„ØªÙ‡ Ø§Ù„Ø£ÙˆÙ„Ù‰. Ø£Ø¯Ø®Ù„ Ø§Ù„Ø¨Ø§Ø³ÙˆØ±Ø¯ Ù„Ù„ØªØ£ÙƒÙŠØ¯:');
          if (pass === 'wer123@#TYXCQ!5550') {
            if(confirm('Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ ØªÙ…Ø§Ù…Ø§Ù‹ Ù…Ù† Ø¥Ø±Ø¬Ø§Ø¹ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØ©ØŸ')) {
              await injectPharmacyAndOffers();
              window.location.reload();
            }
          } else if (pass !== null) {
            alert('ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©!');
          }
        }} type="button" className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition border border-red-200 shadow-sm flex items-center gap-2">
          Ø¥Ø±Ø¬Ø§Ø¹ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØ©
        </button>
      </div>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-8">
        
        {/* Ø§Ø³Ù… Ø§Ù„ØµÙŠØ¯Ù„ÙŠØ© */}
        <div>
          <label className="block text-sm font-medium mb-2">Ø§Ø³Ù… Ø§Ù„ØµÙŠØ¯Ù„ÙŠØ©</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" />
        </div>

        {/* Ø£Ø±Ù‚Ø§Ù… Ø§Ù„ØªÙˆØ§ØµÙ„ */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">Ø£Ø±Ù‚Ø§Ù… Ø§Ù„ØªÙˆØ§ØµÙ„</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ø±Ù‚Ù… Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨</label>
              <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="Ù…Ø«Ø§Ù„: 20100000000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="Ù…Ø«Ø§Ù„: 01000000000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ø§Ù„Ø®Ø· Ø§Ù„Ø£Ø±Ø¶ÙŠ</label>
              <input type="text" value={landline} onChange={e => setLandline(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="Ù…Ø«Ø§Ù„: 022000000" />
            </div>
          </div>
        </div>

        {/* Ø§Ù„Ø³ÙˆØ´ÙŠØ§Ù„ Ù…ÙŠØ¯ÙŠØ§ ÙˆØ·Ù„Ø¨Ø§Øª */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">Ø±ÙˆØ§Ø¨Ø· Ø§Ù„Ø³ÙˆØ´ÙŠØ§Ù„ ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ø±Ø§Ø¨Ø· ÙÙŠØ³Ø¨ÙˆÙƒ</label>
              <input type="text" value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ø±Ø§Ø¨Ø· Ø§Ù†Ø³ØªØ¬Ø±Ø§Ù…</label>
              <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ø±Ø§Ø¨Ø· Ø·Ù„Ø¨Ø§Øª (Talabat)</label>
              <input type="text" value={talabat} onChange={e => setTalabat(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="https://talabat.com/..." />
            </div>
          </div>
        </div>

        {/* Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">Ø£Ø±Ù‚Ø§Ù… Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ø±Ù‚Ù… Ø§Ù†Ø³ØªØ§ Ø¨Ø§ÙŠ (InstaPay)</label>
              <input type="text" value={instapay} onChange={e => setInstapay(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="Ù…Ø«Ø§Ù„: 01000000000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ø±Ù‚Ù… Ø§Ù„Ù…Ø­ÙØ¸Ø© (ÙÙˆØ¯Ø§ÙÙˆÙ† ÙƒØ§Ø´ Ø§Ù„Ø®)</label>
              <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" placeholder="Ù…Ø«Ø§Ù„: 01000000000" />
            </div>
          </div>
        </div>

        {/* Ø­Ø§Ù„Ø© Ø§Ù„ØµÙŠØ¯Ù„ÙŠØ© ÙˆÙ…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„Ø¹Ù…Ù„ */}
        <div className="border-t pt-6 bg-slate-50 -mx-6 px-6 pb-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">Ø­Ø§Ù„Ø© Ø§Ù„ØµÙŠØ¯Ù„ÙŠØ© (Ù…ÙØªÙˆØ­/Ù…ØºÙ„Ù‚)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ø­Ø§Ù„Ø© Ø§Ù„Ø¹Ù…Ù„</label>
              <select value={statusMode} onChange={e => setStatusMode(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500">
                <option value="always_open">Ù…ÙØªÙˆØ­ Ø¯Ø§Ø¦Ù…Ø§Ù‹ (24 Ø³Ø§Ø¹Ø©)</option>
                <option value="always_closed">Ù…ØºÙ„Ù‚ Ù…Ø¤Ù‚ØªØ§Ù‹</option>
                <option value="scheduled">Ù…ÙˆØ§Ø¹ÙŠØ¯ Ù…Ø­Ø¯Ø¯Ø©</option>
              </select>
            </div>
            
            {statusMode === 'scheduled' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">ÙˆÙ‚Øª Ø§Ù„ÙØªØ­</label>
                  <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ÙˆÙ‚Øª Ø§Ù„Ø¥ØºÙ„Ø§Ù‚</label>
                  <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} className="w-full border rounded-lg p-3 outline-none focus:border-blue-500" dir="ltr" />
                </div>
              </>
            )}
          </div>
        </div>

                {/* الالوان */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4 text-slate-700">الوان التطبيق</h3>
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
            Ø­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª
          </button>
        </div>
      </form>
    </>
  )
}

