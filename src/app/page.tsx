import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ClientApp from '@/components/ClientApp';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single();
  
  const title = pharmacy?.title_tag || "صيدلية د ايمان عبد الوهاب | حسن محمد - فيصل";
  const description = pharmacy?.meta_description || "صيدلية متكاملة - عروض حصرية وتوصيل سريع";

  return {
    title,
    description,
    keywords: pharmacy?.seo_keywords || [],
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
  
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single();
  let { data: offers } = await supabase.from('offers').select('*').eq('is_active', true).order('sort_order', { ascending: true });

  const { data: sections } = await supabase.from('page_sections').select('*, section_items(*)').order('sort_order');
  const { data: services } = await supabase.from('services').select('*').order('display_order', { ascending: true });

  // Fallback default offers if DB is empty
  if (!offers || offers.length === 0) {
    offers = [
      {
        id: "1",
        title: "CeraVe غسول للبشرة الدهنية 236 مل",
        discounted_price: 450,
        original_price: 520,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "2",
        title: "Limitless Omega 3 - 30 كبسولة",
        discounted_price: 120,
        original_price: 150,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "3",
        title: "Panadol Advance - 24 قرص",
        discounted_price: 45,
        original_price: 50,
        images: ["https://images.unsplash.com/photo-1550572017-edb143c3933c?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "4",
        title: "Vichy صن بلوك مضاد للمعان 50ml",
        discounted_price: 680,
        original_price: 800,
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "5",
        title: "Optimum Nutrition واي بروتين",
        discounted_price: 2100,
        original_price: 2400,
        images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=300&h=300&fit=crop"],
        is_active: true
      }
    ];
  }

  const appData = {
    settings: {
      facade_title: pharmacy?.name || 'صيدلية د ايمان عبد الوهاب | حسن محمد - فيصل',
      facade_subtitle: pharmacy?.meta_description || 'رعايتك الصحية أولوية',
      whatsapp_number: pharmacy?.social_links?.whatsapp || '201000000000',
      primary_color: pharmacy?.theme_config?.primaryColor || null,
      logo_url: pharmacy?.logo_url || null,
      cover_url: pharmacy?.cover_url || null,
      splash_text: pharmacy?.theme_config?.splash_text || pharmacy?.name || 'صيدلية د ايمان عبد الوهاب | حسن محمد - فيصل',
      splash_animation: pharmacy?.theme_config?.splash_animation || 'pulse',
      status_mode: pharmacy?.theme_config?.status_mode || 'always_open',
      open_time: pharmacy?.theme_config?.open_time || '09:00',
      close_time: pharmacy?.theme_config?.close_time || '23:00',
      social_links: pharmacy?.social_links || null
    },
    pharmacy: pharmacy,
    offers: offers,
    sections: sections || [],
    services: services || []
  };

  return (
    <ClientApp initialData={appData} />
  );
}
