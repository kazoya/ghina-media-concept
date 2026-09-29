import type { Metadata } from "next";
import { DevQr } from "@/components/qr";
import { CtaLink, PageHead } from "@/components/ui";
import { developer, disclaimer } from "@/lib/site";

export const metadata: Metadata = { title: "فكرة المنصة" };

export default function DeveloperPage() {
  return (
    <>
      <PageHead kicker="عن هذا التصور" title={disclaimer}>
        <p>
          بُنيت هذه المنصة كتصور مستقل لعرضه على غنى ميديا: واجهة عربية أولاً، مخطِّط حملة يحوّل الزائر إلى موجز واتساب
          جاهز، وعرض منظم للخدمات والتدريب والأنشطة كما هي منشورة. لا توجد قاعدة بيانات، ولا تسعير آلي، ولا أي إرسال دون
          نقرة المستخدم.
        </p>
      </PageHead>
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-line bg-paper p-8 md:flex-row md:items-center">
        <DevQr />
        <div>
          <p className="text-lg font-bold">{developer.name}</p>
          <p className="mt-1 text-sm text-muted">لتعديل التصور أو تحويله إلى موقع رسمي.</p>
          <div className="mt-4">
            <CtaLink href={developer.whatsappUrl} ghost>
              واتساب المطوّر
            </CtaLink>
          </div>
        </div>
      </div>
    </>
  );
}
