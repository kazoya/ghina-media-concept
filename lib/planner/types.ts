// عقود البيانات. المعرّفات لاتينية ثابتة؛ النصوص العربية في dict.ts فقط.
// ملاحظة: الملفات في lib/planner تستورد بامتداد .ts وتستخدم import type حتى تعمل مباشرة في node:test.
import type { ServiceId } from "../site.ts";

export const BUSINESS_IDS = ["startup", "sme", "ecommerce", "medical", "education", "personal"] as const;
export const GOAL_IDS = ["leads", "search", "social", "identity", "website", "training"] as const;
export const CHANNEL_IDS = ["facebook", "instagram", "linkedin", "website", "whatsapp", "none"] as const;
export const TEAM_IDS = ["solo", "one", "team", "nobody"] as const;
export const TIMELINE_IDS = ["week", "month", "exploring"] as const;
export const POST_STATUS_IDS = ["idea", "draft", "review", "ready"] as const;
export const POST_CHANNEL_IDS = ["facebook", "instagram", "linkedin", "whatsapp", "website"] as const;

export type BusinessId = (typeof BUSINESS_IDS)[number];
export type GoalId = (typeof GOAL_IDS)[number];
export type ChannelId = (typeof CHANNEL_IDS)[number];
export type TeamId = (typeof TEAM_IDS)[number];
export type TimelineId = (typeof TIMELINE_IDS)[number];
export type PostStatus = (typeof POST_STATUS_IDS)[number];
export type PostChannel = (typeof POST_CHANNEL_IDS)[number];

export type AnswersV1 = {
  schemaVersion: 1;
  businessId: BusinessId;
  goalId: GoalId;
  channelIds: ChannelId[];
  teamId: TeamId;
  timelineId: TimelineId;
};

export type ReasonCode = `${"goal" | "business" | "team" | "channel" | "baseline"}:${string}`;

export type Recommendation = {
  serviceId: ServiceId;
  rank: number;
  tier: "core" | "optional";
  score: number;
  reasonCodes: ReasonCode[];
  reasons: string[];
  prerequisites: string[];
  deliverable: string;
};

export type Gap = { code: string; text: string; linkedServiceId?: ServiceId };
export type ChecklistItem = { code: string; label: string; ok: boolean };

export type Task = {
  id: string;
  phase: 1 | 2 | 3 | 4;
  title: string;
  owner: string;
  approval: string;
  deliverable: string;
  metric: string;
  done: boolean;
};

export type Post = {
  id: string;
  date: string; // YYYY-MM-DD محلي
  channel: PostChannel;
  idea: string;
  goal: string;
  cta: string;
  status: PostStatus;
};

export type PlanV1 = {
  ruleVersion: string;
  inputs: AnswersV1;
  recommendations: Recommendation[];
  notChosen: { serviceId: ServiceId; why: string }[];
  gaps: Gap[];
  checklist: ChecklistItem[];
  assumptions: string[];
};

export type DraftV1 = {
  schemaVersion: 1;
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  ruleVersion: string;
  answers: AnswersV1;
  startDate: string;
  tasks: Task[];
  posts: Post[];
  userEdited: { tasks: boolean; posts: boolean };
};

export type FieldError = { path: string; message: string };
export type ParseResult<T> = { success: true; data: T } | { success: false; errors: FieldError[] };

export const LIMITS = {
  importBytes: 256 * 1024,
  title: 160,
  note: 2000,
  label: 60,
  tasks: 60,
  posts: 60,
  planDays: 30,
} as const;
