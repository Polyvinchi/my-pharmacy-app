import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({ 
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'صيدلية د. إيمان',
  },
  icons: {
    apple: '/logo.png',
  },
  title: "صيدلية د. إيمان عبد الوهاب",
  description: "رعاية صحية متكاملة",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0D47A1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className={`${tajawal.className} antialiased bg-gradient-to-br from-slate-200 via-blue-50 to-emerald-100 min-h-screen text-slate-900`}>
        {children}
        <script dangerouslySetInnerHTML={{ __html: [
          "if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js');});}",
          "window.__pwaPrompt=null;window.__pwaPromptListeners=[];",
          "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaPrompt=e;(window.__pwaPromptListeners||[]).forEach(function(fn){fn(e);});});",
        ].join('') }} />
      </body>
    </html>
  );
}
