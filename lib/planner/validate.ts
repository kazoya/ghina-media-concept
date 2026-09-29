// حدّ التحقق لكل بيانات تدخل من خارج الواجهة (استيراد JSON، التخزين المحلي، رابط ?goal=).
// درس HTPAAP من zod (packages/zod/src/v4/classic/parse.ts @2bf7b06): نتيجة نجاح أو فشل منفصلة، بلا fallback صامت.
import { isIsoDate } from "./dates.ts";
import {
  BUSINESS_IDS,
  CHANNEL_IDS,
  GOAL_IDS,
  LIMITS,
  POST_CHANNEL_IDS,
  POST_STATUS_IDS,
  TEAM_IDS,
  TIMELINE_IDS,
  type AnswersV1,
  type ChannelId,
  type DraftV1,
  type FieldError,
  type ParseResult,
  type Post,
  type Task,
} from "./types.ts";

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === "string" && (list as readonly string[]).includes(v);

/** «لا شيء بعد» حصرية: نفس القاعدة في الواجهة والاستيراد. */
export function toggleChannel(current: ChannelId[], id: ChannelId): ChannelId[] {
  if (current.includes(id)) return current.filter((c) => c !== id);
  if (id === "none") return ["none"];
  return [...current.filter((c) => c !== "none"), id];
}

function str(v: unknown, path: string, max: number, errors: FieldError[], required = false): string {
  if (v === undefined || v === null) {
    if (required) errors.push({ path, message: "حقل مطلوب" });
    return "";
  }
  if (typeof v !== "string") {
    errors.push({ path, message: "يجب أن يكون نصاً" });
    return "";
  }
  if (v.length > max) errors.push({ path, message: `أطول من ${max} حرفاً` });
  if (required && !v.trim()) errors.push({ path, message: "لا يمكن أن يكون فارغاً" });
  return v;
}

export function parseAnswers(v: unknown, path = "answers"): ParseResult<AnswersV1> {
  const errors: FieldError[] = [];
  if (!isObj(v)) return { success: false, errors: [{ path, message: "يجب أن يكون كائناً" }] };
  if (v.schemaVersion !== 1) errors.push({ path: `${path}.schemaVersion`, message: `إصدار غير مدعوم: ${String(v.schemaVersion)}` });
  if (!oneOf(BUSINESS_IDS, v.businessId)) errors.push({ path: `${path}.businessId`, message: "نوع نشاط غير معروف" });
  if (!oneOf(GOAL_IDS, v.goalId)) errors.push({ path: `${path}.goalId`, message: "هدف غير معروف" });
  if (!oneOf(TEAM_IDS, v.teamId)) errors.push({ path: `${path}.teamId`, message: "قيمة فريق غير معروفة" });
  if (!oneOf(TIMELINE_IDS, v.timelineId)) errors.push({ path: `${path}.timelineId`, message: "موعد بدء غير معروف" });
  const ch = v.channelIds;
  if (!Array.isArray(ch) || ch.length === 0) errors.push({ path: `${path}.channelIds`, message: "اختر قناة واحدة على الأقل أو «لا شيء بعد»" });
  else {
    ch.forEach((c, i) => !oneOf(CHANNEL_IDS, c) && errors.push({ path: `${path}.channelIds[${i}]`, message: "قناة غير معروفة" }));
    if (new Set(ch).size !== ch.length) errors.push({ path: `${path}.channelIds`, message: "قنوات مكررة" });
    if (ch.includes("none") && ch.length > 1) errors.push({ path: `${path}.channelIds`, message: "لا يمكن الجمع بين «لا شيء بعد» وقناة فعلية" });
  }
  if (errors.length) return { success: false, errors };
  return {
    success: true,
    data: {
      schemaVersion: 1,
      businessId: v.businessId as AnswersV1["businessId"],
      goalId: v.goalId as AnswersV1["goalId"],
      channelIds: [...(ch as ChannelId[])],
      teamId: v.teamId as AnswersV1["teamId"],
      timelineId: v.timelineId as AnswersV1["timelineId"],
    },
  };
}

function parseTask(v: unknown, path: string, errors: FieldError[]): Task | null {
  if (!isObj(v)) {
    errors.push({ path, message: "مهمة غير صالحة" });
    return null;
  }
  const phase = v.phase;
  if (phase !== 1 && phase !== 2 && phase !== 3 && phase !== 4) errors.push({ path: `${path}.phase`, message: "المرحلة يجب أن تكون 1–4" });
  if (typeof v.done !== "boolean") errors.push({ path: `${path}.done`, message: "قيمة منطقية مطلوبة" });
  return {
    id: str(v.id, `${path}.id`, 64, errors, true),
    phase: phase as Task["phase"],
    title: str(v.title, `${path}.title`, LIMITS.title, errors, true),
    owner: str(v.owner, `${path}.owner`, LIMITS.label, errors),
    approval: str(v.approval, `${path}.approval`, LIMITS.title, errors),
    deliverable: str(v.deliverable, `${path}.deliverable`, LIMITS.title, errors),
    metric: str(v.metric, `${path}.metric`, LIMITS.title, errors),
    done: v.done === true,
  };
}

