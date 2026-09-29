# Testing

```
npm ci
npm run lint
npm run typecheck
npm test                      # logic: node:test over lib/planner (19 tests)
npm run build && npx next start -p 3000
npx playwright install chromium
BASE=http://localhost:3000 npm run test:e2e   # studio (67) + site (134) + visual (43)
BASE=http://localhost:3000 LABEL=x npm run measure   # Lighthouse ×3/route + axe on 8 pages
```

Everything runs from this project's `devDependencies` (`playwright`, `@axe-core/playwright`, `lighthouse`, `chrome-launcher`); no other project or machine path is used.

All external requests are blocked inside the e2e run: no WhatsApp message, email or third-party request is sent.

## Logic tests (`tests/planner.test.ts`)

Invariants over the full input grid, determinism, channel-order independence, the three behavioural acceptance scenarios (e-store without website, team wanting training, explorer without pressure language), parse boundaries, JSON round trip, import rejection cases, CSV injection/quoting/BOM, date arithmetic across month and DST boundaries, edit preservation, storage failures (unavailable, quota, corrupt), draft comparison, WhatsApp message content, and site-data provenance.

### Counterfactual (do the tests fail when the guarded behaviour is removed?)

| Mutation | Tests that failed |
|---|---|
| Remove the CSV formula guard | CSV: formula injection guarded… |
| Remove the deterministic ranking sort | invariants over the full input space… |
| Allow `none` with a real channel | parseAnswers boundaries; import rejects… |

Each mutation was reverted and the suite returned to 19/19.

## Browser tests (`tests/e2e/studio.e2e.mjs`)

1. Full journey at 1366 px: home gateway → planner with preset goal → answers → recommendations with reasons → keyboard tabs (RTL arrows, End) → edit/add task → add/edit post (with `=SUM(...)`, quotes, comma, newline) → grid view → save A (name not stored) → export JSON and CSV (content checked) → copy brief (clipboard read back) → WhatsApp href checked, not opened → reload (no silent autosave) → second plan → save B → reopen A with edits → compare → change answers after edits (confirmation dialog, edits kept) → invalid and oversized import (plan untouched) → Escape on dialog → valid import round trip → reset with saved-draft wipe → refresh shows nothing restored. No console errors, no failed local requests, no external request attempted.
2. Storage throws `QuotaExceededError` and clipboard rejects (390 px touch): honest failure notices, manual-copy fallback, session continues.
3. Print media: only the brief, RTL, header/bars/tabs hidden; PDF rendered to `tests/e2e/artifacts/brief.pdf`.
4. All 8 routes at 320, 390, 768, 1440 px and 640 px (≈ 200 % zoom of 1280): status 200, `lang=ar dir=rtl`, concept label, `noindex` meta + header, no horizontal overflow.
5. Services filter and details, safe `?goal=` mapping (unknown value ignored), training paths, activities grouped by relationship with 16 source links, illustrative story label, home sample label, portrait and `#founder`, clock not live-announced.
6. JavaScript disabled (static content visible, planner fallback with direct contact) and reduced motion (content visible immediately).

`tests/e2e/site.e2e.mjs` — every route on desktop and mobile: status, `lang/dir`, `noindex` meta + header, concept label, h1, overflow, navigation (incl. mobile menu), planner smoke, every link (internal 200, external allow-list), `robots.txt`, 404.

`tests/e2e/visual.e2e.mjs` — Amman clock (format, time zone, Arabic date, ticking), particles canvas, cursor spotlight (mouse only), hover lift, native cursor, text selection, reveal, header shadow, 44 px targets, touch behaviour, reduced motion, no-JS, `#founder` lands on the photo, WCAG contrast of the palette.

`scripts/measure.mjs` — see `PERFORMANCE.md` for the validation rules.
