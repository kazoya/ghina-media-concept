"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { groups, serviceGuide, services, waLink } from "@/lib/site";

type Filter = "all" | keyof typeof groups;

export function ServiceExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = services.filter((s) => filter === "all" || s.group === filter);
  const chips: { id: Filter; label: string }[] = [{ id: "all", label: `الكل (${services.length})` }, ...(Object.keys(groups) as (keyof typeof groups)[]).map((g) => ({ id: g, label: `${groups[g]} (${services.filter((s) => s.group === g).length})` }))];

  return (
    <div>
      <div role="group" aria-label="رشّح حسب المسار" className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-bold transition-colors duration-150 ${filter === c.id ? "border-gold bg-gold text-bg" : "border-line text-muted hover:border-line-strong hover:text-ink"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted" aria-live="polite">
        يُعرض {list.length} من {services.length} خدمة.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const g = serviceGuide[s.id];
          return (
            <article key={s.id} data-service={s.id} data-spotlight className="card card-hover flex flex-col p-6">
              <p className="text-xs font-bold text-gold">{groups[s.group]}</p>
              <h3 className="mt-1 text-lg font-bold">{s.ar}</h3>
              <p className="text-xs text-muted" dir="ltr">
                {s.en}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{s.desc}</p>
              <details className="group mt-3 rounded-xl border border-line bg-bg/40 px-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-bold">
                  متى تحتاجها؟
                  <span className="text-gold transition-transform duration-200 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <dl className="grid gap-2 pb-4 text-sm leading-7">
                  <dt className="font-bold text-muted">تحتاجها عندما</dt>
                  <dd>{g.when}</dd>
                  <dt className="font-bold text-muted">ماذا يلزمك</dt>
                  <dd>{g.needs}</dd>
                  <dt className="font-bold text-muted">خطوة تالية</dt>
                  <dd>{g.next}</dd>
                </dl>
              </details>
              <div className="mt-auto grid gap-2 pt-4">
                <Link href={`/planner?goal=${g.goal}`} className="btn btn-ghost text-sm">
                  ابدأ خطة بهذا الاتجاه <ArrowLeft size={16} aria-hidden />
                </Link>
                <a href={waLink(`مرحباً غنى ميديا، أستفسر عن خدمة: ${s.ar}`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-bold text-gold-strong hover:underline">
                  <MessageCircle size={16} aria-hidden /> اسأل عنها على واتساب
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-xs leading-6 text-muted">«متى تحتاجها» شرح عام كتبته هذه المنصة لمساعدتك على الاختيار، وليس وصفاً رسمياً لنطاق عمل غنى ميديا أو أسعارها.</p>
    </div>
  );
}
