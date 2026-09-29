// حفظ اختياري على هذا الجهاز فقط (localStorage). لا مزامنة، لا شبكة، لا اسم ولا بيانات اتصال.
import { parseDraft } from "./validate.ts";
import type { DraftV1, ParseResult } from "./types.ts";

export const SLOTS = ["A", "B"] as const;
export type Slot = (typeof SLOTS)[number];
const key = (s: Slot) => `ghina-studio:v1:draft:${s}`;

export type SaveResult = { ok: true } | { ok: false; reason: "unavailable" | "quota" | "unknown" };

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function store(): StorageLike | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // الوصول نفسه قد يرمي في وضع التصفح الخاص أو عند حظر ملفات الموقع
  }
}

export function saveDraft(slot: Slot, d: DraftV1, s: StorageLike | null = store()): SaveResult {
  if (!s) return { ok: false, reason: "unavailable" };
  try {
    s.setItem(key(slot), JSON.stringify(d));
    return { ok: true };
  } catch (e) {
    const name = (e as { name?: string })?.name;
    return { ok: false, reason: name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED" ? "quota" : "unknown" };
  }
}

/** null = لا توجد مسودة؛ فشل التحقق يُعاد كما هو ولا يُحذف شيء تلقائياً. */
export function loadDraft(slot: Slot, s: StorageLike | null = store()): ParseResult<DraftV1> | null {
  if (!s) return null;
  let raw: string | null;
  try {
    raw = s.getItem(key(slot));
  } catch {
    return null;
  }
  if (raw === null) return null;
  try {
    return parseDraft(JSON.parse(raw));
  } catch {
    return { success: false, errors: [{ path: "", message: "المسودة المحفوظة تالفة" }] };
  }
}

export function deleteDraft(slot: Slot, s: StorageLike | null = store()): boolean {
  if (!s) return false;
  try {
    s.removeItem(key(slot));
    return true;
  } catch {
    return false;
  }
}

export const saveErrorText: Record<Exclude<SaveResult, { ok: true }>["reason"], string> = {
  unavailable: "لم يُحفظ: التخزين على هذا الجهاز غير متاح (قد يكون التصفح خاصاً أو محظوراً). خطتك ما زالت مفتوحة — صدّرها JSON للاحتفاظ بها.",
  quota: "لم يُحفظ: مساحة التخزين ممتلئة. احذف مسودة أخرى أو صدّر خطتك JSON.",
  unknown: "لم يُحفظ بسبب خطأ غير متوقع في التخزين. خطتك ما زالت مفتوحة.",
};
