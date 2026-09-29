# Architecture

One Next.js app. Content pages are static Server Components; the studio is one client island on `/planner`. No backend, database, accounts or AI provider.

```
lib/site.ts                  published facts (source: ghinamedia.com) + activities with relationship/source + training paths + service guide
lib/planner/types.ts         contracts: AnswersV1, PlanV1, DraftV1, Task, Post, ParseResult, LIMITS; stable Latin ids
lib/planner/dict.ts          Arabic labels for every id (the only place UI text for answers lives)
lib/planner/rules.ts         deterministic rules → ranked recommendations with reasonCodes, checklist, gaps (RULE_VERSION)
lib/planner/plan30.ts        4-phase task template + content-calendar seed
lib/planner/dates.ts         local YYYY-MM-DD arithmetic via Date.UTC (no timezone drift)
lib/planner/validate.ts      parse boundary for anything from outside the UI (import, storage, ?goal=)
lib/planner/export.ts        JSON (schema-versioned, no name), CSV (BOM, formula-injection guard), brief text, short WhatsApp text
lib/planner/storage.ts       optional localStorage slots A/B, try/catch, typed failure reasons
lib/planner/draft.ts         create draft, apply new answers without overwriting edits, compare two drafts
components/studio/*          wizard, recommendations, plan editor, calendar editor, brief/export/drafts, compare, print brief, dialog/tabs
```

`lib/planner/*` has no React or Next imports and uses explicit `.ts` imports, so `node --test` runs it directly.

## Invariants (enforced by `tests/planner.test.ts`)

- Same answers + same `RULE_VERSION` → identical recommendation order and `reasonCodes` (checked over all 2,160 input combinations of the test grid).
- No duplicate services; every `serviceId` exists in `lib/site.ts`; at most 3 core + 1 optional.
- Ranking = score desc, then catalog order — independent of rule insertion order and channel order.
- `none` can never coexist with a real channel — same `toggleChannel` rule in the UI and in `parseAnswers`.
- Posts are never scheduled before the start date and stay within 30 days.
- Editing tasks/posts marks them user-edited; new answers never replace them without explicit confirmation.
- An invalid or oversized import never touches the open plan.
- CSV cells that start with `= + - @` (after spaces) or tab/CR are prefixed so spreadsheets do not execute them.

## Data limits

Import ≤ 256 KiB; title 160 chars; note 2000; label 60; ≤ 60 tasks; ≤ 60 posts. Unsupported `schemaVersion` is rejected with an Arabic reason — no silent fallback.

## Privacy

Nothing is sent anywhere. Drafts are saved only when the visitor clicks save, only in that browser, without the name. WhatsApp opens with a prefilled message that the visitor sends themselves.

## Deferred (P2 — not implemented, no fake success)

AI assistant, CRM/booking, n8n lead flow, client portal, analytics, budget calculator, English/CMS. Each needs the agency's accounts, consent, data agreements and a cost ceiling first.
