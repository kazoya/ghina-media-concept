"use client";

import { Plus, Trash2 } from "lucide-react";
import { phaseLabel } from "@/lib/planner/dict";
import { metricSuggestions } from "@/lib/planner/plan30";
import { LIMITS, type Task } from "@/lib/planner/types";
import { inputCls, smallBtn } from "./ui";

export function PlanEditor({ tasks, onChange, newId }: { tasks: Task[]; onChange: (t: Task[]) => void; newId: () => string }) {
  const update = (id: string, patch: Partial<Task>) => onChange(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const remove = (id: string) => onChange(tasks.filter((t) => t.id !== id));
  const add = (phase: Task["phase"]) =>
    onChange([...tasks, { id: newId(), phase, title: "مهمة جديدة", owner: "", approval: "اعتمادك قبل التنفيذ", deliverable: "", metric: "", done: false }]);
  const full = tasks.length >= LIMITS.tasks;

  return (
    <div className="grid gap-6">
      <p className="text-sm leading-7 text-muted">
        قالب أولي من أربع مراحل. كل حقل قابل للتعديل: حدّد المسؤول والمقياس بنفسك. لا يمثل هذا التزاماً أو موعداً من غنى ميديا.
      </p>
      <datalist id="metric-suggestions">
        {metricSuggestions.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>
      {([1, 2, 3, 4] as const).map((ph) => {
        const list = tasks.filter((t) => t.phase === ph);
        return (
          <section key={ph} aria-labelledby={`ph-${ph}`} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id={`ph-${ph}`} className="font-bold text-gold-strong">
                {phaseLabel[ph]}
              </h3>
              <button type="button" onClick={() => add(ph)} disabled={full} className={smallBtn + " disabled:opacity-40"}>
                <Plus size={16} aria-hidden /> أضف مهمة
              </button>
            </div>
            {list.length === 0 && <p className="mt-3 text-sm text-muted">لا مهام في هذه المرحلة.</p>}
            <ul className="mt-3 grid gap-3">
              {list.map((t) => (
                <li key={t.id} data-task={t.id} className="rounded-2xl border border-line bg-bg/40 p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) => update(t.id, { done: e.target.checked })}
                      aria-label={`تم: ${t.title}`}
                      className="mt-3 size-5 shrink-0 cursor-pointer accent-[var(--c-gold)]"
                    />
                    <div className="grid flex-1 gap-1 text-xs text-muted">
                      <label htmlFor={`${t.id}-f1`}>المهمة</label>
                      <input id={`${t.id}-f1`} className={inputCls + " text-base font-bold"} value={t.title} maxLength={LIMITS.title} onChange={(e) => update(t.id, { title: e.target.value })} />
                    </div>
                    <button type="button" onClick={() => remove(t.id)} className={smallBtn + " mt-5 px-2.5"} aria-label={`احذف المهمة: ${t.title}`}>
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-1 text-xs text-muted">
                      <label htmlFor={`${t.id}-f2`}>المسؤول</label>
                      <input id={`${t.id}-f2`} className={inputCls} value={t.owner} placeholder="حدّد المسؤول" maxLength={LIMITS.label} onChange={(e) => update(t.id, { owner: e.target.value })} />
                    </div>
                    <div className="grid gap-1 text-xs text-muted">
                      <label htmlFor={`${t.id}-f3`}>المخرج</label>
                      <input id={`${t.id}-f3`} className={inputCls} value={t.deliverable} maxLength={LIMITS.title} onChange={(e) => update(t.id, { deliverable: e.target.value })} />
                    </div>
                    <div className="grid gap-1 text-xs text-muted">
                      <label htmlFor={`${t.id}-f4`}>مقياس النجاح</label>
                      <input id={`${t.id}-f4`} className={inputCls} list="metric-suggestions" value={t.metric} placeholder="اختر أو اكتب" maxLength={LIMITS.title} onChange={(e) => update(t.id, { metric: e.target.value })} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted">الاعتماد: {t.approval}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {full && <p className="text-sm text-muted">بلغت الحد الأقصى ({LIMITS.tasks} مهمة).</p>}
    </div>
  );
}
