const fs = require('fs');

const pageCode = import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ClientApp from '@/components/ClientApp';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single();
  
  const title = pharmacy?.title_tag || "?????? ?. ????? ??? ?????? | ???? ?????";
  const description = pharmacy?.meta_description || "?????? ?. ????? ??? ?????? - ???? ????? ?????? ????";

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

  // Fallback default offers if DB is empty
  if (!offers || offers.length === 0) {
    offers = [
      {
        id: "1",
        title: "CeraVe ???? ?????? ??????? 236 ??",
        discounted_price: 450,
        original_price: 520,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "2",
        title: "Limitless Omega 3 - 30 ??????",
        discounted_price: 120,
        original_price: 150,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "3",
        title: "Panadol Advance - 24 ???",
        discounted_price: 45,
        original_price: 50,
        images: ["https://images.unsplash.com/photo-1550572017-edb143c3933c?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "4",
        title: "Vichy ???? ????? ?? ????? 50ml",
        discounted_price: 680,
        original_price: 800,
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&h=300&fit=crop"],
        is_active: true
      },
      {
        id: "5",
        title: "Optimum Nutrition ???? ?????",
        discounted_price: 2100,
        original_price: 2400,
        images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=300&h=300&fit=crop"],
        is_active: true
      }
    ];
  }

  const appData = {
    settings: {
      facade_title: pharmacy?.name || '?????? ?. ????? ??? ??????',
      facade_subtitle: pharmacy?.meta_description || '?????? ?????? ??????',
      whatsapp_number: pharmacy?.social_links?.whatsapp || '201000000000',
    },
    pharmacy: pharmacy,
    offers: offers
  };

  return (
    <ClientApp initialData={appData} />
  );
}
;
fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');

// Ensure ClientApp reads settings correctly
let clientApp = fs.readFileSync('src/components/ClientApp.tsx', 'utf8');
clientApp = clientApp.replace(/pharmacy=\{initialData\?\.pharmacy\}/g, 'settings={initialData?.settings}');
clientApp = clientApp.replace(/ sections=\{initialData\?\.sections\}/g, '');
fs.writeFileSync('src/components/ClientApp.tsx', clientApp, 'utf8');

console.log('Restored pages and settings');
