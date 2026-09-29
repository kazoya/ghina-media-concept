"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { goalLabel } from "@/lib/planner/dict";
import { addDays, diffDays, todayIso } from "@/lib/planner/dates";
import { applyAnswers, makeId, newDraft, planOf } from "@/lib/planner/draft";
import { deleteDraft, loadDraft, saveDraft, saveErrorText, SLOTS, type Slot } from "@/lib/planner/storage";
import { GOAL_IDS, LIMITS, type AnswersV1, type DraftV1, type Post, type Task } from "@/lib/planner/types";
import { parseAnswers, parseImportText } from "@/lib/planner/validate";
import { BriefPanel, type SlotInfo } from "./brief-panel";
import { CalendarEditor } from "./calendar-editor";
import { ComparePanel } from "./compare-panel";
import { PlanEditor } from "./plan-editor";
import { PrintBrief } from "./print-brief";
import { Recommendations } from "./recommendations";
import { Dialog, Panel, StatusLine, Tabs, type Notice } from "./ui";
import { Wizard, type Partial5 } from "./wizard";

type Tab = "recs" | "plan" | "calendar" | "brief" | "compare";
const TABS: { id: Tab; label: string }[] = [
  { id: "recs", label: "التوصيات" },
  { id: "plan", label: "خطة 30 يوماً" },
  { id: "calendar", label: "تقويم المحتوى" },
  { id: "brief", label: "الموجز والتصدير" },
  { id: "compare", label: "مقارنة" },
];

const toAnswers = (p: Partial5) => parseAnswers({ schemaVersion: 1, ...p });

