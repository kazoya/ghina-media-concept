// اختبارات المنطق: npm test  (node:test + type stripping في Node ≥ 22.18)
import { test } from "node:test";
import assert from "node:assert/strict";
import { services } from "../lib/site.ts";
import { activities, trainingPaths, trainings } from "../lib/site.ts";
import { addDays, diffDays, isIsoDate, todayIso } from "../lib/planner/dates.ts";
import { applyAnswers, compareDrafts, newDraft } from "../lib/planner/draft.ts";
import { csvCell, draftToJson, postsToCsv, whatsappMessage } from "../lib/planner/export.ts";
import { buildPlan, recommend, MAX_CORE, MAX_OPTIONAL } from "../lib/planner/rules.ts";
import { deleteDraft, loadDraft, saveDraft } from "../lib/planner/storage.ts";
import { BUSINESS_IDS, CHANNEL_IDS, GOAL_IDS, LIMITS, TEAM_IDS, TIMELINE_IDS, type AnswersV1 } from "../lib/planner/types.ts";
import { parseAnswers, parseImportText, toggleChannel } from "../lib/planner/validate.ts";

const A = (p: Partial<AnswersV1> = {}): AnswersV1 => ({
  schemaVersion: 1,
  businessId: "ecommerce",
  goalId: "leads",
  channelIds: ["instagram"],
  teamId: "solo",
  timelineId: "week",
  ...p,
});
let n = 0;
const seqId = () => `t${++n}`;
const START = "2026-10-01";

// كل التوليفات الممكنة للمدخلات (قنوات فردية + none) — تحقق من الثوابت على المجال كاملاً
function* allAnswers(): Generator<AnswersV1> {
  const chanSets: AnswersV1["channelIds"][] = [["none"], ["facebook"], ["website"], ["whatsapp", "instagram"], ["facebook", "instagram", "linkedin", "website", "whatsapp"]];
  for (const businessId of BUSINESS_IDS) for (const goalId of GOAL_IDS) for (const teamId of TEAM_IDS) for (const timelineId of TIMELINE_IDS) for (const channelIds of chanSets)
    yield { schemaVersion: 1, businessId, goalId, teamId, timelineId, channelIds };
}

test("invariants over the full input space: no duplicates, known ids, bounded count, sorted ranks", () => {
  const ids = new Set(services.map((s) => s.id));
  let count = 0;
  for (const a of allAnswers()) {
    count++;
    const { recommendations } = recommend(a);
    const sid = recommendations.map((r) => r.serviceId);
    assert.equal(new Set(sid).size, sid.length, "duplicate service");
    assert.ok(sid.every((s) => ids.has(s)), "unknown serviceId");
    assert.ok(recommendations.length >= 1 && recommendations.length <= MAX_CORE + MAX_OPTIONAL);
    assert.ok(recommendations.filter((r) => r.tier === "core").length <= MAX_CORE);
    assert.deepEqual(recommendations.map((r) => r.rank), recommendations.map((_, i) => i + 1));
    for (let i = 1; i < recommendations.length; i++) assert.ok(recommendations[i - 1].score >= recommendations[i].score);
    assert.ok(recommendations.every((r) => r.reasons.length > 0 && r.reasons.length === r.reasonCodes.length));
  }
  assert.equal(count, 6 * 6 * 4 * 3 * 5);
});

test("determinism: same input → identical ranking and reasonCodes", () => {
  for (const a of allAnswers()) {
    const x = recommend(a).recommendations.map((r) => [r.serviceId, r.reasonCodes]);
    const y = recommend(structuredClone(a)).recommendations.map((r) => [r.serviceId, r.reasonCodes]);
    assert.deepEqual(x, y);
  }
});

test("channel order does not change the result", () => {
  const x = recommend(A({ channelIds: ["whatsapp", "instagram", "facebook"] })).recommendations;
  const y = recommend(A({ channelIds: ["facebook", "instagram", "whatsapp"] })).recommendations;
  assert.deepEqual(x.map((r) => r.serviceId), y.map((r) => r.serviceId));
});

test("acceptance: e-store without a website → website gap linked to a web recommendation", () => {
  const p = buildPlan(A({ businessId: "ecommerce", channelIds: ["instagram"] }));
  const gap = p.gaps.find((g) => g.code === "no-website");
  assert.ok(gap && gap.linkedServiceId === "web");
  assert.ok(p.recommendations.some((r) => r.serviceId === "web"));
  assert.ok(!/ضمان|مضمون|سيضاعف/.test(JSON.stringify(p)), "no guarantee language");
});

