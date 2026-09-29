import Link from "next/link";
import { ArrowLeft, Compass, GraduationCap, Handshake, Sparkles } from "lucide-react";
import { CtaLink } from "@/components/ui";
import { activities, brand, groups, published, services, trainings, waLink } from "@/lib/site";

const partners = [
  "جامعة اليرموك",
  "جامعة العلوم والتكنولوجيا",
  "مؤسسة عبد الحميد شومان",
  "Boost With Meta",
  "Orange Corners",
  "جيبا",
  "مؤسسة مساواة",
  "أكاديمية الأثال",
  "Foras Palestine",
  "مركز الملكة رانيا للريادة",
];

export default function Home() {
  return (
    <>
      <section className="grain -mx-4 rounded-b-[2.5rem] px-4 pb-16 pt-10 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs font-bold text-gold-strong">
              <Sparkles size={14} aria-hidden /> وكالة تسويق رقمي وتدريب · إربد، الأردن
            </p>
            <h1 className="rise rise-2 mt-5 text-4xl font-bold leading-[1.35] md:text-6xl">
              تسويق رقمي <span className="gold-text">يتحوّل إلى طلبات</span>، لا إلى إعجابات فقط.
            </h1>
            <p className="rise rise-3 mt-5 max-w-xl text-lg leading-9 text-muted">
              {published.experience}، بتخصص في {published.specialties.join("، ")}. أجب عن خمسة أسئلة واحصل على توصيات أولية
              تفتحها في واتساب وترسلها بنفسك إلى غنى ميديا.
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
              <CtaLink href="/planner">
                خطّط حملتك في دقيقة <ArrowLeft size={18} aria-hidden />
              </CtaLink>
              <CtaLink href={waLink("مرحباً غنى ميديا، رأيت المنصة وأرغب بمكالمة اليوم.")} ghost>
                تحدّث مع غنى الآن
              </CtaLink>
            </div>
          </div>
          <div className="rise rise-2 grid grid-cols-2 gap-3">
            {[
              { n: `${services.length}`, l: "خدمة منشورة" },
              { n: `${trainings.length}`, l: "برنامجاً تدريبياً مذكوراً" },
              { n: `${activities.length}`, l: "نشاطاً وشراكة موثّقة" },
              { n: "+10", l: "سنوات خبرة (كما نُشر)" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-line bg-paper/80 p-5">
                <p className="gold-text text-4xl font-bold">{s.n}</p>
                <p className="mt-1 text-sm text-muted">{s.l}</p>
              </div>
            ))}
            <p className="col-span-2 text-xs text-muted">الأعداد محسوبة من صفحات ghinamedia.com كما هي، دون أي تقدير.</p>
          </div>
        </div>
      </section>

      <section aria-label="جهات وبرامج مذكورة في صفحتي التدريب والأنشطة" className="-mx-4 overflow-hidden border-y border-line bg-paper py-4">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-muted">
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-sm">
              {p}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">لماذا يتصل بك صاحب المشروع اليوم؟</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Compass,
              t: "يعرف ماذا يحتاج قبل المكالمة",
              d: "مخطِّط الحملة يرتّب الهدف والقنوات والفجوات، فتبدأ المكالمة من الحل لا من الأسئلة.",
            },
            {
              icon: GraduationCap,
              t: "مدرّبة وليست منفّذة فقط",
              d: `${published.meta} الفريق يتعلم بدل أن يبقى معتمداً على الوكالة.`,
            },
            {
              icon: Handshake,
              t: "حضور حقيقي في منظومة الريادة",
              d: "شراكات ومذكرات تفاهم مع جامعات ومؤسسات تمكين وريادة — منشورة بالاسم في صفحة الأنشطة.",
            },
          ].map((c) => (
            <article key={c.t} className="rounded-2xl border border-line bg-paper p-6 transition hover:border-gold/50">
              <c.icon className="text-gold" size={28} aria-hidden />
              <h3 className="mt-4 text-lg font-bold">{c.t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">الخدمات في ثلاث مسارات</h2>
          <Link href="/services" className="text-sm font-bold text-gold-strong hover:underline">
            كل الخدمات
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(Object.keys(groups) as (keyof typeof groups)[]).map((g) => (
            <div key={g} className="rounded-2xl border border-line bg-raised p-6">
              <p className="font-bold text-gold-strong">{groups[g]}</p>
              <ul className="mt-3 grid gap-2 text-sm">
                {services
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <li key={s.id} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                      {s.ar}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 rounded-3xl border border-line bg-paper p-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold text-gold">الرؤية</p>
          <p className="mt-2 leading-8">{published.vision}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-gold">الرسالة</p>
          <p className="mt-2 leading-8">{published.mission}</p>
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-gold p-8 text-bg md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">مكالمة واحدة تكفي لتعرف من أين تبدأ.</h2>
        <p className="mt-3 max-w-2xl leading-8">
          العرض والسعر تحددهما غنى ميديا مباشرة — هذه المنصة التجريبية لا تسعّر شيئاً ولا تتحدث باسم الشركة.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-bg px-6 py-3 font-bold text-gold-strong">
            واتساب غنى ميديا
          </a>
          <a href={`mailto:${brand.email}`} className="rounded-full border border-bg/40 px-6 py-3 font-bold">
            {brand.email}
          </a>
        </div>
      </section>
    </>
  );
}