export function Studio() {
  const params = useSearchParams();
  const presetGoal = params.get("goal");
  const goalFromUrl = GOAL_IDS.find((g) => g === presetGoal);

  const [partial, setPartial] = useState<Partial5>(() => ({ channelIds: [], goalId: goalFromUrl }));
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftV1 | null>(null);
  const [editing, setEditing] = useState(true);
  const [tab, setTab] = useState<Tab>("recs");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [slots, setSlots] = useState<Record<Slot, SlotInfo> | null>(null);
  const [pending, setPending] = useState<AnswersV1 | null>(null);
  const [confirm, setConfirm] = useState<null | { kind: "reset" } | { kind: "import"; draft: DraftV1 } | { kind: "load"; slot: Slot }>(null);
  const [wipeSaved, setWipeSaved] = useState(false);

  const plan = useMemo(() => (draft ? planOf(draft) : null), [draft]);
  const edited = !!draft && (draft.userEdited.tasks || draft.userEdited.posts);

  const refreshSlots = useCallback(() => {
    const next = {} as Record<Slot, SlotInfo>;
    for (const s of SLOTS) {
      const r = loadDraft(s);
      next[s] = r === null ? { state: "empty" } : r.success ? { state: "ok", draft: r.data } : { state: "invalid", message: r.errors[0]?.message ?? "" };
    }
    setSlots(next);
  }, []);

  const finishWizard = (p: Partial5) => {
    const r = toAnswers(p);
    if (!r.success) {
      setNotice({ kind: "error", text: r.errors.map((e) => e.message).join("، ") });
      return;
    }
    if (!draft) {
      setDraft(newDraft(r.data, todayIso()));
      setEditing(false);
      setTab("recs");
      setNotice({ kind: "info", text: "جاهزة: توصياتك الأولية وخطة 30 يوماً وتقويم محتوى قابل للتعديل." });
    } else if (edited && JSON.stringify(r.data) !== JSON.stringify(draft.answers)) {
      setPending(r.data); // لا نستبدل تعديلات المستخدم دون سؤال
    } else {
      setDraft(applyAnswers(draft, r.data, { regenerateEdited: false }));
      setEditing(false);
      setNotice({ kind: "info", text: "حُدّثت التوصيات والخطة وفق إجاباتك الجديدة." });
    }
  };

  const resolvePending = (regenerate: boolean) => {
    if (!draft || !pending) return;
    setDraft(applyAnswers(draft, pending, { regenerateEdited: regenerate }));
    setPending(null);
    setEditing(false);
    setNotice({ kind: "info", text: regenerate ? "أُعيد توليد المهام والتقويم وفق الإجابات الجديدة." : "حُدّثت التوصيات واحتُفظ بتعديلاتك على المهام والتقويم." });
  };

  const setTasks = (tasks: Task[]) => draft && setDraft({ ...draft, tasks, updatedAt: new Date().toISOString(), userEdited: { ...draft.userEdited, tasks: true } });
  const setPosts = (posts: Post[]) => draft && setDraft({ ...draft, posts, updatedAt: new Date().toISOString(), userEdited: { ...draft.userEdited, posts: true } });

  const save = (s: Slot) => {
    if (!draft) return;
    const r = saveDraft(s, { ...draft, updatedAt: new Date().toISOString() });
    setNotice(r.ok ? { kind: "ok", text: `حُفظت كمسودة ${s} على هذا الجهاز فقط.` } : { kind: "error", text: saveErrorText[r.reason] });
    if (r.ok) refreshSlots();
  };

  const openDraft = (d: DraftV1, how: string) => {
    setDraft(d);
    setPartial({ ...d.answers, channelIds: [...d.answers.channelIds] });
    setEditing(false);
    setTab("recs");
    setNotice({ kind: "ok", text: how });
  };

  const load = (s: Slot) => {
    const r = loadDraft(s);
    if (!r || !r.success) {
      setNotice({ kind: "error", text: `تعذّر فتح مسودة ${s}${r && !r.success ? `: ${r.errors[0]?.message}` : ""}.` });
      return;
    }
    if (draft && edited) setConfirm({ kind: "load", slot: s });
    else openDraft(r.data, `فُتحت مسودة ${s}.`);
  };

  const importFile = async (f: File) => {
    let text: string;
    try {
      if (f.size > LIMITS.importBytes) throw new RangeError();
      text = await f.text();
    } catch (e) {
      setNotice({ kind: "error", text: e instanceof RangeError ? `الملف أكبر من ${LIMITS.importBytes / 1024} KiB. لم يتغير شيء.` : "تعذّرت قراءة الملف. لم يتغير شيء." });
      return;
    }
    const r = parseImportText(text, f.size);
    if (!r.success) {
      const first = r.errors.slice(0, 3).map((e) => (e.path ? `${e.path}: ${e.message}` : e.message));
      setNotice({ kind: "error", text: `لم يُستورد الملف — خطتك الحالية لم تتغير. ${first.join("؛ ")}${r.errors.length > 3 ? ` (+${r.errors.length - 3})` : ""}` });
      return;
    }
    if (draft) setConfirm({ kind: "import", draft: r.data });
    else openDraft(r.data, "استُوردت الخطة من الملف.");
  };

  const doReset = () => {
    let wiped = true;
    if (wipeSaved) for (const s of SLOTS) wiped = deleteDraft(s) && wiped;
    setDraft(null);
    setPartial({ channelIds: [] });
    setName("");
    setStep(0);
    setEditing(true);
    setTab("recs");
    setSlots(null);
    setConfirm(null);
    setNotice(
      wipeSaved
        ? wiped
          ? { kind: "ok", text: "صُفّرت الجلسة وحُذفت المسودات المحفوظة على هذا الجهاز." }
          : { kind: "error", text: "صُفّرت الجلسة، لكن تعذّر حذف المسودات المحفوظة من التخزين." }
        : { kind: "ok", text: "صُفّرت الجلسة. المسودات المحفوظة بقيت كما هي." },
    );
    setWipeSaved(false);
  };

  const closeConfirm = useCallback(() => setConfirm(null), []);
  const closePending = useCallback(() => setPending(null), []);

  return (
    <div className="grid gap-6">
      <StatusLine notice={notice} />

      {editing || !draft || !plan ? (
        <div className="print:hidden">
          <Wizard
            value={partial}
            step={step}
            onChange={setPartial}
            onStep={setStep}
            onDone={finishWizard}
            note={goalFromUrl && !draft ? `الهدف محدد مسبقاً: «${goalLabel[goalFromUrl]}» — يمكنك تغييره في السؤال الثاني.` : undefined}
          />
          {draft && (
            <button type="button" onClick={() => setEditing(false)} className="btn mt-4 border border-line text-sm font-normal text-muted hover:text-ink">
              ارجع إلى خطتي دون تغيير
            </button>
          )}
        </div>
      ) : (
        <>
          <Tabs tabs={TABS} value={tab} onChange={(t) => {
            setTab(t);
            if (t === "compare" && !slots) refreshSlots();
          }} idBase="studio" />
          <Panel idBase="studio" id="recs" active={tab === "recs"}>
            <Recommendations
              plan={plan}
              onEdit={() => {
                setPartial({ ...draft.answers, channelIds: [...draft.answers.channelIds] });
                setStep(0);
                setEditing(true);
              }}
            />
          </Panel>
          <Panel idBase="studio" id="plan" active={tab === "plan"}>
            <label className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-bold">تاريخ البداية</span>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  // المنشورات تُزاح بنفس الفرق حتى لا تسبق تاريخ البداية
                  const shift = diffDays(draft.startDate, v);
                  const moved = draft.posts.map((p) => ({ ...p, date: addDays(p.date, shift) }));
                  setDraft({ ...draft, startDate: v, posts: moved, updatedAt: new Date().toISOString() });
                }}
                className="min-h-11 rounded-xl border border-line bg-bg/60 px-3 text-ink outline-none focus:border-gold"
              />
            </label>
            <PlanEditor tasks={draft.tasks} onChange={setTasks} newId={makeId} />
          </Panel>
          <Panel idBase="studio" id="calendar" active={tab === "calendar"}>
            <CalendarEditor posts={draft.posts} startDate={draft.startDate} onChange={setPosts} newId={makeId} />
          </Panel>
          <Panel idBase="studio" id="brief" active={tab === "brief"}>
            <BriefPanel
              draft={draft}
              plan={plan}
              name={name}
              onName={setName}
              onLabel={(label) => setDraft({ ...draft, label })}
              slots={slots}
              onRefreshSlots={refreshSlots}
              onSave={save}
              onLoad={load}
              onDelete={(s) => {
                const ok = deleteDraft(s);
                setNotice(ok ? { kind: "ok", text: `حُذفت مسودة ${s} من هذا الجهاز.` } : { kind: "error", text: `تعذّر حذف مسودة ${s}.` });
                refreshSlots();
              }}
              onImport={importFile}
              onReset={() => setConfirm({ kind: "reset" })}
              notify={setNotice}
            />
          </Panel>
          <Panel idBase="studio" id="compare" active={tab === "compare"}>
            <ComparePanel slots={slots} onRefresh={refreshSlots} />
          </Panel>
          <PrintBrief draft={draft} plan={plan} name={name} />
        </>
      )}

      <Dialog open={!!pending} onClose={closePending} title="لديك تعديلات على الخطة">
        <p>غيّرت إجاباتك بعد تعديل المهام أو التقويم. التوصيات ستتحدث في الحالتين. ماذا نفعل بتعديلاتك؟</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" autoFocus onClick={() => resolvePending(false)} className="btn btn-primary text-sm">
            احتفظ بتعديلاتي
          </button>
          <button type="button" onClick={() => resolvePending(true)} className="btn btn-ghost text-sm">
            أعد توليد المهام والتقويم
          </button>
        </div>
      </Dialog>

      <Dialog open={confirm?.kind === "reset"} onClose={closeConfirm} title="ابدأ من جديد؟">
        <p>سيُمسح الاسم والإجابات والخطة المفتوحة الآن. لا يمكن التراجع إلا من ملف JSON مُصدَّر.</p>
        <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink">
          <input type="checkbox" checked={wipeSaved} onChange={(e) => setWipeSaved(e.target.checked)} className="size-5 accent-[var(--c-gold)]" />
          احذف أيضاً المسودات A وB المحفوظة على هذا الجهاز
        </label>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={doReset} className="btn btn-primary text-sm">
            نعم، صفّر
          </button>
          <button type="button" autoFocus onClick={() => setConfirm(null)} className="btn btn-ghost text-sm">
            إلغاء
          </button>
        </div>
      </Dialog>

      <Dialog open={confirm?.kind === "import" || confirm?.kind === "load"} onClose={closeConfirm} title="استبدال الخطة المفتوحة؟">
        <p>الملف صالح. فتحه سيستبدل الخطة المفتوحة الآن وتعديلاتها غير المحفوظة. احفظها أو صدّرها أولاً إن أردت الاحتفاظ بها.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              if (confirm?.kind === "import") openDraft(confirm.draft, "استُوردت الخطة من الملف.");
              else if (confirm?.kind === "load") {
                const r = loadDraft(confirm.slot);
                if (r && r.success) openDraft(r.data, `فُتحت مسودة ${confirm.slot}.`);
              }
              setConfirm(null);
            }}
            className="btn btn-primary text-sm"
          >
            استبدل
          </button>
          <button type="button" autoFocus onClick={() => setConfirm(null)} className="btn btn-ghost text-sm">
            إلغاء
          </button>
        </div>
      </Dialog>
    </div>
  );
}