test("acceptance: team wanting training → training ranked first, no forced website", () => {
  const p = buildPlan(A({ goalId: "training", teamId: "team", businessId: "sme", channelIds: ["facebook"] }));
  assert.equal(p.recommendations[0].serviceId, "training");
  assert.ok(!p.recommendations.some((r) => r.serviceId === "web"));
  assert.ok(!p.gaps.some((g) => g.code === "no-website"));
});

test("acceptance: explorer gets no pressure language and a transparent checklist", () => {
  const p = buildPlan(A({ timelineId: "exploring" }));
  assert.ok(!/الآن فقط|عرض محدود|ينتهي|سارع/.test(JSON.stringify(p)));
  assert.equal(p.checklist.find((c) => c.code === "timeline")?.ok, false);
});

test("consult is never silently dropped by insertion order (baseline rule is ranked, not appended)", () => {
  const p = buildPlan(A({ goalId: "search", businessId: "sme", channelIds: ["website"], teamId: "team" }));
  // consult has score 1; it appears only if within top 4 by score, and its absence is explained in notChosen
  const inRecs = p.recommendations.some((r) => r.serviceId === "consult");
  const explained = p.notChosen.some((x) => x.serviceId === "consult" && /بدرجة أقل/.test(x.why));
  assert.ok(inRecs || explained);
});

test("toggleChannel: none is exclusive both ways", () => {
  assert.deepEqual(toggleChannel(["instagram", "facebook"], "none"), ["none"]);
  assert.deepEqual(toggleChannel(["none"], "instagram"), ["instagram"]);
  assert.deepEqual(toggleChannel(["instagram"], "instagram"), []);
});

test("parseAnswers boundaries", () => {
  assert.equal(parseAnswers(A()).success, true);
  const bad = [
    { ...A(), schemaVersion: 2 },
    { ...A(), goalId: "fame" },
    { ...A(), channelIds: ["none", "instagram"] },
    { ...A(), channelIds: ["instagram", "instagram"] },
    { ...A(), channelIds: [] },
    { ...A(), teamId: 3 },
    null,
    "x",
  ];
  for (const b of bad) {
    const r = parseAnswers(b);
    assert.equal(r.success, false, JSON.stringify(b));
    if (!r.success) assert.ok(r.errors.every((e) => /[؀-ۿ]/.test(e.message)), "Arabic field errors");
  }
});

test("draft JSON round trip keeps ids, Arabic text and dates", () => {
  const d = newDraft(A(), START, new Date("2026-09-29T10:00:00Z"), seqId);
  d.tasks[0].title = "مهمة معدّلة \"باقتباس\"، وسطر\nجديد";
  d.posts[0].idea = "فكرة عربية ✓";
  const back = parseImportText(draftToJson(d), 1000);
  assert.ok(back.success);
  if (back.success) {
    assert.deepEqual(back.data.tasks, d.tasks);
    assert.deepEqual(back.data.posts, d.posts);
    assert.deepEqual(back.data.answers, d.answers);
    assert.equal(back.data.startDate, START);
  }
  assert.ok(!/"name"/.test(draftToJson(d)), "no name in export");
});

test("import rejects: malformed, oversized, unknown version, wrong types, none+channel, too many items, date before start, duplicate ids", () => {
  const good = JSON.parse(draftToJson(newDraft(A(), START, new Date(), seqId)));
  const cases: [string, string, number?][] = [
    ["malformed", "{not json"],
    ["oversized", "{}", LIMITS.importBytes + 1],
    ["version", JSON.stringify({ ...good, schemaVersion: 2 })],
    ["number-for-text", JSON.stringify({ ...good, tasks: [{ ...good.tasks[0], title: 42 }] })],
    ["none+channel", JSON.stringify({ ...good, answers: { ...good.answers, channelIds: ["none", "facebook"] } })],
    ["too-many-posts", JSON.stringify({ ...good, posts: Array.from({ length: 61 }, (_, i) => ({ ...good.posts[0], id: `p${i}` })) })],
    ["before-start", JSON.stringify({ ...good, posts: [{ ...good.posts[0], date: "2026-09-01" }] })],
    ["dup-ids", JSON.stringify({ ...good, posts: [good.posts[0], good.posts[0]] })],
    ["bad-date", JSON.stringify({ ...good, startDate: "2026-02-30" })],
    ["too-long", JSON.stringify({ ...good, tasks: [{ ...good.tasks[0], title: "x".repeat(LIMITS.title + 1) }] })],
  ];
  for (const [name, text, size] of cases) {
    const r = parseImportText(text, size ?? text.length);
    assert.equal(r.success, false, name);
  }
});

