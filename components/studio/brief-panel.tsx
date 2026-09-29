"use client";

import { useRef, useState } from "react";
import { Copy, FileJson, FileSpreadsheet, FolderOpen, MessageCircle, Printer, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { waLink } from "@/lib/site";
import { briefText, draftToJson, postsToCsv, whatsappMessage } from "@/lib/planner/export";
import { LIMITS, type DraftV1, type PlanV1 } from "@/lib/planner/types";
import type { Slot } from "@/lib/planner/storage";
import { download, inputCls, smallBtn, type Notice } from "./ui";

export type SlotInfo = { state: "empty" } | { state: "ok"; draft: DraftV1 } | { state: "invalid"; message: string };

const when = (iso: string) =>
  new Intl.DateTimeFormat("ar-JO-u-nu-latn", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Amman" }).format(new Date(iso));

export function BriefPanel({
  draft,
  plan,
  name,
  onName,
  onLabel,
  slots,
  onRefreshSlots,
  onSave,
  onLoad,
  onDelete,
  onImport,
  onReset,
  notify,
}: {
  draft: DraftV1;
  plan: PlanV1;
  name: string;
  onName: (n: string) => void;
  onLabel: (l: string) => void;
  slots: Record<Slot, SlotInfo> | null;
  onRefreshSlots: () => void;
  onSave: (s: Slot) => void;
  onLoad: (s: Slot) => void;
  onDelete: (s: Slot) => void;
  onImport: (file: File) => void;
  onReset: () => void;
  notify: (n: Notice) => void;
}) {
  const brief = briefText(draft, plan, name);
  const [manual, setManual] = useState(false);
  const manualRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const base = `ghina-plan-${draft.startDate}`;

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(brief);
      setManual(false);
      notify({ kind: "ok", text: "نُسخ الموجز إلى الحافظة." });
    } catch {
      // لا إشعار نجاح كاذب: نعرض النص محدداً للنسخ اليدوي
      setManual(true);
      notify({ kind: "error", text: "تعذّر النسخ التلقائي. النص محدد أدناه — انسخه يدوياً (Ctrl+C أو اضغط مطولاً)." });
      requestAnimationFrame(() => manualRef.current?.select());
    }
  };
  const save = (file: string, text: string, mime: string, label: string) =>
    notify(download(file, text, mime) ? { kind: "ok", text: `بدأ تنزيل ${label}.` } : { kind: "error", text: `تعذّر تنزيل ${label} في هذا المتصفح.` });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="grid content-start gap-4">
        <label className="grid gap-1 text-sm">
          <span className="font-bold">اسمك (اختياري — يظهر في الموجز والرسالة فقط ولا يُحفظ)</span>
          <input className={inputCls} value={name} onChange={(e) => onName(e.target.value)} maxLength={LIMITS.label} placeholder="مثال: سارة — متجر إلكتروني" autoComplete="off" />
        </label>
        <pre data-brief className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-bg/40 p-4 text-sm leading-7 text-muted">
          {brief}
        </pre>
        {manual && (
          <label className="grid gap-1 text-sm">
            <span className="font-bold">انسخ يدوياً</span>
            <textarea ref={manualRef} readOnly value={brief} className={inputCls + " min-h-32 text-xs"} />
          </label>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={copy} className="btn btn-ghost">
            <Copy size={16} aria-hidden /> انسخ الموجز
          </button>
          <a href={waLink(whatsappMessage(draft, plan, name))} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-wa>
            <MessageCircle size={16} aria-hidden /> افتح رسالة قصيرة في واتساب
          </a>
          <button type="button" onClick={() => window.print()} className="btn btn-ghost">
            <Printer size={16} aria-hidden /> اطبع أو احفظ PDF
          </button>
          <button type="button" onClick={() => save(`${base}.json`, draftToJson(draft), "application/json", "ملف JSON")} className="btn btn-ghost">
            <FileJson size={16} aria-hidden /> صدّر الخطة JSON
          </button>
          <button type="button" onClick={() => save(`${base}-calendar.csv`, postsToCsv(draft), "text/csv;charset=utf-8", "تقويم CSV")} className="btn btn-ghost sm:col-span-2">
            <FileSpreadsheet size={16} aria-hidden /> صدّر التقويم CSV (Excel / Sheets)
          </button>
        </div>
        <p className="text-xs leading-6 text-muted">
          واتساب يفتح برسالة جاهزة ولا يُرسَل شيء حتى تضغط «إرسال» بنفسك. «احفظ PDF» يستخدم نافذة الطباعة في متصفحك. ملف JSON لا يتضمن اسمك.
        </p>
      </div>

      <aside className="grid content-start gap-4">
        <div className="card p-5">
          <p className="font-bold">المسودات على هذا الجهاز</p>
          <p className="mt-1 text-xs leading-6 text-muted">
            حفظ اختياري في متصفحك فقط — لا مزامنة ولا خادم. لا تحفظ على جهاز مشترك. الاسم لا يُحفظ.
          </p>
          <label className="mt-3 grid gap-1 text-xs text-muted">
            عنوان المسودة (اختياري)
            <input className={inputCls} value={draft.label} maxLength={LIMITS.label} onChange={(e) => onLabel(e.target.value)} placeholder="مثال: خطة الطلبات" />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["A", "B"] as const).map((s) => (
              <button key={s} type="button" onClick={() => onSave(s)} className="btn btn-ghost text-sm" data-save={s}>
                <Save size={16} aria-hidden /> احفظ كمسودة {s}
              </button>
            ))}
          </div>
          <button type="button" onClick={onRefreshSlots} className={smallBtn + " mt-3 w-full"}>
            <FolderOpen size={16} aria-hidden /> اعرض المسودات المحفوظة
          </button>
          {slots && (
            <ul className="mt-3 grid gap-2 text-sm" data-slots>
              {(["A", "B"] as const).map((s) => {
                const info = slots[s];
                return (
                  <li key={s} className="rounded-xl border border-line p-3" data-slot={s}>
                    <p className="font-bold">مسودة {s}</p>
                    {info.state === "empty" && <p className="text-xs text-muted">فارغة</p>}
                    {info.state === "invalid" && <p className="text-xs text-[#f0b3a5]">⚠ تالفة أو من إصدار غير مدعوم: {info.message}</p>}
                    {info.state === "ok" && (
                      <p className="text-xs leading-6 text-muted">
                        {info.draft.label || "بلا عنوان"} · حُفظت {when(info.draft.updatedAt)} · إصدار المخطط {info.draft.schemaVersion}
                      </p>
                    )}
                    {info.state !== "empty" && (
                      <div className="mt-2 flex gap-2">
                        {info.state === "ok" && (
                          <button type="button" onClick={() => onLoad(s)} className={smallBtn}>
                            افتح
                          </button>
                        )}
                        <button type="button" onClick={() => onDelete(s)} className={smallBtn} aria-label={`احذف مسودة ${s}`}>
                          <Trash2 size={16} aria-hidden /> احذف
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="card p-5">
          <p className="font-bold">استيراد خطة JSON</p>
          <p className="mt-1 text-xs leading-6 text-muted">حتى {LIMITS.importBytes / 1024} KiB. تُفحص قبل الفتح؛ الملف غير الصالح لا يمس خطتك الحالية.</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            data-import
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-ghost mt-3 w-full text-sm">
            <Upload size={16} aria-hidden /> اختر ملف JSON
          </button>
        </div>
        <button type="button" onClick={onReset} className="btn border border-line text-sm font-normal text-muted hover:border-[#d98b7a]/60 hover:text-[#f0b3a5]">
          <RotateCcw size={16} aria-hidden /> ابدأ من جديد (تصفير)
        </button>
      </aside>
    </div>
  );
}
