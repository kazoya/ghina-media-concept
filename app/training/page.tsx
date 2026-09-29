import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { published, trainings, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "التدريب" };

export default function TrainingPage() {
  return (
    <>
      <PageHead kicker="التدريب وورش العمل" title="تدريب يترك فريقك أقوى بعد انتهاء العقد">
        <p>{published.meta} هذه البرامج والجهات مذكورة بالاسم في صفحة Training (أزيل التكرار فقط).</p>
      </PageHead>
      <ol className="grid gap-3 md:grid-cols-2">
        {trainings.map((t, i) => (
          <li key={t} data-reveal className="card card-hover flex items-start gap-4 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold-strong">{i + 1}</span>
            <span className="pt-2 leading-7">{t}</span>
          </li>
        ))}
      </ol>
      <section className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-gold/40 bg-gold-soft p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold">
            <GraduationCap className="text-gold" aria-hidden /> ورشة لجامعتك أو مؤسستك أو برنامجك؟
          </p>
          <p className="mt-1 text-sm text-muted">الموضوع والمدة وعدد المشاركين والتكلفة تُتفق مع غنى ميديا مباشرة.</p>
        </div>
        <CtaLink href={waLink("مرحباً غنى ميديا، نرغب بتنظيم ورشة تدريبية. الجهة: … الموضوع: … عدد المشاركين: …")}>اطلب ورشة</CtaLink>
      </section>
      <Source page="Training" />
    </>
  );
}