test("CSV: formula injection guarded, quotes/commas/newlines/Arabic preserved, BOM present", () => {
  for (const v of ["=SUM(A1:A2)", "+1", "-2", "@cmd", "  =HYPERLINK(\"x\")", "\tTAB", "\rCR"]) assert.ok(csvCell(v).startsWith(`"'`), v);
  assert.equal(csvCell("مرحبا, \"عالم\"\nسطر"), `"مرحبا, ""عالم""\nسطر"`);
  const d = newDraft(A(), START, new Date(), seqId);
  d.posts[0].idea = "=1+1";
  const csv = postsToCsv(d);
  assert.ok(csv.startsWith("﻿"));
  assert.ok(csv.includes(`"'=1+1"`));
  assert.ok(!/(^|,)=/.test(csv.replace(/^﻿/, "")));
});

test("dates: local YYYY-MM-DD arithmetic across month/DST boundaries; posts never before start and within 30 days", () => {
  assert.equal(addDays("2026-10-30", 3), "2026-11-02");
  assert.equal(addDays("2027-03-27", 2), "2027-03-29");
  assert.equal(diffDays("2026-12-30", "2027-01-02"), 3);
  assert.equal(isIsoDate("2026-02-30"), false);
  assert.equal(todayIso("Asia/Amman", new Date("2026-09-29T22:30:00Z")), "2026-09-30");
  for (const a of allAnswers()) {
    const d = newDraft(a, START, new Date(), seqId);
    assert.ok(d.posts.length > 0 && d.posts.length <= LIMITS.posts);
    assert.ok(d.posts.every((p) => p.date >= START && diffDays(START, p.date) < 30));
    assert.ok(d.tasks.length <= LIMITS.tasks && [1, 2, 3, 4].every((ph) => d.tasks.some((t) => t.phase === ph)));
  }
});

test("applyAnswers keeps user edits unless regeneration is confirmed", () => {
  const d = newDraft(A(), START, new Date(), seqId);
  d.tasks[0].title = "تعديلي";
  d.userEdited.tasks = true;
  const kept = applyAnswers(d, A({ goalId: "identity" }), { regenerateEdited: false }, seqId);
  assert.equal(kept.tasks[0].title, "تعديلي");
  assert.equal(kept.answers.goalId, "identity");
  const regen = applyAnswers(d, A({ goalId: "identity" }), { regenerateEdited: true }, seqId);
  assert.notEqual(regen.tasks[0].title, "تعديلي");
});

test("storage: save/load/delete, unavailable and quota errors never throw", () => {
  const mem = new Map<string, string>();
  const s = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) };
  const d = newDraft(A(), START, new Date(), seqId);
  assert.deepEqual(saveDraft("A", d, s), { ok: true });
  const l = loadDraft("A", s);
  assert.ok(l && l.success && l.data.id === d.id);
  assert.equal(deleteDraft("A", s), true);
  assert.equal(loadDraft("A", s), null);
  assert.deepEqual(saveDraft("A", d, null), { ok: false, reason: "unavailable" });
  const full = { ...s, setItem: () => { throw Object.assign(new Error("full"), { name: "QuotaExceededError" }); } };
  assert.deepEqual(saveDraft("B", d, full), { ok: false, reason: "quota" });
  mem.set("ghina-studio:v1:draft:B", "{broken");
  const broken = loadDraft("B", s);
  assert.ok(broken && !broken.success);
  assert.ok(!JSON.stringify([...mem.values()]).includes('"name"'));
});

test("compareDrafts reports input and ranking differences", () => {
  const a = newDraft(A({ goalId: "leads" }), START, new Date(), seqId);
  const b = newDraft(A({ goalId: "training", teamId: "team" }), START, new Date(), seqId);
  const diff = compareDrafts(a, b, (_f, v) => String(v));
  assert.equal(diff.inputs.find((i) => i.field === "goalId")?.same, false);
  assert.equal(diff.inputs.find((i) => i.field === "businessId")?.same, true);
  assert.ok(diff.services.some((s) => s.rankA === null || s.rankB === null));
});

test("whatsapp message: known recipient content, concept origin, no plan dump", () => {
  const d = newDraft(A(), START, new Date(), seqId);
  const m = whatsappMessage(d, buildPlan(d.answers), "سارة");
  assert.ok(m.includes("أنا سارة.") && m.includes("تصوّر تجريبي مستقل"));
  assert.ok(m.length < 700);
});

test("site data: every activity has a source and a relationship type; training paths reference existing trainings", () => {
  for (const a of activities) {
    assert.match(a.sourceUrl, /^https:\/\/ghinamedia\.com\//);
    assert.ok(a.relationship.length > 0);
    assert.equal(a.evidence, "published");
  }
  for (const p of trainingPaths) for (const i of p.trainingIdx) assert.ok(trainings[i], `missing training ${i}`);
});

test("ids: CHANNEL_IDS includes none exactly once", () => {
  assert.equal(CHANNEL_IDS.filter((c) => c === "none").length, 1);
});
