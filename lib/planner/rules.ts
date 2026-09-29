// محرك التوصيات: قواعد ثابتة معلنة، ليست ذكاءً اصطناعياً ولا رأي خبير بشري.
// الثوابت: نفس المدخلات + نفس RULE_VERSION → نفس الترتيب ونفس reasonCodes؛ لا خدمة مكررة؛ لا serviceId مفقود.
import { services, type ServiceId } from "../site.ts";
import { businessLabel, channelLabel, goalLabel, teamLabel } from "./dict.ts";
import type { AnswersV1, ChecklistItem, Gap, PlanV1, ReasonCode, Recommendation } from "./types.ts";

export const RULE_VERSION = "2026-09-29.1";
export const MAX_CORE = 3;
export const MAX_OPTIONAL = 1;

type Rule = { when: (a: AnswersV1) => boolean; code: ReasonCode; add: Partial<Record<ServiceId, number>>; reason: (a: AnswersV1) => string };

const has = (a: AnswersV1, c: AnswersV1["channelIds"][number]) => a.channelIds.includes(c);

// كل قاعدة تشرح نفسها بالإجابة التي أطلقتها
export const RULES: Rule[] = [
  { when: (a) => a.goalId === "leads", code: "goal:leads", add: { social: 3, sem: 3, consult: 1 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يحتاج قناة تجلب طلبات الآن: إعلانات بحث أو محتوى وإعلانات على التواصل الاجتماعي.` },
  { when: (a) => a.goalId === "search", code: "goal:search", add: { seo: 3, sem: 2 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}»: الترتيب العضوي يبني ظهوراً دائماً، وإعلانات البحث تسد الفجوة حتى يتحسن.` },
  { when: (a) => a.goalId === "social", code: "goal:social", add: { social: 3, graphic: 2, photo: 1 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يعتمد على محتوى منتظم وصور وتصاميم متسقة.` },
  { when: (a) => a.goalId === "identity", code: "goal:identity", add: { graphic: 3, photo: 2 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يبدأ بالتصميم والصورة قبل أي حملة.` },
  { when: (a) => a.goalId === "website", code: "goal:website", add: { web: 3, seo: 2 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}»: الموقع أولاً، مع بنية تساعد الظهور في البحث من البداية.` },
  { when: (a) => a.goalId === "training", code: "goal:training", add: { training: 3, meta: 2, coaching: 1 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يجعل التدريب أولوية على التنفيذ.` },
  { when: (a) => a.businessId === "startup", code: "business:startup", add: { coaching: 1, consult: 1 }, reason: (a) => `نشاطك «${businessLabel[a.businessId]}»: الإرشاد والتشخيص يوفّران تجارب مكلفة في البداية.` },
  { when: (a) => a.businessId === "ecommerce", code: "business:ecommerce", add: { web: 1, sem: 1 }, reason: (a) => `نشاطك «${businessLabel[a.businessId]}» يعتمد على متجر يعمل جيداً وعلى من يبحث عن المنتج.` },
  { when: (a) => a.businessId === "medical", code: "business:medical", add: { social: 1 }, reason: (a) => `نشاطك «${businessLabel[a.businessId]}»: المحتوى التوعوي على التواصل الاجتماعي خيار شائع — للنقاش حسب أنظمة القطاع.` },
  { when: (a) => a.businessId === "education", code: "business:education", add: { training: 1 }, reason: (a) => `نشاطك «${businessLabel[a.businessId]}» قريب من ورش التدريب التي تقدمها الوكالة.` },
  { when: (a) => a.businessId === "personal", code: "business:personal", add: { coaching: 1, photo: 1 }, reason: (a) => `نشاطك «${businessLabel[a.businessId]}» يعتمد على حضورك أنت: صورة احترافية ومرافقة شخصية.` },
  { when: (a) => a.teamId === "solo" || a.teamId === "nobody", code: "team:solo-or-nobody", add: { coaching: 2 }, reason: (a) => `إجابتك «${teamLabel[a.teamId]}» تعني أن التسويق يحتاج إيقاعاً يستطيع شخص واحد الالتزام به.` },
  { when: (a) => a.teamId === "team", code: "team:team", add: { meta: 1, training: 1 }, reason: (a) => `لديك «${teamLabel[a.teamId]}»: رفع مهارات الفريق يضاعف أثر أي خدمة.` },
  { when: (a) => !has(a, "website") && a.goalId !== "training", code: "channel:no-website", add: { web: 1 }, reason: () => `لم تختر «${channelLabel.website}» ضمن قنواتك الحالية.` },
  { when: (a) => has(a, "none"), code: "channel:none", add: { social: 1 }, reason: () => `اخترت «${channelLabel.none}»: أقرب قناة للبدء عادة صفحة على التواصل الاجتماعي.` },
  { when: () => true, code: "baseline:consult", add: { consult: 1 }, reason: () => "جلسة تشخيص قصيرة نقطة بداية مشتركة لأي خطة." },
];

const catalogOrder = new Map(services.map((s, i) => [s.id, i]));

const detail: Record<ServiceId, { prerequisites: string[]; deliverable: string }> = {
  sem: { prerequisites: ["صفحة هبوط أو رقم واتساب يستقبل الطلب", "ميزانية إعلانية تحددها أنت"], deliverable: "حملة بحث بكلمات مفتاحية وقياس للنقرات والطلبات" },
  seo: { prerequisites: ["موقع قائم أو قيد الإنشاء", "وصول لإدارة الموقع"], deliverable: "تدقيق وقائمة تحسينات مرتبة حسب الأثر" },
  social: { prerequisites: ["حسابات على المنصات المختارة", "من يرد على الرسائل"], deliverable: "خطة محتوى وإعلانات بجدول نشر" },
  graphic: { prerequisites: ["الشعار والألوان إن وُجدت"], deliverable: "قوالب منشورات وهوية بصرية متسقة" },
  photo: { prerequisites: ["موعد ومكان للتصوير"], deliverable: "مكتبة صور للمنتجات أو المكان أو الفريق" },
  web: { prerequisites: ["نطاق واستضافة أو قرار بشأنهما", "محتوى الصفحات الأساسية"], deliverable: "موقع أو متجر بصفحات تحوّل الزيارة إلى طلب" },
  training: { prerequisites: ["تحديد المشاركين وموعد مناسب"], deliverable: "ورشة عملية بمحاور متفق عليها" },
  meta: { prerequisites: ["أعضاء فريق يديرون حسابات Meta"], deliverable: "تحضير عملي لشهادات Meta" },
  courses: { prerequisites: ["وقت أسبوعي للتعلم"], deliverable: "مسار تعلم ذاتي" },
  consult: { prerequisites: ["روابط قنواتك الحالية"], deliverable: "تشخيص وقائمة أولويات" },
  coaching: { prerequisites: ["ساعة أسبوعية ثابتة"], deliverable: "جلسات مرافقة بمهام أسبوعية" },
};

export function recommend(a: AnswersV1): { recommendations: Recommendation[]; notChosen: PlanV1["notChosen"] } {
  const acc = new Map<ServiceId, { score: number; codes: ReasonCode[]; reasons: string[] }>();
  for (const rule of RULES) {
    if (!rule.when(a)) continue;
    const text = rule.reason(a);
    for (const [id, pts] of Object.entries(rule.add) as [ServiceId, number][]) {
      const cur = acc.get(id) ?? { score: 0, codes: [], reasons: [] };
      cur.score += pts;
      cur.codes.push(rule.code);
      cur.reasons.push(text);
      acc.set(id, cur);
    }
  }
  // ترتيب حتمي: الدرجة تنازلياً ثم ترتيب الكتالوج — لا يعتمد على ترتيب إضافة القواعد
  const ranked = [...acc.entries()]
    .filter(([id]) => catalogOrder.has(id))
    .sort(([ia, x], [ib, y]) => y.score - x.score || catalogOrder.get(ia)! - catalogOrder.get(ib)!);

  const recommendations: Recommendation[] = ranked.slice(0, MAX_CORE + MAX_OPTIONAL).map(([serviceId, v], i) => ({
    serviceId,
    rank: i + 1,
    tier: i < MAX_CORE ? "core" : "optional",
    score: v.score,
    reasonCodes: v.codes,
    reasons: v.reasons,
    ...detail[serviceId],
  }));

  const chosen = new Set(recommendations.map((r) => r.serviceId));
  const notChosen = services
    .filter((s) => !chosen.has(s.id))
    .map((s) => {
      const hit = acc.get(s.id);
      return {
        serviceId: s.id,
        why: hit ? `ارتبطت بإجاباتك بدرجة أقل (${hit.score}) من الخدمات المختارة؛ مرشّحة لمرحلة لاحقة.` : "لم ترتبط بأي من إجاباتك؛ يمكن إضافتها لاحقاً إن تغيّر الهدف.",
      };
    });
  return { recommendations, notChosen };
}

export function checklist(a: AnswersV1): ChecklistItem[] {
  return [
    { code: "social", label: "حساب على منصة تواصل اجتماعي", ok: has(a, "facebook") || has(a, "instagram") || has(a, "linkedin") },
    { code: "website", label: "موقع إلكتروني", ok: has(a, "website") },
    { code: "whatsapp", label: "واتساب للأعمال لاستقبال الطلبات", ok: has(a, "whatsapp") },
    { code: "owner", label: "شخص يدير التسويق", ok: a.teamId !== "nobody" },
    { code: "timeline", label: "موعد بدء محدد", ok: a.timelineId !== "exploring" },
  ];
}

export function gaps(a: AnswersV1): Gap[] {
  const out: Gap[] = [];
  if (!has(a, "website") && a.goalId !== "training")
    out.push({ code: "no-website", text: "قد لا يوجد مكان ثابت يجمع الزوار ويحوّلهم إلى طلبات — للنقاش حسب طبيعة نشاطك.", linkedServiceId: "web" });
  if (!has(a, "whatsapp")) out.push({ code: "no-whatsapp", text: "قد تضيع استفسارات دون قناة واتساب منظّمة لاستقبالها." });
  if (has(a, "none")) out.push({ code: "no-channels", text: "لا توجد قناة قائمة بعد؛ البداية بقناة واحدة أسهل من عدة قنوات.", linkedServiceId: "social" });
  if (a.teamId === "nobody" || a.teamId === "solo") out.push({ code: "single-owner", text: "التسويق يعتمد على شخص واحد أو لا أحد؛ الإيقاع الثابت أهم من الكثافة.", linkedServiceId: "coaching" });
  return out;
}

export function buildPlan(a: AnswersV1): PlanV1 {
  const { recommendations, notChosen } = recommend(a);
  return {
    ruleVersion: RULE_VERSION,
    inputs: a,
    recommendations,
    notChosen,
    gaps: gaps(a),
    checklist: checklist(a),
    assumptions: [
      "التوصيات ناتجة عن قواعد ثابتة معلنة في هذه المنصة، وليست تحليلاً بالذكاء الاصطناعي ولا تقييماً من غنى ميديا.",
      "لا تتضمن أسعاراً أو وعوداً بنتائج؛ العرض والسعر يحددهما غنى ميديا بعد التواصل.",
      "الخطة والتقويم قوالب أولية قابلة للتعديل الكامل.",
    ],
  };
}
