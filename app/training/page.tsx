import type { Metadata } from "next";
import { GraduationCap, MessageCircle } from "lucide-react";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { published, services, trainingPaths, trainings, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "التدريب" };

export default function TrainingPage() {
  return (
    <>
      <PageHead kicker="التدريب وورش العمل" title="تدريب يترك فريقك أقوى بعد انتهاء العقد">
        <p>{published.meta} اختر مساراً استرشادياً يناسبك، أو تصفّح البرامج والجهات المذكورة بالاسم في صفحة Training.</p>
      </PageHead>

      <section aria-labelledby="paths">
        <h2 id="paths" className="text-xl font-bold">
          مسارات استرشادية
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          تجميع تقترحه هذه المنصة من موضوعات التدريب المنشورة فقط — ليست برامج معلنة من غنى ميديا، ولا مواعيد أو مقاعد أو شهادات. الطلب يفتح رسالة استفسار ترسلها
          بنفسك.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {trainingPaths.map((p, i) => (
            <article key={p.id} data-path={p.id} data-reveal data-spotlight style={{ "--i": i } as React.CSSProperties} className="card card-hover flex flex-col p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-gold-soft">
                <GraduationCap className="text-gold-strong" size={22} aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.forWho}</p>
              <p className="mt-4 text-xs font-bold text-muted">موضوعات ظهرت في تدريبات منشورة</p>
              <ul className="mt-2 grid gap-1.5 text-sm leading-7">
                {p.trainingIdx.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {trainings[t]}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-bold text-muted">خدمات مرتبطة</p>
              <p className="mt-1 text-sm">{p.serviceIds.map((id) => services.find((s) => s.id === id)?.ar).join("، ")}</p>
              <a
                href={waLink(`مرحباً غنى ميديا، أستفسر عن تدريب يناسب «${p.title}» (مسار مقترح من التصوّر التجريبي). عدد المشاركين: … الموعد المناسب: …`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-auto text-sm"
                style={{ marginTop: "1.25rem" }}
              >
                <MessageCircle size={16} aria-hidden /> استفسر عن هذا المسار
              </a>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="delivered" className="mt-14">
        <h2 id="delivered" className="text-xl font-bold">
          برامج وجهات مذكورة في صفحة Training
        </h2>
        <p className="mt-2 text-sm text-muted">الأسماء كما نُشرت، مع إزالة التكرار فقط.</p>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {trainings.map((t, i) => (
            <li key={t} data-reveal className="card card-hover flex items-start gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold-strong">{i + 1}</span>
              <span className="pt-2 leading-7">{t}</span>
            </li>
          ))}
        </ol>
      </section>

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
