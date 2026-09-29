import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass, GraduationCap, Handshake, Sparkles } from "lucide-react";
import { HeroParticles } from "@/components/hero-particles";
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
      <section className="grain relative -mx-4 -mt-8 overflow-hidden rounded-b-[2.5rem] border-b border-line px-4 pb-16 pt-14 md:pt-20">
        <HeroParticles />
        <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-gold/40 bg-bg/60 px-3 py-1 text-xs font-bold text-gold-strong backdrop-blur">
              <Sparkles size={14} aria-hidden /> وكالة تسويق رقمي وتدريب · إربد، الأردن
            </p>
            <h1 className="rise rise-2 mt-5 text-4xl font-bold leading-[1.35] md:text-6xl md:leading-[1.3]">
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
              <div key={s.l} data-spotlight className="card card-hover p-5">
                <p className="gold-text text-4xl font-bold tabular-nums">{s.n}</p>
                <p className="mt-1 text-sm text-muted">{s.l}</p>
              </div>
            ))}
            <p className="col-span-2 text-xs text-muted">الأعداد محسوبة من صفحات ghinamedia.com كما هي، دون أي تقدير.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="partners" className="mt-12" data-reveal>
        <h2 id="partners" className="text-center text-sm font-bold text-muted">
          جهات وبرامج مذكورة في صفحتي التدريب والأنشطة
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {partners.map((p) => (
            <li key={p} className="rounded-full border border-line bg-paper px-4 py-1.5 text-sm text-ink/85 transition-colors hover:border-line-strong">
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section id="founder" className="mt-20 grid scroll-mt-24 items-center gap-10 md:grid-cols-[1fr_1.4fr]" aria-labelledby="founder-title">
        <div data-reveal className="relative mx-auto w-4/5 max-w-sm md:w-full">
          <div aria-hidden className="absolute inset-[12%] rounded-full bg-gold/20 blur-3xl" />
          <Image
            src="/ghina-fahmawi.webp"
            alt={`${brand.lead}، مؤسسة غنى ميديا`}
            width={720}
            height={720}
            sizes="(min-width: 768px) 380px, 80vw"
            className="relative w-full"
          />
        </div>
        <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
          <p className="text-sm font-bold text-gold">من وراء غنى ميديا</p>
          <h2 id="founder-title" className="mt-2 text-3xl font-bold">
            {brand.lead}
          </h2>
          <p className="mt-1 text-muted">مؤسسة غنى ميديا · مدرّبة تسويق رقمي</p>
          <ul className="mt-6 grid gap-3 leading-8">
            {[
              `${published.experience}.`,
              published.meta,
              "قدّمت تدريباً في برامج وجهات منها Boost With Meta وجامعة العلوم والتكنولوجيا ومؤسسة عبد الحميد شومان.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CtaLink href={waLink(`مرحباً ${brand.lead}، رأيت المنصة وأرغب بمكالمة قصيرة.`)}>تحدّث مع غنى مباشرة</CtaLink>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold" data-reveal>
          لماذا يتصل بك صاحب المشروع اليوم؟
        </h2>
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
          ].map((c, i) => (
            <article key={c.t} data-reveal data-spotlight style={{ "--i": i } as React.CSSProperties} className="card card-hover p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-soft">
                <c.icon className="text-gold-strong" size={24} aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold">{c.t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4" data-reveal>
          <h2 className="text-2xl font-bold">الخدمات في ثلاث مسارات</h2>
          <Link href="/services" className="inline-flex min-h-11 items-center text-sm font-bold text-gold-strong hover:underline">
            كل الخدمات ←
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(Object.keys(groups) as (keyof typeof groups)[]).map((g, i) => (
            <div key={g} data-reveal data-spotlight style={{ "--i": i } as React.CSSProperties} className="card card-hover p-6">
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

      <section data-reveal className="card mt-20 grid gap-8 p-8 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold text-gold">الرؤية</p>
          <p className="mt-2 leading-8">{published.vision}</p>
        </div>
        <div className="md:border-s md:border-line md:ps-8">
          <p className="text-sm font-bold text-gold">الرسالة</p>
          <p className="mt-2 leading-8">{published.mission}</p>
        </div>
      </section>

      <section data-reveal className="relative mt-20 overflow-hidden rounded-3xl bg-gold p-8 text-bg md:p-12">
        <div aria-hidden className="absolute -start-24 -top-24 size-72 rounded-full bg-gold-strong/60 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold md:text-3xl">مكالمة واحدة تكفي لتعرف من أين تبدأ.</h2>
          <p className="mt-3 max-w-2xl leading-8">
            العرض والسعر تحددهما غنى ميديا مباشرة — هذه المنصة التجريبية لا تسعّر شيئاً ولا تتحدث باسم الشركة.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn bg-bg text-gold-strong hover:bg-raised">
              واتساب غنى ميديا
            </a>
            <a href={`mailto:${brand.email}`} className="btn border border-bg/40 hover:bg-bg/10">
              {brand.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
