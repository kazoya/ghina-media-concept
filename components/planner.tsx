"use client";

import { useMemo, useState } from "react";
import { Check, MessageCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { briefMessage, buildPlan, questions, type Answers } from "@/lib/planner";
import { waLink } from "@/lib/site";

type Key = keyof typeof questions;
const order: Key[] = ["business", "goal", "channels", "team", "timeline"];
const empty: Answers = { business: "", goal: "", channels: [], team: "", timeline: "" };

export function Planner() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(empty);
  const [name, setName] = useState("");
  const done = step >= order.length;
  const plan = useMemo(() => (done ? buildPlan(a) : null), [done, a]);

  const key = order[Math.min(step, order.length - 1)];
  const q = questions[key];
  const multi = key === "channels";

  function pick(opt: string) {
    if (multi) {
      setA((p) => {
        const has = p.channels.includes(opt);
        let next = has ? p.channels.filter((c) => c !== opt) : [...p.channels, opt];
        if (opt === "لا شيء بعد" && !has) next = ["لا شيء بعد"];
        else next = next.filter((c) => opt === "لا شيء بعد" || c !== "لا شيء بعد");
        return { ...p, channels: next };
      });
    } else {
      setA((p) => ({ ...p, [key]: opt }));
      setStep((s) => s + 1);
    }
  }

  if (done && plan) {
    const msg = briefMessage(name.trim(), a, plan);
    return (
      <div className="rise grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-line bg-paper p-6 md:p-8">
          <p className="text-sm font-bold text-gold">توصيات أولية</p>
          <p className="mt-1 text-xs text-muted">
            ناتجة عن قواعد ثابتة تربط إجاباتك بخدمات غنى ميديا المنشورة — ليست تحليلاً بالذكاء الاصطناعي ولا تقييماً من الشركة.
          </p>
          <div className="mt-4 flex items-center gap-5">
            <div
              className="grid size-24 shrink-0 place-items-center rounded-full"
              style={{ background: `conic-gradient(var(--c-gold) ${plan.readiness * 3.6}deg, var(--c-line) 0)` }}
              role="img"
              aria-label={`جاهزية رقمية تقديرية ${plan.readiness} من 100`}
            >
              <div className="grid size-19 place-items-center rounded-full bg-paper text-2xl font-bold">{plan.readiness}</div>
            </div>
            <div>
              <p className="font-bold">الجاهزية الرقمية (تقديرية)</p>
              <p className="text-sm text-muted">أولوية البدء: {plan.priority}</p>
              <p className="mt-1 text-xs text-muted">مؤشر توضيحي من إجاباتك فقط — ليس تدقيقاً فعلياً لحساباتك.</p>
            </div>
          </div>

          <h3 className="mt-8 font-bold">الخدمات المقترحة للنقاش</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {plan.services.map((s) => (
              <li key={s.id} className="rounded-2xl border border-line bg-raised p-4">
                <p className="flex items-center gap-2 font-bold">
                  <Check size={16} className="text-ok" aria-hidden /> {s.ar}
                </p>
                <p className="mt-1 text-xs text-muted" dir="ltr">
                  {s.en}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{s.desc}</p>
              </li>
            ))}
          </ul>

          {plan.gaps.length > 0 && (
            <>
              <h3 className="mt-8 font-bold">فجوات تستحق المعالجة</h3>
              <ul className="mt-3 grid gap-2 text-sm text-muted">
                {plan.gaps.map((g) => (
                  <li key={g} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {g}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="grid content-start gap-4">
          <div className="rounded-3xl border border-gold/40 bg-gold-soft p-6">
            <p className="flex items-center gap-2 font-bold text-gold-strong">
              <ShieldCheck size={18} aria-hidden /> قرار بشري قبل أي عرض
            </p>
            <p className="mt-2 text-sm leading-7">
              المنصة تقترح فقط. العرض النهائي والسعر والجدول الزمني تحددها غنى ميديا بعد المكالمة. لا يُرسَل شيء إلا بنقرتك.
            </p>
          </div>
          <label className="grid gap-2 text-sm">
            <span className="font-bold">اسمك (اختياري)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-line bg-raised px-4 py-3 text-ink outline-none focus:border-gold"
              placeholder="مثال: سارة — متجر إلكتروني"
              maxLength={60}
            />
          </label>
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-raised p-4 text-xs leading-6 text-muted">
            {msg}
          </pre>
          <a
            href={waLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-bg transition hover:bg-gold-strong"
          >
            <MessageCircle size={18} aria-hidden /> افتح الرسالة في واتساب لإرسالها
          </a>
          <p className="text-center text-xs text-muted">يفتح واتساب برسالة جاهزة؛ لا يُرسَل شيء حتى تضغط «إرسال» بنفسك هناك.</p>
          <button
            type="button"
            onClick={() => {
              setA(empty);
              setStep(0);
            }}
            className="flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-muted hover:text-ink"
          >
            <RotateCcw size={16} aria-hidden /> ابدأ من جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-paper p-6 md:p-10">
      <div className="flex items-center gap-2" aria-hidden>
        {order.map((k, i) => (
          <span key={k} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-gold" : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        سؤال {step + 1} من {order.length}
      </p>
      <h2 className="mt-1 text-2xl font-bold" id="q">
        {q.q}
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-labelledby="q">
        {q.options.map((opt) => {
          const on = multi ? a.channels.includes(opt) : a[key] === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              aria-pressed={on}
              className={`rounded-2xl border px-5 py-4 text-start transition ${on ? "border-gold bg-gold-soft text-gold-strong" : "border-line bg-raised hover:border-gold/60"}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="rounded-full border border-line px-5 py-2 text-sm text-muted hover:text-ink">
            السابق
          </button>
        )}
        {multi && (
          <button
            type="button"
            disabled={a.channels.length === 0}
            onClick={() => setStep(step + 1)}
            className="rounded-full bg-gold px-6 py-2 text-sm font-bold text-bg disabled:opacity-40"
          >
            التالي
          </button>
        )}
      </div>
    </div>
  );
}
