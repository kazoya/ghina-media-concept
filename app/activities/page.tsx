import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHead, Source } from "@/components/ui";
import { activities, relationships } from "@/lib/site";

export const metadata: Metadata = { title: "الأنشطة والأعمال الموثقة" };

const relationNote: Record<(typeof relationships)[number], string> = {
  "اتفاقية وقّعتها الشركة": "ذكرت الصفحة المنشورة توقيع الشركة نفسها على الاتفاقية أو المذكرة.",
  "متحدثة أو ضيفة جلسة": "ظهور بصفة متحدثة أو ضيفة في جلسة أو لقاء إعلامي.",
  "مشاركة في فعالية": "حضور أو مشاركة — لا يعني شراكة تجارية أو اعتماداً من الجهة المنظِّمة.",
  "لقاء واجتماع": "لقاءات واجتماعات مذكورة دون تفاصيل عن نتائجها.",
};

const story = [
  { k: "السياق", v: "متجر إلكتروني ناشئ يعتمد على إنستغرام فقط، والاستفسارات تضيع في الرسائل." },
  { k: "المساهمة", v: "تشخيص، ثم تنظيم مسار الطلب إلى واتساب، وتقويم محتوى لشهر." },
  { k: "المخرجات", v: "رسالة ترحيب وردود جاهزة، و12 منشوراً مجدولاً." },
  { k: "الدليل", v: "في قصة حقيقية: رابط منشور أو إذن مكتوب من العميل." },
  { k: "النتيجة", v: "تُذكر فقط إن ثبتت بأرقام يوافق العميل على نشرها — وإلا تُترك فارغة." },
];

export default function ActivitiesPage() {
  return (
    <>
      <PageHead kicker="الأنشطة والأعمال الموثقة" title="ما هو منشور فعلاً، مصنّفاً حسب نوع العلاقة">
        <p>
          كل بند منشور في صفحة Our Activities. صنّفناه حسب ما تقوله الصياغة المنشورة حرفياً حتى لا تبدو المشاركة في فعالية كأنها شراكة أو اعتماد.
        </p>
      </PageHead>
      <div className="grid gap-12">
        {relationships.map((rel) => {
          const items = activities.filter((a) => a.relationship === rel);
          return (
            <section key={rel} aria-labelledby={`rel-${rel}`}>
              <h2 id={`rel-${rel}`} className="flex items-center gap-3 text-xl font-bold">
                <span className="h-6 w-1 rounded-full bg-gold" aria-hidden />
                {rel}
                <span className="rounded-full border border-line px-2 text-sm font-normal text-muted">{items.length}</span>
              </h2>
              <p className="mt-2 text-sm text-muted">{relationNote[rel]}</p>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {items.map((a) => (
                  <li key={a.text} data-reveal data-spotlight className="card card-hover grid gap-3 p-5 leading-8">
                    <span>{a.text}</span>
                    <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="rounded-full border border-line px-2 py-0.5">{a.theme}</span>
                      <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 underline-offset-4 hover:text-gold-strong hover:underline">
                        المصدر: ghinamedia.com <ExternalLink size={12} aria-hidden />
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section aria-labelledby="story" className="mt-16">
        <h2 id="story" className="text-xl font-bold">
          قالب «قصة عمل» صادقة
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          لا توجد قصص عملاء منشورة بتفاصيل ونتائج على الموقع حالياً، لذلك لا نعرض أي عميل. هذا قالب مقترح لعرض الأعمال مستقبلاً بموافقة أصحابها، ومعه مثال توضيحي
          بحت.
        </p>
        <div className="card mt-5 p-6" data-illustrative>
          <p className="mb-4 inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-strong">حالة توضيحية — ليست عميلاً حقيقياً ولا نتيجة فعلية</p>
          <dl className="grid gap-3 sm:grid-cols-[8rem_1fr]">
            {story.map((s) => (
              <div key={s.k} className="contents">
                <dt className="font-bold text-gold-strong">{s.k}</dt>
                <dd className="leading-7 text-muted">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Source page="Our Activities" />
    </>
  );
}
