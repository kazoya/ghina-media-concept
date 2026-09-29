// القاموس العربي للمعرّفات. أي نص يظهر للزائر عن الإجابات يأتي من هنا.
import type { BusinessId, ChannelId, GoalId, PostChannel, PostStatus, TeamId, TimelineId } from "./types.ts";

export const businessLabel: Record<BusinessId, string> = {
  startup: "مشروع ناشئ",
  sme: "شركة صغيرة أو متوسطة",
  ecommerce: "متجر إلكتروني",
  medical: "عيادة أو قطاع طبي",
  education: "جهة تدريبية أو جامعة",
  personal: "علامة شخصية",
};

export const goalLabel: Record<GoalId, string> = {
  leads: "مبيعات وطلبات أكثر",
  search: "ظهور في بحث Google",
  social: "حضور أقوى على السوشال ميديا",
  identity: "هوية بصرية جديدة",
  website: "موقع أو متجر جديد",
  training: "تدريب فريقي",
};

export const channelLabel: Record<ChannelId, string> = {
  facebook: "صفحة فيسبوك",
  instagram: "إنستغرام",
  linkedin: "لينكدإن",
  website: "موقع إلكتروني",
  whatsapp: "واتساب للأعمال",
  none: "لا شيء بعد",
};

export const teamLabel: Record<TeamId, string> = {
  solo: "أنا وحدي",
  one: "موظف واحد",
  team: "فريق داخلي",
  nobody: "لا أحد",
};

export const timelineLabel: Record<TimelineId, string> = {
  week: "هذا الأسبوع",
  month: "خلال شهر",
  exploring: "أستكشف فقط",
};

export const postChannelLabel: Record<PostChannel, string> = {
  facebook: "فيسبوك",
  instagram: "إنستغرام",
  linkedin: "لينكدإن",
  whatsapp: "واتساب",
  website: "الموقع",
};

export const postStatusLabel: Record<PostStatus, string> = {
  idea: "فكرة",
  draft: "مسودة",
  review: "للمراجعة",
  ready: "جاهز",
};

export const phaseLabel: Record<1 | 2 | 3 | 4, string> = {
  1: "الأيام 1–7 · التأسيس",
  2: "الأيام 8–14 · الإطلاق",
  3: "الأيام 15–21 · التعلّم",
  4: "الأيام 22–30 · التثبيت",
};

export const questions = [
  { key: "businessId", q: "ما نوع نشاطك؟", labels: businessLabel, multi: false },
  { key: "goalId", q: "ما الهدف الأهم في الأشهر الثلاثة القادمة؟", labels: goalLabel, multi: false },
  { key: "channelIds", q: "ما القنوات التي لديك الآن؟ (اختر كل ما ينطبق)", labels: channelLabel, multi: true },
  { key: "teamId", q: "من يدير التسويق عندك اليوم؟", labels: teamLabel, multi: false },
  { key: "timelineId", q: "متى تريد البدء؟", labels: timelineLabel, multi: false },
] as const;
