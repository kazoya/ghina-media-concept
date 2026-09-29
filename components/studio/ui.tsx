"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";

/*
 * حوار على <dialog> الأصلي: showModal يحبس التركيز ويغلق بـ Escape.
 * درس HTPAAP من Radix (packages/react/focus-scope/src/focus-scope.tsx:168-194 و dialog.tsx:322 @f7ecd5a):
 * احفظ العنصر المركَّز قبل الفتح وأعد التركيز إليه عند الإغلاق، واربط العنوان بـ aria-labelledby.
 */
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      previous.current = document.activeElement as HTMLElement | null;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCloseEvt = () => {
      onClose();
      const el = previous.current;
      previous.current = null;
      if (el && el.isConnected) el.focus();
    };
    d.addEventListener("close", onCloseEvt);
    return () => d.removeEventListener("close", onCloseEvt);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="m-auto w-[min(92vw,34rem)] rounded-3xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-xl font-bold">
          {title}
        </h2>
        <div className="mt-3 leading-8 text-muted">{children}</div>
      </div>
    </dialog>
  );
}

export type TabDef<T extends string> = { id: T; label: string };

/** تبويبات WAI-ARIA: الأسهم تتبع اتجاه RTL (يسار = التالي)، Home/End للطرفين. */
export function Tabs<T extends string>({ tabs, value, onChange, idBase }: { tabs: TabDef<T>[]; value: T; onChange: (t: T) => void; idBase: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const map: Record<string, number> = { ArrowLeft: i === last ? 0 : i + 1, ArrowRight: i === 0 ? last : i - 1, Home: 0, End: last };
    if (!(e.key in map)) return;
    e.preventDefault();
    const j = map[e.key];
    onChange(tabs[j].id);
    refs.current[j]?.focus();
  };
  return (
    <div role="tablist" aria-label="أقسام الخطة" className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-paper p-1 print:hidden">
      {tabs.map((t, i) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${idBase}-tab-${t.id}`}
            aria-selected={on}
            aria-controls={`${idBase}-panel-${t.id}`}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-11 shrink-0 cursor-pointer rounded-xl px-4 text-sm font-bold transition-colors duration-150 ${on ? "bg-gold text-bg" : "text-muted hover:bg-raised hover:text-ink"}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function Panel({ idBase, id, active, children }: { idBase: string; id: string; active: boolean; children: ReactNode }) {
  return (
    <section role="tabpanel" id={`${idBase}-panel-${id}`} aria-labelledby={`${idBase}-tab-${id}`} hidden={!active} tabIndex={0} className="mt-6 outline-none print:hidden">
      {children}
    </section>
  );
}

export type Notice = { kind: "ok" | "error" | "info"; text: string } | null;

export function StatusLine({ notice }: { notice: Notice }) {
  const cls = notice?.kind === "error" ? "border-[#d98b7a]/60 text-[#f0b3a5]" : notice?.kind === "ok" ? "border-ok/50 text-ok" : "border-line text-muted";
  return (
    <p role="status" aria-live="polite" className={`min-h-6 text-sm print:hidden ${notice ? `rounded-xl border px-4 py-2 ${cls}` : ""}`}>
      {notice ? (notice.kind === "error" ? "⚠ " : notice.kind === "ok" ? "✓ " : "") + notice.text : ""}
    </p>
  );
}

export function download(filename: string, text: string, mime: string): boolean {
  try {
    const url = URL.createObjectURL(new Blob([text], { type: mime }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
  } catch {
    return false;
  }
}

export const inputCls =
  "w-full min-h-11 rounded-xl border border-line bg-bg/60 px-3 py-2 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-gold";
export const smallBtn =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink active:scale-[0.98]";
