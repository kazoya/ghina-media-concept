import { planPosts, planTasks } from "./plan30.ts";
import { RULE_VERSION, buildPlan } from "./rules.ts";
import type { AnswersV1, DraftV1, PlanV1 } from "./types.ts";

export const makeId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function newDraft(answers: AnswersV1, startDate: string, now = new Date(), id = makeId): DraftV1 {
  const t = now.toISOString();
  return {
    schemaVersion: 1,
    id: id(),
    label: "",
    createdAt: t,
    updatedAt: t,
    ruleVersion: RULE_VERSION,
    answers,
    startDate,
    tasks: planTasks(answers, id),
    posts: planPosts(answers, startDate, id),
    userEdited: { tasks: false, posts: false },
  };
}

/** تحديث الإجابات: التوصيات تُعاد دائماً، أما المهام والمنشورات المعدّلة فلا تُستبدل إلا بموافقة صريحة. */
export function applyAnswers(d: DraftV1, answers: AnswersV1, opts: { regenerateEdited: boolean }, id = makeId): DraftV1 {
  const keepTasks = d.userEdited.tasks && !opts.regenerateEdited;
  const keepPosts = d.userEdited.posts && !opts.regenerateEdited;
  return {
    ...d,
    answers,
    ruleVersion: RULE_VERSION,
    updatedAt: new Date().toISOString(),
    tasks: keepTasks ? d.tasks : planTasks(answers, id),
    posts: keepPosts ? d.posts : planPosts(answers, d.startDate, id),
    userEdited: { tasks: keepTasks, posts: keepPosts },
  };
}

export const planOf = (d: DraftV1): PlanV1 => buildPlan(d.answers);

export type DraftDiff = {
  inputs: { field: string; a: string; b: string; same: boolean }[];
  services: { serviceId: string; rankA: number | null; rankB: number | null }[];
  tasksPerPhase: { phase: number; a: number; b: number }[];
  postsPerChannel: { channel: string; a: number; b: number }[];
  startDate: { a: string; b: string };
};

export function compareDrafts(a: DraftV1, b: DraftV1, labels: (field: string, value: unknown) => string): DraftDiff {
  const fields = ["businessId", "goalId", "channelIds", "teamId", "timelineId"] as const;
  const pa = planOf(a);
  const pb = planOf(b);
  const ids = [...new Set([...pa.recommendations, ...pb.recommendations].map((r) => r.serviceId))];
  const rank = (p: PlanV1, id: string) => p.recommendations.find((r) => r.serviceId === id)?.rank ?? null;
  const chans = [...new Set([...a.posts, ...b.posts].map((p) => p.channel))];
  return {
    inputs: fields.map((f) => {
      const x = labels(f, a.answers[f]);
      const y = labels(f, b.answers[f]);
      return { field: f, a: x, b: y, same: x === y };
    }),
    services: ids.map((id) => ({ serviceId: id, rankA: rank(pa, id), rankB: rank(pb, id) })),
    tasksPerPhase: [1, 2, 3, 4].map((ph) => ({ phase: ph, a: a.tasks.filter((t) => t.phase === ph).length, b: b.tasks.filter((t) => t.phase === ph).length })),
    postsPerChannel: chans.map((c) => ({ channel: c, a: a.posts.filter((p) => p.channel === c).length, b: b.posts.filter((p) => p.channel === c).length })),
    startDate: { a: a.startDate, b: b.startDate },
  };
}
