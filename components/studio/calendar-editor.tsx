"use client";

import { useState } from "react";
import { CalendarDays, List, Plus, Trash2 } from "lucide-react";
import { addDays, diffDays, formatDayAr } from "@/lib/planner/dates";
import { postChannelLabel, postStatusLabel } from "@/lib/planner/dict";
import { LIMITS, POST_CHANNEL_IDS, POST_STATUS_IDS, type Post } from "@/lib/planner/types";
import { inputCls, smallBtn } from "./ui";

const statusTone: Record<Post["status"], string> = {
  idea: "border-line text-muted",
  draft: "border-gold/40 text-gold-strong",
  review: "border-[#8fb3e0]/50 text-[#b7cdf0]",
  ready: "border-ok/50 text-ok",
};

export function CalendarEditor({ posts, startDate, onChange, newId }: { posts: Post[]; startDate: string; onChange: (p: Post[]) => void; newId: () => string }) {
  const [view, setView] = useState<"list" | "grid">("list");
  const end = addDays(startDate, 29);
  const sorted = [...posts].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const update = (id: string, patch: Partial<Post>) => onChange(posts.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remove = (id: string) => onChange(posts.filter((p) => p.id !== id));
  const full = posts.length >= LIMITS.posts;
  const add = () =>
    onChange([...posts, { id: newId(), date: startDate, channel: posts[0]?.channel ?? "instagram", idea: "فكرة جديدة", goal: "", cta: "", status: "idea" }]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-7 text-muted">
          {posts.length} منشوراً من {formatDayAr(startDate)} إلى {formatDayAr(end)}. الأفكار «اقتراح أولي»، ولا تُنشر على أي منصة من هنا.
        </p>
        <div className="flex gap-2">
          <div className="hidden gap-1 rounded-xl border border-line p-1 md:flex" role="group" aria-label="طريقة العرض">
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`${smallBtn} border-0 ${view === "list" ? "bg-gold-soft text-gold-strong" : ""}`}>
              <List size={16} aria-hidden /> قائمة
            </button>
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={`${smallBtn} border-0 ${view === "grid" ? "bg-gold-soft text-gold-strong" : ""}`}>
              <CalendarDays size={16} aria-hidden /> شبكة
            </button>
          </div>
          <button type="button" onClick={add} disabled={full} className="btn btn-primary text-sm">
            <Plus size={16} aria-hidden /> أضف منشوراً
          </button>
        </div>
      </div>

      {view === "grid" && (
        <div className="hidden md:block" aria-label="نظرة شهرية">
          <ol className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const day = addDays(startDate, i);
              const items = sorted.filter((p) => p.date === day);
              return (
                <li key={day} className="min-h-24 rounded-xl border border-line bg-bg/40 p-2 text-xs">
                  <p className="font-bold text-muted">{formatDayAr(day)}</p>
                  {items.map((p) => (
                    <p key={p.id} className={`mt-1 truncate rounded-lg border px-1.5 py-0.5 ${statusTone[p.status]}`} title={p.idea}>
                      {postChannelLabel[p.channel]} · {p.idea}
                    </p>
                  ))}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <ul className={`grid gap-3 ${view === "grid" ? "md:hidden" : ""}`}>
          {sorted.length === 0 && <li className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">لا منشورات. أضف أول منشور.</li>}
          {sorted.map((p) => {
            const outOfRange = p.date < startDate || diffDays(startDate, p.date) > 29;
            return (
              <li key={p.id} data-post={p.id} className="card p-4">
                <div className="grid gap-3 sm:grid-cols-[10rem_9rem_1fr_auto] sm:items-end">
                  <div className="grid gap-1 text-xs text-muted">
                    <label htmlFor={`${p.id}-f1`}>اليوم</label>
                    <input id={`${p.id}-f1`} type="date" className={inputCls} value={p.date} min={startDate} max={end} onChange={(e) => e.target.value && update(p.id, { date: e.target.value })} />
                  </div>
                  <div className="grid gap-1 text-xs text-muted">
                    <label htmlFor={`${p.id}-f2`}>القناة</label>
                    <select id={`${p.id}-f2`} className={inputCls} value={p.channel} onChange={(e) => update(p.id, { channel: e.target.value as Post["channel"] })}>
                      {POST_CHANNEL_IDS.map((c) => (
                        <option key={c} value={c}>
                          {postChannelLabel[c]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1 text-xs text-muted">
                    <label htmlFor={`${p.id}-f3`}>الحالة</label>
                    <select id={`${p.id}-f3`} className={`${inputCls} ${statusTone[p.status]}`} value={p.status} onChange={(e) => update(p.id, { status: e.target.value as Post["status"] })}>
                      {POST_STATUS_IDS.map((s) => (
                        <option key={s} value={s}>
                          {postStatusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="button" onClick={() => remove(p.id)} className={smallBtn + " px-2.5"} aria-label={`احذف منشور ${formatDayAr(p.date)}`}>
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
                <div className="mt-3 grid gap-1 text-xs text-muted">
                  <label htmlFor={`${p.id}-f4`}>الفكرة</label>
                  <textarea id={`${p.id}-f4`} className={inputCls + " min-h-16 leading-7"} value={p.idea} maxLength={LIMITS.note} onChange={(e) => update(p.id, { idea: e.target.value })} />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1 text-xs text-muted">
                    <label htmlFor={`${p.id}-f5`}>الهدف</label>
                    <input id={`${p.id}-f5`} className={inputCls} value={p.goal} maxLength={LIMITS.title} onChange={(e) => update(p.id, { goal: e.target.value })} />
                  </div>
                  <div className="grid gap-1 text-xs text-muted">
                    <label htmlFor={`${p.id}-f6`}>الدعوة للفعل</label>
                    <input id={`${p.id}-f6`} className={inputCls} value={p.cta} maxLength={LIMITS.title} onChange={(e) => update(p.id, { cta: e.target.value })} />
                  </div>
                </div>
                {outOfRange && <p className="mt-2 text-xs text-[#f0b3a5]">⚠ التاريخ خارج نطاق الأيام الثلاثين.</p>}
              </li>
            );
          })}
      </ul>
      {full && <p className="text-sm text-muted">بلغت الحد الأقصى ({LIMITS.posts} منشوراً).</p>}
    </div>
  );
}
