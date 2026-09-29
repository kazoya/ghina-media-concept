// التصدير: JSON بإصدار مخطط، CSV آمن لجداول البيانات، موجز نصي ورسالة واتساب قصيرة.
import { services } from "../site.ts";
import { formatDayAr } from "./dates.ts";
import { businessLabel, channelLabel, goalLabel, phaseLabel, postChannelLabel, postStatusLabel, teamLabel, timelineLabel } from "./dict.ts";
import type { DraftV1, PlanV1 } from "./types.ts";

const serviceName = (id: string) => services.find((s) => s.id === id)?.ar ?? id;

/** لا يتضمن الاسم أو أي معرّف للجهاز. */
export function draftToJson(d: DraftV1): string {
  return JSON.stringify({ ...d, exportedFrom: "ghina-media-concept" }, null, 2);
}

/** يمنع تفسير النص كصيغة في Excel/Sheets (=,+,-,@ بعد الفراغات، أو tab/CR في البداية). */
export function csvCell(value: string): string {
  let v = value;
  if (/^[\t\r]/.test(v) || /^\s*[=+\-@]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

export function postsToCsv(d: DraftV1): string {
  const head = ["التاريخ", "القناة", "الفكرة", "الهدف", "الدعوة للفعل", "الحالة"];
  const rows = [...d.posts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((p) => [p.date, postChannelLabel[p.channel], p.idea, p.goal, p.cta, postStatusLabel[p.status]]);
  // BOM حتى يفتح Excel العربية بترميز UTF-8؛ CRLF حسب RFC 4180
  return "﻿" + [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export function answersSummary(d: DraftV1): string[] {
  const a = d.answers;
  return [
    `النشاط: ${businessLabel[a.businessId]}`,
    `الهدف: ${goalLabel[a.goalId]}`,
    `القنوات الحالية: ${a.channelIds.map((c) => channelLabel[c]).join("، ")}`,
    `إدارة التسويق: ${teamLabel[a.teamId]}`,
    `موعد البدء: ${timelineLabel[a.timelineId]}`,
  ];
}

export function briefText(d: DraftV1, plan: PlanV1, name = ""): string {
  const lines = [
    "موجز خطة نمو — من تصوّر تجريبي مستقل لغنى ميديا (ليس الموقع الرسمي)",
    name.trim() ? `الاسم: ${name.trim()}` : "",
    ...answersSummary(d),
    "",
    "التوصيات الأولية (قواعد ثابتة، ليست ذكاءً اصطناعياً):",
    ...plan.recommendations.map((r) => `${r.rank}. ${serviceName(r.serviceId)}${r.tier === "optional" ? " (اختيارية)" : ""}`),
    "",
    `خطة 30 يوماً تبدأ ${formatDayAr(d.startDate)} — ${d.tasks.length} مهمة، ${d.posts.length} منشوراً مقترحاً.`,
    ...([1, 2, 3, 4] as const).map((ph) => `${phaseLabel[ph]}: ${d.tasks.filter((t) => t.phase === ph).map((t) => t.title).join("؛ ") || "—"}`),
  ];
  return lines.filter((l, i) => l !== "" || lines[i - 1] !== "").join("\n").trim();
}

/** رسالة واتساب قصيرة للمراجعة قبل الإرسال — بلا تفاصيل الخطة الكاملة. */
export function whatsappMessage(d: DraftV1, plan: PlanV1, name = ""): string {
  return [
    "مرحباً غنى ميديا 👋",
    name.trim() ? `أنا ${name.trim()}.` : "",
    ...answersSummary(d),
    `الخدمات المقترحة للنقاش: ${plan.recommendations.map((r) => serviceName(r.serviceId)).join("، ")}`,
    "(وصلت من تصوّر تجريبي مستقل) أرغب بمكالمة قصيرة لتحديد الخطة والعرض المناسب.",
  ]
    .filter(Boolean)
    .join("\n");
}
