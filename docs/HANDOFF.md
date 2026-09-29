# Handoff — growth-plan studio (P0 + P1) and LCP

## Version

| | |
|---|---|
| Repository | https://github.com/kazoya/ghina-media-concept |
| Commits | `f24cf47` (before studio) → `813bad1` (studio) → `54ff393` (LCP + in-repo tooling) |
| Environment | Windows 11, Node 24.15.0, npm 11.12.1, Next 16.3.1 (Turbopack), Playwright 1.63.0 + Chromium 1243, Lighthouse 12.8, axe-core 4.13 — all from this repo's `devDependencies` (`npm ci` verified clean) |
| Deployment | https://ghina-media-concept.vercel.app — Vercel `dpl_HpZZELaYkLk8MKpw66MnYPaLdu6f` (commit `54ff393`), Ready 2026-09-29 18:19 UTC+3, existing project `muqasa/ghina-media-concept`, no paid services |

## Features

| ID | Status | Where | Evidence | Limit |
|---|---|---|---|---|
| P0 contracts & validation | verified | `lib/planner/types.ts`, `validate.ts` | 19 logic tests incl. boundary cases; mutation check | — |
| F01 explained recommendations | verified | `lib/planner/rules.ts`, `recommendations.tsx` | invariants over 2,160 inputs, determinism, acceptance scenarios; e2e reasons per recommendation | the concept's own rules |
| F02 30-day plan | verified | `plan30.ts`, `plan-editor.tsx` | 4 phases for every input; e2e edit/add/keep-after-answer-change | template, not a commitment |
| F03 content calendar | verified | `calendar-editor.tsx` | posts within 30 days, never before start; e2e add/edit/status/grid | no social publishing |
| F04 save/restore | verified | `storage.ts` | unit save/load/delete/quota/unavailable/corrupt; e2e reload + reopen, name not stored, storage-full notice | this browser only |
| F05 export/share | verified | `export.ts`, `brief-panel.tsx`, `print-brief.tsx` | JSON round trip, CSV guard/quoting/BOM, clipboard read-back and denied fallback, WhatsApp href, print + PDF | PDF via browser print |
| F06 compare | verified | `draft.ts`, `compare-panel.tsx` | unit + e2e | no "expected return" |
| F07 service explorer | verified | `service-explorer.tsx` | e2e filter, details, safe `?goal=` | explanations written by the concept |
| F08 training paths | verified | `lib/site.ts`, `/training` | unit refs + e2e labels | not agency programmes |
| F09 work evidence | verified | `lib/site.ts`, `/activities` | unit provenance + e2e 16 sources, illustrative label | no public client stories |
| F10 design, motion, performance | verified | globals, home, fonts, `qr.tsx` | axe 0 on 8 pages; 5 widths + 200 % zoom; reduced motion; no-JS; LCP below | thin LCP margin locally |

## Measurements (median of 3, `npm run measure`, validated runs)

| Measure | Before LCP work (`97e0465`, local) | After (`54ff393`, local, clean `npm ci`) | Production (`54ff393`) |
|---|---|---|---|
| LCP `/` per run | 2941 / 2850 / 2846 ms | 2527 / 2456 / 2445 ms | 2259 / 1936 / 1995 ms |
| **LCP `/` median** | **2850 ms** | **2456 ms** | **1995 ms** |
| LCP `/planner` per run | 2654 / 2653 / 2654 ms | 2496 / 2500 / 2360 ms | 1960 / 1956 / 1959 ms |
| **LCP `/planner` median** | **2654 ms** | **2496 ms** | **1959 ms** |
| FCP `/` · `/planner` | 906 · 756 ms | 907 · 756 ms | 1003 · 909 ms |
| CLS | 0 · 0 | 0 · 0 | 0 · 0 |
| Performance · Accessibility | 95/97 · 100 | 98/98 · 100 | 98/99 · 100 |
| JS transfer | 177.9 KiB | 171.1 KiB | 174.0 KiB |
| axe critical/serious (8 pages) | 0 | 0 | 0 |

LCP element on all runs: the concept disclaimer bar (text). Cause, rounds (one rejected and reverted) and trade-offs: [`PERFORMANCE.md`](PERFORMANCE.md). Summaries: `docs/evidence/lighthouse-{before-lcp,r1-qr-fonts,r2-particles-idle,r3-core-arabic-fonts,final,production}.json`.

## Functional verification

| Suite | Local (`54ff393`) | Production |
|---|---|---|
| Logic (`npm test`) | 19/19 | n/a |
| Studio journey (`studio.e2e.mjs`) | 67/67 | 67/67 |
| Site-wide (`site.e2e.mjs`) | 134/134 | 134/134 |
| Visual effects (`visual.e2e.mjs`) | 43/43 | 43/43 |

External requests are blocked during every e2e run; no message or request reaches WhatsApp or Ghina Media.

## Report

**What the evidence proves:** all P0/P1 features behave as specified locally and in production; logic invariants hold over the full input grid and the tests fail when the guarded code is removed; median LCP ≤ 2.5 s on both key routes locally and in production with CLS 0 and no accessibility regression; all tooling runs from this repo after a clean `npm ci`.

**What remains assumption:** usefulness of the rules and templates to real prospects; that the agency agrees with the wording.

**Not tested:** real screen readers, Safari/Firefox, real iOS/Android devices, field (CrUX/RUM) performance.

**Limits:** local LCP margin is thin (single runs up to 2527 ms on `/`); extended Persian/Urdu letters fall back to the system font; portrait still needs the pictured person's consent.

**Needs an owner / account / cost (P2, not built):** AI assistant, CRM or booking, n8n lead flow, client portal, analytics, budget calculator, English/CMS.

**Rollback:** promote the previous production deployment in Vercel, or `git revert 54ff393` (LCP work) / `git revert 813bad1` (studio) and push.

**One next step:** show the studio to Ghina Media and collect their corrections to the rules and texts.
