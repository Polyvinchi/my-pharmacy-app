import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ClientApp from '@/components/ClientApp';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // Fetch fresh data on every request

export async function generateMetadata(): Promise<Metadata> {
  // Fetch facade title from DB
  const supabase = await createClient();
  const { data: settings } = await supabase.from('app_settings').select('facade_title, facade_subtitle').eq('singleton_key', 'config').single();
  
  const title = settings?.facade_title || "صيدلية د. إيمان عبد الوهاب | حسن محمد، شارع أولاد عنتر";
  const description = settings?.facade_subtitle || "رعاية متكاملة | استشارات طبية | توصيل سريع";

  return {
    title,
    description,
    keywords: ["صيدلية", "إيمان عبد الوهاب", "حسن محمد", "أولاد عنتر", "توصيل أدوية", "مستحضرات تجميل"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ar_EG",
      siteName: title,
    },
  };
}

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch data
  const { data: settings } = await supabase.from('app_settings').select('*').eq('singleton_key', 'config').single();
  let { data: offers } = await supabase.from('offers').select('*').eq('is_active', true).order('created_at', { ascending: false });
  
  // Fallback default offers if DB is empty or fails
  if (!offers || offers.length === 0) {
    offers = [
  {
    "id": "1",
    "title": "CeraVe غسول للبشرة الدهنية 236 مل",
    "price": "450",
    "old_price": "520",
    "img_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&h=300&fit=crop",
    "is_active": true
  },
  {
    "id": "2",
    "title": "Limitless Omega 3 - 30 كبسولة",
    "price": "120",
    "old_price": "150",
    "img_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&h=300&fit=crop",
    "is_active": true
  },
  {
    "id": "3",
    "title": "Panadol Advance - 24 قرص",
    "price": "45",
    "old_price": "50",
    "img_url": "https://images.unsplash.com/photo-1550572017-edb143c3933c?q=80&w=300&h=300&fit=crop",
    "is_active": true
  },
  {
    "id": "4",
    "title": "Vichy سائل حماية من الشمس 50ml",
    "price": "680",
    "old_price": "800",
    "img_url": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&h=300&fit=crop",
    "is_active": true
  },
  {
    "id": "5",
    "title": "Optimum Nutrition مكمل غذائي",
    "price": "2100",
    "old_price": "2400",
    "img_url": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=300&h=300&fit=crop",
    "is_active": true
  }
] as any;
  }

  const appData = {
    settings: settings || {
      facade_title: 'صيدلية د. إيمان عبد الوهاب',
      facade_subtitle: 'رعاية متكاملة | استشارات طبية | توصيل سريع',
      phone_number: '01000000000',
      whatsapp_number: '201000000000',
      landline_number: '0233300000'
    },
    offers: offers || []
  };

  const pharmacySchema = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "name": appData.settings.facade_title,
    "telephone": appData.settings.phone_number,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "شارع أولاد غنيم، أمام مسجد الملك فصل، حدائق القبة",
      "addressLocality": "قليوب",
      "addressRegion": "القليوبية",
      "addressCountry": "EG"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <>
      <JsonLd data={pharmacySchema} />
      <ClientApp initialData={appData} />
    </>
  );
}
