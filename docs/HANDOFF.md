# Handoff — growth-plan studio round (P0 + P1)

## Version

| | |
|---|---|
| Repository | https://github.com/kazoya/ghina-media-concept |
| Base → feature commit | `f24cf47` → `813bad1` |
| Environment | Windows 11, Node 24.15.0, npm 11.12.1, Next 16.3.1 (Turbopack), Playwright 1.63.0 (Chromium), Lighthouse 12 |
| Deployment | https://ghina-media-concept.vercel.app — Vercel `dpl_8zdvYzECUXHfLVFKAhuYLBhLjCbw`, Ready 2026-09-29 17:42 (UTC+3), existing project `muqasa/ghina-media-concept`, deployed by the GitHub push |

## Features

| ID | Status | Where | Evidence | Limit |
|---|---|---|---|---|
| F01 explained recommendations | verified | `lib/planner/rules.ts`, `components/studio/recommendations.tsx` | invariants over 2,160 inputs, determinism, 3 acceptance scenarios; e2e reasons per recommendation | rules are the concept's own, not the agency's method |
| F02 30-day plan | verified | `lib/planner/plan30.ts`, `plan-editor.tsx` | 4 phases for every input; e2e edit/add/keep-after-answer-change | template, not a commitment |
| F03 content calendar | verified | `calendar-editor.tsx` | posts within 30 days, never before start; e2e add/edit/status, grid on desktop | no social publishing |
| F04 save/restore | verified | `lib/planner/storage.ts` | save/load/delete, quota/unavailable/corrupt; e2e reload + reopen, name not stored, storage-full notice | this browser only, no sync |
| F05 export/share | verified | `lib/planner/export.ts`, `brief-panel.tsx`, `print-brief.tsx` | JSON round trip, CSV injection/quoting/BOM, clipboard read-back and denied fallback, WhatsApp href checked, print media + PDF | PDF via the browser's print dialog, not a native generator |
| F06 compare two drafts | verified | `lib/planner/draft.ts`, `compare-panel.tsx` | unit + e2e differing inputs and rankings | no "expected return" |
| F07 service explorer | verified | `components/service-explorer.tsx` | e2e filter 11→4 announced, details, safe `?goal=` mapping | explanations written by the concept |
| F08 training paths | verified | `lib/site.ts` `trainingPaths`, `/training` | unit: paths reference existing published trainings; e2e 3 paths labelled non-official | not programmes announced by the agency |
| F09 honest work evidence | verified | `lib/site.ts` `activities`, `/activities` | unit: every activity has source + relationship; e2e 16 source links, illustrative label | no client stories exist publicly, none invented |
| F10 design & motion | verified | globals, home gateways/sample, fonts | axe 0 violations ×6 pages, 5 widths + 200 % zoom, reduced motion, no-JS, visual suite 43/43 | LCP target not met (below) |

## Before / after (median of 3, same machine and preset, local `next start`)

| Measure | Before (`f24cf47`) | After (`813bad1`) | Tool | Evidence |
|---|---|---|---|---|
| Lighthouse mobile `/` perf / a11y / BP | 96 / 100 / 100 | 96 / 100 / 100 | Lighthouse 12 | `evidence/lighthouse-*.json` |
| Lighthouse mobile `/planner` | 97 / 100 / 100 | 97 / 100 / 100 | Lighthouse 12 | same |
| LCP `/` · `/planner` | 2740 · 2642 ms | 2744 · 2642 ms | Lighthouse 12 | same |
| CLS `/` · `/planner` | 0 · 0 | 0 · 0 | Lighthouse 12 | same |
| Script transfer (gzip, incl. prefetched chunks) | 159.2 KiB | 177.9 KiB (+18.7) | Lighthouse resource summary | same |
| axe critical/serious (6 pages) | 0 | 0 | axe-core 4.13 | same |
| Full scenario | not tested | 65/65 local, 65/65 production | Playwright | `tests/e2e/studio.e2e.mjs` |

Measured improvement rounds after P1 (limit: two):

1. **Fonts TTF → WOFF2** — hypothesis: font bytes add to LCP render delay. Intermediate build LCP `/` 2895 → 2744 ms, `/planner` 2794 → 2642 ms. **Kept.**
2. **`experimental.inlineCss`** — hypothesis: the render-blocking stylesheet drives the remaining delay. `/` 2741 ms (no change), `/planner` 2791 ms (worse). **Reverted.**

An intermediate build showed CLS 0.097 on `/planner` (Suspense fallback shorter than the studio); fixed by reserving the measured height (675 px mobile / 485 px ≥ md) → CLS 0.

## Report

**What the evidence proves:** all P1 features above behave as specified in local and production browsers; logic invariants hold on the full input grid and the tests fail when the guarded code is removed; no accessibility violations found by axe; no request leaves the site during the journey; the concept label and `noindex` are on every page.

**What remains assumption:** that the rules and templates are useful to Ghina Media's real prospects (no user research); that the text reads naturally to the agency (not reviewed by them).

**Not tested:** real screen readers (NVDA/VoiceOver), real iOS/Android devices, Safari/Firefox, field INP, Lighthouse on the production URL.

**Not met:** LCP ≤ 2.5 s (≈ 2.64–2.74 s, same as baseline; the LCP element is the disclaimer bar text and the time is render delay under simulated slow 4G).

**Needs an owner / account / cost (P2, not built):** AI assistant, CRM or booking, n8n lead flow, client portal, analytics, budget calculator, English/CMS.

**Rollback:** Vercel "Promote" the previous production deployment (from `f24cf47`), or `git revert 813bad1` and push.

**One next step:** show the studio to Ghina Media and get their corrections to the rules and templates before any wider use.
