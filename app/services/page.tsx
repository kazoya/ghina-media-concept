import type { Metadata } from "next";
import { ServiceExplorer } from "@/components/service-explorer";
import { CtaLink, PageHead, Source } from "@/components/ui";

export const metadata: Metadata = { title: "الخدمات" };

export default function ServicesPage() {
  return (
    <>
      <PageHead kicker="استكشف الخدمات" title="من الظهور إلى الطلب، ومن التنفيذ إلى التمكين">
        <p>
          الخدمات الإحدى عشرة كما تظهر في صفحة Services. رشّحها حسب المسار، وافتح «متى تحتاجها؟»، أو ابدأ خطة مبنية على اتجاه الخدمة. النطاق والسعر يُحددان مع غنى
          ميديا.
        </p>
      </PageHead>
      <ServiceExplorer />
      <div className="mt-10">
        <CtaLink href="/planner">لا تعرف أيّها تحتاج؟ ابدأ خطة نموك</CtaLink>
      </div>
      <Source page="Services" />
    </>
  );
}
