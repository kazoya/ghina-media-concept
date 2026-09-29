import { services, type ServiceId } from "./site";

export type Answers = {
  business: string;
  goal: string;
  channels: string[];
  team: string;
  timeline: string;
};

export const questions = {
  business: {
    q: "ما نوع نشاطك؟",
    options: ["مشروع ناشئ", "شركة صغيرة أو متوسطة", "متجر إلكتروني", "عيادة أو قطاع طبي", "جهة تدريبية أو جامعة", "علامة شخصية"],
  },
  goal: {
    q: "ما الهدف الأهم في الأشهر الثلاثة القادمة؟",
    options: ["مبيعات وطلبات أكثر", "ظهور في بحث Google", "حضور أقوى على السوشال ميديا", "هوية بصرية جديدة", "موقع أو متجر جديد", "تدريب فريقي"],
  },
  channels: {
    q: "ما القنوات التي لديك الآن؟ (اختر كل ما ينطبق)",
    options: ["صفحة فيسبوك", "إنستغرام", "لينكدإن", "موقع إلكتروني", "واتساب للأعمال", "لا شيء بعد"],
  },
  team: {
    q: "من يدير التسويق عندك اليوم؟",
    options: ["أنا وحدي", "موظف واحد", "فريق داخلي", "لا أحد"],
  },
  timeline: {
    q: "متى تريد البدء؟",
    options: ["هذا الأسبوع", "خلال شهر", "أستكشف فقط"],
  },
} as const;

const goalMap: Record<string, ServiceId[]> = {
  "مبيعات وطلبات أكثر": ["social", "sem", "consult"],
  "ظهور في بحث Google": ["seo", "sem"],
  "حضور أقوى على السوشال ميديا": ["social", "graphic", "photo"],
  "هوية بصرية جديدة": ["graphic", "photo"],
  "موقع أو متجر جديد": ["web", "seo"],
  "تدريب فريقي": ["training", "meta"],
};

const businessMap: Record<string, ServiceId[]> = {
  "مشروع ناشئ": ["coaching"],
  "متجر إلكتروني": ["web", "sem"],
  "عيادة أو قطاع طبي": ["social"],
  "جهة تدريبية أو جامعة": ["training"],
  "علامة شخصية": ["coaching", "photo"],
};

export type Plan = {
  services: typeof services;
  readiness: number;
  gaps: string[];
  priority: "عالية" | "متوسطة" | "استكشافية";
};

export function buildPlan(a: Answers): Plan {
  const picked: ServiceId[] = [];
  const add = (ids: ServiceId[] = []) => ids.forEach((id) => !picked.includes(id) && picked.push(id));
  add(goalMap[a.goal]);
  add(businessMap[a.business]);
  if (a.team === "أنا وحدي" || a.team === "لا أحد") add(["coaching"]);
  if (a.team === "فريق داخلي") add(["meta"]);
  if (!a.channels.includes("موقع إلكتروني") && a.goal !== "تدريب فريقي") add(["web"]);
  add(["consult"]);

  const real = a.channels.filter((c) => c !== "لا شيء بعد");
  let readiness = 20 + real.length * 12;
  if (a.team === "فريق داخلي") readiness += 15;
  else if (a.team === "موظف واحد") readiness += 8;
  readiness = Math.max(10, Math.min(95, readiness));

  const gaps: string[] = [];
  if (!real.includes("موقع إلكتروني")) gaps.push("لا يوجد موقع يجمع الزوار ويحوّلهم إلى طلبات");
  if (!real.includes("واتساب للأعمال")) gaps.push("لا قناة واتساب منظّمة لاستقبال الاستفسارات");
  if (!real.includes("إنستغرام") && !real.includes("صفحة فيسبوك")) gaps.push("غياب عن منصات Meta حيث يقضي جمهورك وقته");
  if (a.team === "لا أحد" || a.team === "أنا وحدي") gaps.push("التسويق يعتمد على شخص واحد أو لا أحد — يحتاج خطة وإيقاعاً ثابتاً");

  const priority = a.timeline === "هذا الأسبوع" ? "عالية" : a.timeline === "خلال شهر" ? "متوسطة" : "استكشافية";

  return {
    services: picked.slice(0, 4).map((id) => services.find((s) => s.id === id)!),
    readiness,
    gaps,
    priority,
  };
}

export function briefMessage(name: string, a: Answers, plan: Plan) {
  return [
    "مرحباً غنى ميديا 👋",
    name ? `أنا ${name}.` : "",
    `نشاطي: ${a.business}`,
    `هدفي: ${a.goal}`,
    `قنواتي الحالية: ${a.channels.join("، ") || "—"}`,
    `إدارة التسويق: ${a.team}`,
    `موعد البدء: ${a.timeline}`,
    `الخدمات المقترحة للنقاش: ${plan.services.map((s) => s.ar).join("، ")}`,
    "(وصلت من تصوّر تجريبي مستقل) أرغب بمكالمة قصيرة لتحديد الخطة والعرض المناسب.",
  ]
    .filter(Boolean)
    .join("\n");
}
