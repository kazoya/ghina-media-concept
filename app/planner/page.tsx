import type { Metadata } from "next";
import { Suspense } from "react";
import { Studio } from "@/components/studio/studio";
import { PageHead } from "@/components/ui";
import { brand } from "@/lib/site";

export const metadata: Metadata = { title: "استوديو خطة النمو" };

export default function PlannerPage() {
  return (
    <>
      <div className="print:hidden">
        <PageHead kicker="استوديو خطة النمو" title="من خمسة أسئلة إلى خطة 30 يوماً تناقشها مع غنى ميديا">
          <p>
            أجب عن وضع مشروعك الآن. ستحصل على توصيات أولية مفسّرة (بقواعد ثابتة)، وخطة من أربع مراحل، وتقويم محتوى قابل للتعديل،
            ثم تصدّر موجزك أو تفتحه في واتساب وترسله بنفسك. لا حساب ولا خادم: كل شيء يبقى في متصفحك إلا إذا صدّرته.
          </p>
        </PageHead>
      </div>
      <Suspense
        fallback={
          <div className="card min-h-[675px] p-8 text-muted md:min-h-[485px]" aria-busy="true">
            <p>جارٍ تحميل الاستوديو…</p>
            <noscript>
              <p className="mt-2">
                الاستوديو يحتاج JavaScript. يمكنك التواصل مباشرة:{" "}
                <a className="underline" href={brand.whatsappUrl}>
                  واتساب غنى ميديا
                </a>
                .
              </p>
            </noscript>
          </div>
        }
      >
        <Studio />
      </Suspense>
    </>
  );
}
