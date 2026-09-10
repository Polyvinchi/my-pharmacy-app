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
  const { data: offers } = await supabase.from('offers').select('*').eq('is_active', true).order('created_at', { ascending: false });

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
      "streetAddress": "شارع أولاد عنتر، حسن محمد",
      "addressLocality": "الجيزة",
      "addressRegion": "الجيزة",
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
    <main className="min-h-[100dvh] w-full max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden flex flex-col sm:border-x sm:border-slate-200">
      <JsonLd data={pharmacySchema} />
      <ClientApp initialData={appData} />
    </main>
  );
}
