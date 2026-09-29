import { services } from "@/lib/site";
import { formatDayAr } from "@/lib/planner/dates";
import { phaseLabel, postChannelLabel, postStatusLabel } from "@/lib/planner/dict";
import { answersSummary } from "@/lib/planner/export";
import type { DraftV1, PlanV1 } from "@/lib/planner/types";

// نسخة الطباعة فقط (مخفية على الشاشة). بلا أزرار أو مؤثرات؛ يحفظها الزائر PDF من نافذة الطباعة.
export function PrintBrief({ draft, plan, name }: { draft: DraftV1; plan: PlanV1; name: string }) {
  const svc = (id: string) => services.find((s) => s.id === id)?.ar ?? id;
  return (
    <article className="print-brief hidden print:block">
      <p className="pb-note">تصوّر تجريبي مستقل — غير تابع للموقع الرسمي لغنى ميديا · ghinamedia.com</p>
      <h1>موجز خطة نمو — 30 يوماً</h1>
      {name.trim() && <p>الاسم: {name.trim()}</p>}
      <ul>
        {answersSummary(draft).map((l) => (
          <li key={l}>{l}</li>
        ))}
        <li>بداية الخطة: {formatDayAr(draft.startDate)}</li>
      </ul>
      <h2>التوصيات الأولية (قواعد ثابتة، ليست ذكاءً اصطناعياً)</h2>
      <ol>
        {plan.recommendations.map((r) => (
          <li key={r.serviceId}>
            <b>
              {svc(r.serviceId)}
              {r.tier === "optional" ? " (اختيارية)" : ""}
            </b>
            : {r.reasons.join(" ")}
          </li>
        ))}
      </ol>
      <h2>خطة 30 يوماً</h2>
      {([1, 2, 3, 4] as const).map((ph) => (
        <section key={ph}>
          <h3>{phaseLabel[ph]}</h3>
          <ul>
            {draft.tasks
              .filter((t) => t.phase === ph)
              .map((t) => (
                <li key={t.id}>
                  {t.done ? "☑ " : "☐ "}
                  {t.title}
                  {t.owner && ` — المسؤول: ${t.owner}`}
                  {t.metric && ` — المقياس: ${t.metric}`}
                </li>
              ))}
          </ul>
        </section>
      ))}
      <h2>تقويم المحتوى</h2>
      <table>
        <thead>
          <tr>
            <th>اليوم</th>
            <th>القناة</th>
            <th>الفكرة</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {[...draft.posts]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((p) => (
              <tr key={p.id}>
                <td>{formatDayAr(p.date)}</td>
                <td>{postChannelLabel[p.channel]}</td>
                <td>{p.idea}</td>
                <td>{postStatusLabel[p.status]}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p className="pb-note">لا أسعار ولا وعود بنتائج. العرض والسعر يحددهما غنى ميديا بعد التواصل.</p>
    </article>
  );
}
