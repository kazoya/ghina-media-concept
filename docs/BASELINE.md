# Baseline (M0) — before the studio round

Measured 2026-09-29 on commit `f24cf47` (production at the time), before any change in this round.

## Code state observed

| Area | Observed in the code at `f24cf47` |
|---|---|
| Stack | Next 16.3.1, React 19.2.8, Tailwind 4, one app, all routes static |
| Planner | `lib/planner.ts` + `components/planner.tsx`: 5 questions, answers stored as **Arabic strings**, goal/business maps appended in insertion order, `slice(0, 4)`, readiness score `20 + 12×channels + team bonus` clamped 10–95 |
| Persistence | none (React state only) |
| Tests | no `test` script, no test files in the repo; external Playwright suites existed outside the repo |
| Identity | portrait, Amman clock, particles, spotlight, reveal (kept unchanged in intent) |

Gaps confirmed by reading the code (the handoff pack listed them as candidates):

- Business logic keyed on Arabic display text → an import or a copy edit could silently break mapping.
- "None yet" exclusivity enforced only in the UI.
- `slice(0,4)` after insertion-ordered appends → the baseline `consult` rule could drop out depending on rule order.
- "Start over" did not clear the name field.
- Readiness score looked precise without a stated model.

## Measurements (median of 3, Lighthouse 12 mobile preset, local `next start`, same machine as "after")

| Route | Perf | A11y | Best pr. | LCP | CLS | TBT | Script transfer |
|---|---|---|---|---|---|---|---|
| `/` | 96 | 100 | 100 | 2740 ms | 0 | 17 ms | 159.2 KiB |
| `/planner` | 97 | 100 | 100 | 2642 ms | 0 | 36 ms | 159.2 KiB |

axe-core 4.13 (WCAG 2.0/2.1 A+AA), 390 px viewport: 0 violations on `/`, `/planner`, `/services`, `/training`, `/activities`, `/contact`.

Raw summary: [`evidence/lighthouse-baseline.json`](evidence/lighthouse-baseline.json).
LCP was already above the 2.5 s project target before this round.
