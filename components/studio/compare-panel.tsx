"use client";

import { services } from "@/lib/site";
import { businessLabel, channelLabel, goalLabel, phaseLabel, postChannelLabel, teamLabel, timelineLabel } from "@/lib/planner/dict";
import { formatDayAr } from "@/lib/planner/dates";
import { compareDrafts } from "@/lib/planner/draft";
import type { SlotInfo } from "./brief-panel";
import type { Slot } from "@/lib/planner/storage";

const fieldName: Record<string, string> = { businessId: "النشاط", goalId: "الهدف", channelIds: "القنوات", teamId: "الفريق", timelineId: "موعد البدء" };
const label = (field: string, v: unknown): string => {
  switch (field) {
    case "businessId":
      return businessLabel[v as keyof typeof businessLabel];
    case "goalId":
      return goalLabel[v as keyof typeof goalLabel];
    case "teamId":
      return teamLabel[v as keyof typeof teamLabel];
    case "timelineId":
      return timelineLabel[v as keyof typeof timelineLabel];
    case "channelIds":
      return [...(v as string[])].sort().map((c) => channelLabel[c as keyof typeof channelLabel]).join("، ");
    default:
      return String(v);
  }
};

export function ComparePanel({ slots, onRefresh }: { slots: Record<Slot, SlotInfo> | null; onRefresh: () => void }) {
  const a = slots?.A.state === "ok" ? slots.A.draft : null;
  const b = slots?.B.state === "ok" ? slots.B.draft : null;
  if (!a || !b)
    return (
      <div className="card grid justify-items-start gap-3 p-6">
        <p className="font-bold">قارن بين مسودتين</p>
        <p className="text-sm leading-7 text-muted">
          احفظ خطة كمسودة A وأخرى كمسودة B من تبويب «الموجز والتصدير»، ثم اعرضهما هنا جنباً إلى جنب. المقارنة تعرض اختلاف المدخلات والأولويات والمهام فقط — لا «عائد
          متوقع».
        </p>
        <p className="text-sm text-muted" data-compare-status>
          الحالة: A {slots ? (a ? "✓" : "—") : "؟"} · B {slots ? (b ? "✓" : "—") : "؟"}
        </p>
        <button type="button" onClick={onRefresh} className="btn btn-ghost text-sm">
          حدّث من هذا الجهاز
        </button>
      </div>
    );

  const d = compareDrafts(a, b, label);
  const name = (id: string) => services.find((s) => s.id === id)?.ar ?? id;
  const th = "px-3 py-2 text-start text-xs font-bold text-muted";
  const td = "border-t border-line px-3 py-2 align-top";
  return (
    <div className="grid gap-6" data-compare>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          A: {a.label || "بلا عنوان"} · B: {b.label || "بلا عنوان"}
        </p>
        <button type="button" onClick={onRefresh} className="btn btn-ghost text-sm">
          حدّث
        </button>
      </div>
      <div className="card overflow-x-auto p-2">
        <table className="w-full min-w-[32rem] text-sm">
          <caption className="p-3 text-start font-bold">المدخلات</caption>
          <thead>
            <tr>
              <th className={th}>الحقل</th>
              <th className={th}>A</th>
              <th className={th}>B</th>
            </tr>
          </thead>
          <tbody>
            {d.inputs.map((r) => (
              <tr key={r.field} className={r.same ? "" : "bg-gold-soft/40"}>
                <td className={td}>
                  {fieldName[r.field]} {!r.same && <span className="text-xs text-gold-strong">(مختلف)</span>}
                </td>
                <td className={td}>{r.a}</td>
                <td className={td}>{r.b}</td>
              </tr>
            ))}
            <tr>
              <td className={td}>بداية الخطة</td>
              <td className={td}>{formatDayAr(d.startDate.a)}</td>
              <td className={td}>{formatDayAr(d.startDate.b)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <caption className="p-3 text-start font-bold">ترتيب التوصيات</caption>
            <thead>
              <tr>
                <th className={th}>الخدمة</th>
                <th className={th}>A</th>
                <th className={th}>B</th>
              </tr>
            </thead>
            <tbody>
              {d.services.map((s) => (
                <tr key={s.serviceId}>
                  <td className={td}>{name(s.serviceId)}</td>
                  <td className={td}>{s.rankA ?? "—"}</td>
                  <td className={td}>{s.rankB ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <caption className="p-3 text-start font-bold">المهام والمنشورات</caption>
            <thead>
              <tr>
                <th className={th}>البند</th>
                <th className={th}>A</th>
                <th className={th}>B</th>
              </tr>
            </thead>
            <tbody>
              {d.tasksPerPhase.map((r) => (
                <tr key={r.phase}>
                  <td className={td}>مهام {phaseLabel[r.phase as 1 | 2 | 3 | 4]}</td>
                  <td className={td}>{r.a}</td>
                  <td className={td}>{r.b}</td>
                </tr>
              ))}
              {d.postsPerChannel.map((r) => (
                <tr key={r.channel}>
                  <td className={td}>منشورات {postChannelLabel[r.channel as keyof typeof postChannelLabel]}</td>
                  <td className={td}>{r.a}</td>
                  <td className={td}>{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