function parsePost(v: unknown, path: string, errors: FieldError[]): Post | null {
  if (!isObj(v)) {
    errors.push({ path, message: "منشور غير صالح" });
    return null;
  }
  if (!isIsoDate(v.date)) errors.push({ path: `${path}.date`, message: "تاريخ بصيغة YYYY-MM-DD مطلوب" });
  if (!oneOf(POST_CHANNEL_IDS, v.channel)) errors.push({ path: `${path}.channel`, message: "قناة غير معروفة" });
  if (!oneOf(POST_STATUS_IDS, v.status)) errors.push({ path: `${path}.status`, message: "حالة غير معروفة" });
  return {
    id: str(v.id, `${path}.id`, 64, errors, true),
    date: v.date as string,
    channel: v.channel as Post["channel"],
    idea: str(v.idea, `${path}.idea`, LIMITS.note, errors, true),
    goal: str(v.goal, `${path}.goal`, LIMITS.title, errors),
    cta: str(v.cta, `${path}.cta`, LIMITS.title, errors),
    status: v.status as Post["status"],
  };
}

export function parseDraft(v: unknown): ParseResult<DraftV1> {
  if (!isObj(v)) return { success: false, errors: [{ path: "", message: "الملف لا يحتوي كائن JSON صالحاً" }] };
  if (v.schemaVersion !== 1) return { success: false, errors: [{ path: "schemaVersion", message: `إصدار ملف غير مدعوم: ${String(v.schemaVersion)} (المدعوم: 1)` }] };
  const errors: FieldError[] = [];
  const answers = parseAnswers(v.answers);
  if (!answers.success) errors.push(...answers.errors);
  if (!isIsoDate(v.startDate)) errors.push({ path: "startDate", message: "تاريخ بداية بصيغة YYYY-MM-DD مطلوب" });
  const tasksIn = v.tasks;
  const postsIn = v.posts;
  if (!Array.isArray(tasksIn)) errors.push({ path: "tasks", message: "قائمة مهام مطلوبة" });
  else if (tasksIn.length > LIMITS.tasks) errors.push({ path: "tasks", message: `أكثر من ${LIMITS.tasks} مهمة` });
  if (!Array.isArray(postsIn)) errors.push({ path: "posts", message: "قائمة منشورات مطلوبة" });
  else if (postsIn.length > LIMITS.posts) errors.push({ path: "posts", message: `أكثر من ${LIMITS.posts} منشوراً` });
  if (errors.length) return { success: false, errors };

  const tasks = (tasksIn as unknown[]).map((t, i) => parseTask(t, `tasks[${i}]`, errors)).filter((t): t is Task => !!t);
  const posts = (postsIn as unknown[]).map((p, i) => parsePost(p, `posts[${i}]`, errors)).filter((p): p is Post => !!p);
  const ids = [...tasks.map((t) => t.id), ...posts.map((p) => p.id)];
  if (new Set(ids).size !== ids.length) errors.push({ path: "ids", message: "معرّفات مكررة داخل الملف" });
  const start = v.startDate as string;
  posts.forEach((p, i) => {
    if (isIsoDate(p.date) && p.date < start) errors.push({ path: `posts[${i}].date`, message: "قبل تاريخ بداية الخطة" });
  });
  const ue = isObj(v.userEdited) ? v.userEdited : {};
  const draft: DraftV1 = {
    schemaVersion: 1,
    id: str(v.id, "id", 64, errors, true),
    label: str(v.label, "label", LIMITS.label, errors),
    createdAt: str(v.createdAt, "createdAt", 40, errors, true),
    updatedAt: str(v.updatedAt, "updatedAt", 40, errors, true),
    ruleVersion: str(v.ruleVersion, "ruleVersion", 40, errors, true),
    answers: (answers as { success: true; data: AnswersV1 }).data,
    startDate: start,
    tasks,
    posts,
    userEdited: { tasks: ue.tasks === true, posts: ue.posts === true },
  };
  return errors.length ? { success: false, errors } : { success: true, data: draft };
}

/** قراءة ملف استيراد: الحجم أولاً ثم JSON ثم المخطط. لا يلمس أي حالة قائمة. */
export function parseImportText(text: string, byteLength: number): ParseResult<DraftV1> {
  if (byteLength > LIMITS.importBytes) return { success: false, errors: [{ path: "", message: `الملف أكبر من ${LIMITS.importBytes / 1024} KiB` }] };
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { success: false, errors: [{ path: "", message: "الملف ليس JSON صالحاً" }] };
  }
  return parseDraft(json);
}
