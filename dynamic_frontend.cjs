const fs = require('fs');

// 1. page.tsx
const pageCode = import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ClientApp from '@/components/ClientApp';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').single();
  
  const title = pharmacy?.title_tag || "?????? ?. ????? ??? ?????? | ????? ????";
  const description = pharmacy?.meta_description || "?????? ???????? ???? ????? ?????? ????";

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
  const { data: offers } = await supabase.from('offers').select('*').eq('is_active', true).order('sort_order', { ascending: true });
  const { data: sections } = await supabase.from('page_sections').select('*');

  const appData = {
    pharmacy: pharmacy || {
      name: '?????? ?. ????? ??? ??????',
      theme_config: { primaryColor: '#1e40af' },
      social_links: { whatsapp: '201000000000' }
    },
    offers: offers || [],
    sections: sections || []
  };

  const pharmacySchema = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "name": appData.pharmacy.name,
    "telephone": appData.pharmacy.social_links?.whatsapp,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "???? ????? ????? ????? ?????",
      "addressLocality": "???????",
      "addressCountry": "EG"
    }
  };

  return (
    <>
      <JsonLd data={pharmacySchema} />
      <ClientApp initialData={appData} />
    </>
  );
}
;
fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');

// 2. ClientApp.tsx (Update props)
let clientApp = fs.readFileSync('src/components/ClientApp.tsx', 'utf8');
clientApp = clientApp.replace('settings={initialData?.settings}', 'pharmacy={initialData?.pharmacy}');
clientApp = clientApp.replace('settings={initialData?.settings}', 'pharmacy={initialData?.pharmacy} sections={initialData?.sections}');
fs.writeFileSync('src/components/ClientApp.tsx', clientApp, 'utf8');

// 3. FacadeBanner.tsx (Update props and UI)
let facade = fs.readFileSync('src/components/FacadeBanner.tsx', 'utf8');
facade = facade.replace('settings?: any', 'pharmacy?: any');
facade = facade.replace('settings?.facade_title', 'pharmacy?.name');
facade = facade.replace('settings?.facade_subtitle', "pharmacy?.meta_description || '?????? ?????? ??????'");
// Inject custom primary color style for background
facade = facade.replace(
  'className="h-[210px] w-full bg-gradient-to-r from-blue-700 to-blue-900 rounded-b-[1.25rem] shadow-xl overflow-hidden relative flex flex-col items-center justify-center pt-6"',
  'className="h-[210px] w-full rounded-b-[1.25rem] shadow-xl overflow-hidden relative flex flex-col items-center justify-center pt-6"\n      style={{ background: pharmacy?.theme_config?.primaryColor ? linear-gradient(135deg, , #0f172a) : "linear-gradient(to right, #1d4ed8, #1e3a8a)" }}'
);
fs.writeFileSync('src/components/FacadeBanner.tsx', facade, 'utf8');

// 4. ActionGrid.tsx (Update props and conditionally render)
let grid = fs.readFileSync('src/components/ActionGrid.tsx', 'utf8');
grid = grid.replace('settings?: any', 'pharmacy?: any, sections?: any[]');
// Map 'services', 'payments', 'socials' sections
grid = grid.replace('export default function ActionGrid({ activeTourStep, onMapClick, settings }: ActionGridProps) {', 'export default function ActionGrid({ activeTourStep, onMapClick, pharmacy, sections = [] }: ActionGridProps) {\n  const isSecVisible = (key: string) => {\n    const s = sections.find(x => x.section_key === key);\n    return s ? s.is_visible : true;\n  };');

// Wrap sections in if statement checks
grid = grid.replace('<!-- SERVICES SECTION -->', '{isSecVisible("services") && (<!-- SERVICES SECTION -->');
grid = grid.replace('<!-- END SERVICES SECTION -->', '<!-- END SERVICES SECTION -->)}');
grid = grid.replace('{/* SERVICES SECTION */}', '{isSecVisible("services") && (<div className="w-full">');
grid = grid.replace('{/* END SERVICES SECTION */}', '</div>)}');

grid = grid.replace('{/* PAYMENTS SECTION */}', '{isSecVisible("payments") && (<div className="w-full">');
grid = grid.replace('{/* END PAYMENTS SECTION */}', '</div>)}');

grid = grid.replace('{/* SOCIALS SECTION */}', '{isSecVisible("socials") && (<div className="w-full">');
grid = grid.replace('{/* END SOCIALS SECTION */}', '</div>)}');

fs.writeFileSync('src/components/ActionGrid.tsx', grid, 'utf8');

console.log('Dynamic frontend updated');
