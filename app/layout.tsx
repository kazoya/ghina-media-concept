import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Interactions } from "@/components/interactions";
import { SalesBar } from "@/components/sales-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { disclaimer } from "@/lib/site";
import "./globals.css";

const kufi = localFont({
  src: [
    { path: "./fonts/DroidArabicKufi-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/DroidArabicKufi-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-kufi",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "غنى ميديا — تصوّر تجريبي مستقل", template: "%s | تصوّر تجريبي لغنى ميديا" },
  description:
    "تصوّر تجريبي مستقل غير تابع للموقع الرسمي لغنى ميديا: مخطِّط حملة بتوصيات أولية، وعرض للخدمات والتدريب والأنشطة كما نُشرت على ghinamedia.com.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#110f0d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={kufi.variable} suppressHydrationWarning>
      <head>
        {/* يُفعَّل الصنف js قبل الرسم ليُخفى محتوى الظهور الناعم فقط حين يعمل JavaScript */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-bg"
        >
          تخطَّ إلى المحتوى
        </a>
        <div role="note" className="bg-gold px-4 py-1.5 text-center text-xs font-bold text-bg">
          {disclaimer} ·{" "}
          <a href="https://ghinamedia.com" target="_blank" rel="noopener noreferrer" className="underline">
            الموقع الرسمي: ghinamedia.com
          </a>
        </div>
        <SiteHeader />
        <main id="main" className="mx-auto max-w-6xl px-4 pb-24 pt-8">
          {children}
        </main>
        <SiteFooter />
        <SalesBar />
        <Interactions />
      </body>
    </html>
  );
}
