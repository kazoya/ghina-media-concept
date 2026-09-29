import type { Metadata } from "next";
import { Bot, CalendarCheck, FileText, Globe2, Inbox, Megaphone } from "lucide-react";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "فرص التطوير" };

const items = [
  {
    icon: Inbox,
    t: "استقبال طلبات منظّم عبر واتساب",
    now: "رقم واتساب ظاهر في صفحة التواصل، والاستفسار يبدأ من الصفر في كل مرة.",
    next: "مخطِّط الحملة (مبني في هذه المنصة) يرسل موجزاً جاهزاً: النشاط، الهدف، القنوات، الموعد.",
    gate: "الرد والعرض يبقيان بيد غنى ميديا.",
  },
  {
    icon: Globe2,
    t: "نسخة عربية كاملة للموقع",
    now: "الموقع الرسمي بالإنجليزية بينما الأنشطة والجمهور المحلي بالعربية.",
    next: "واجهة عربية RTL أولاً — كما في هذا التصور — مع الإبقاء على الإنجليزية للجهات الدولية.",
    gate: "مراجعة الصياغة من غنى ميديا قبل النشر.",
  },
  {
    icon: CalendarCheck,
    t: "حجز الاستشارات والورش",
    now: "لا يوجد حجز موعد ظاهر؛ التواصل عبر الهاتف والبريد.",
    next: "روزنامة مواعيد استشارة قصيرة وطلب ورشة بنموذج واحد.",
    gate: "تأكيد الموعد يدوي حتى تُعتمد القواعد.",
  },
  {
    icon: FileText,
    t: "صفحة لكل برنامج تدريبي",
    now: "أسماء البرامج مدرجة كعناوين دون تفاصيل أو صور منظمة.",
    next: "بطاقة لكل برنامج: الجهة، الفئة، المحاور، صور مختارة — تتحول إلى ملف أعمال مقنع للجهات القادمة.",
    gate: "نشر أسماء وصور الجهات بموافقتها.",
  },
  {
    icon: Megaphone,
    t: "نشر الأنشطة تلقائياً على لينكدإن",
    now: "الأنشطة منشورة في صفحة Our Activities كنصوص وصور.",
    next: "مسودة منشور تُولَّد من كل نشاط جديد وتنتظر الاعتماد.",
    gate: "لا نشر باسم الشركة دون اعتماد بشري.",
  },
  {
    icon: Bot,
    t: "مساعد أسئلة شائعة بالعربية",
    now: "لا يوجد قسم أسئلة شائعة.",
    next: "إجابات معتمدة عن الخدمات وطريقة العمل، وتحويل أي سؤال عن السعر إلى واتساب.",
    gate: "المساعد لا يعطي أسعاراً ولا وعوداً.",
  },
];

export default function OpportunitiesPage() {
  return (
    <>
      <PageHead kicker="فرص التطوير والأتمتة" title="ما الذي يمكن أن تضيفه المنصة لغنى ميديا؟">
        <p>
          ملاحظات من فحص الموقع العلني بتاريخ 2026-09-29، بصيغة فرص لا انتقادات. كل أتمتة هنا تقترح فقط، والقرار النهائي
          بشري.
        </p>
      </PageHead>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <article key={it.t} className="rounded-2xl border border-line bg-paper p-6">
            <it.icon className="text-gold" size={26} aria-hidden />
            <h2 className="mt-3 text-lg font-bold">{it.t}</h2>
            <dl className="mt-3 grid gap-2 text-sm leading-7">
              <div>
                <dt className="inline font-bold text-muted">الآن: </dt>
                <dd className="inline text-muted">{it.now}</dd>
              </div>
              <div>
                <dt className="inline font-bold text-gold-strong">المقترح: </dt>
                <dd className="inline">{it.next}</dd>
              </div>
              <div>
                <dt className="inline font-bold text-ok">بوابة بشرية: </dt>
                <dd className="inline text-muted">{it.gate}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
