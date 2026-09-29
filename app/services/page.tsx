import type { Metadata } from "next";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { groups, services, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "الخدمات" };

export default function ServicesPage() {
  return (
    <>
      <PageHead kicker="الخدمات" title="من الظهور إلى الطلب، ومن التنفيذ إلى التمكين">
        <p>
          الخدمات الإحدى عشرة كما تظهر في صفحة Services. الوصف المختصر شرح عام لكل خدمة، أما النطاق والسعر فيُحددان مع غنى
          ميديا.
        </p>
      </PageHead>
      {(Object.keys(groups) as (keyof typeof groups)[]).map((g) => (
        <section key={g} className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-gold-strong">{groups[g]}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((s) => s.group === g)
              .map((s) => (
                <article key={s.id} data-reveal data-spotlight className="card card-hover flex flex-col p-6">
                  <h3 className="text-lg font-bold">{s.ar}</h3>
                  <p className="text-xs text-muted" dir="ltr">
                    {s.en}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted">{s.desc}</p>
                  <a
                    href={waLink(`مرحباً غنى ميديا، أستفسر عن خدمة: ${s.ar}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-bold text-gold-strong hover:underline"
                  >
                    اسأل عن هذه الخدمة ←
                  </a>
                </article>
              ))}
          </div>
        </section>
      ))}
      <CtaLink href="/planner">لا تعرف أيّها تحتاج؟ جرّب المخطِّط</CtaLink>
      <Source page="Services" />
    </>
  );
}
