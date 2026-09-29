# LCP investigation and fix

All numbers: `npm run measure` (Lighthouse 12.8 Node API, mobile default preset = simulated slow 4G + 4× CPU, Playwright Chromium 1243), 3 runs per route, median, local `next build && next start`. Every run is validated (fresh `fetchTime`, `requestedUrl` equals the target, final URL on the same path, no `runtimeError`/`runWarnings`, numeric metrics). The only tolerated error is chrome-launcher's Windows `EPERM` in `destroyTmp`, and only after the result is already in memory. Per-run reports: `docs/evidence/runs/<label>/` (git-ignored); summaries: `docs/evidence/lighthouse-<label>.json` (committed).

## 1. What the report said before any change (`before-lcp`, code of `97e0465`)

| Route | LCP per run (ms) | Median LCP | FCP | JS transfer |
|---|---|---|---|---|
| `/` | 2941 / 2850 / 2846 | **2850** | 906 | 177.9 KiB |
| `/planner` | 2654 / 2653 / 2654 | **2654** | 756 | 177.9 KiB |

- LCP element on both routes: the concept disclaimer bar `body > div.bg-gold` (text).
- Phases: TTFB ≈ 454 ms, load delay 0, load time 0, **render delay ≈ 2.2–2.5 s** (a text element — no resource to load).

## 2. Cause, from evidence

- Observed (unthrottled) trace: the page paints its first content at ≈ 83 ms (`Paint` events), but FCP/LCP are recorded at **presentation** time (298–757 ms depending on the run).
- Lantern source (`@paulirish/trace_engine/.../lantern/metrics/LargestContentfulPaint.js:37-47`, `FirstContentfulPaint.js:100-117`): unlike FCP, the LCP graph treats **every network request that finished before the observed LCP** as blocking (except low-priority images), plus the CPU of scripts evaluated before it. All scripts finished by ≈ 43 ms and were evaluated at ≈ 85 ms, so they were always in the LCP graph.
- Therefore simulated LCP ≈ TTFB + time to download everything that finished before the paint (HTML, CSS, both fonts, all JS) at 1.47 Mbps + script evaluation at 4× CPU. The lever is **bytes finishing before the paint**, not the element itself.
- The portrait was fetched before the paint (66 KiB) but at `Low` priority, so Lantern excludes it — it is not a cause and was left untouched.

## 3. Rounds

| Round | Hypothesis | Change | `/` median | `/planner` median | Decision |
|---|---|---|---|---|---|
| R1 | Client JS and font bytes on the critical path | QR codes rendered on the server (`qrcode.react` removed from the shared client chunk, −6.8 KiB JS); fonts subset to the full Arabic block (30.6 → 23.7 KiB each) | 2850 → **2601** | 2654 → **2499** | kept |
| R2 | A forced layout (`getBoundingClientRect`) in the particles mount effect pulls the hydration task into the pessimistic graph | size from `ResizeObserver`, init on idle | 2606 | 2512 | **no effect — reverted** |
| R3 | Remaining font bytes | fonts subset to core Arabic (U+0621–065F, digits, Arabic punctuation) — every Arabic character the site uses is inside it (checked); 23.7 → 11.9 KiB each | **2473** | **2366** | kept |
| Final | — | same code after a clean `npm ci` | **2456** (2527/2456/2445) | **2496** (2496/2500/2360) | target met by median |

Earlier rounds (previous session): TTF → WOFF2 kept; `experimental.inlineCss` rejected.

Nothing visual was removed: the portrait, particles, spotlight, clock and animations are unchanged; font rendering and Arabic joining were checked in the browser after subsetting (all 8 GSUB features and GPOS kept).

## 4. Result and limits

- Median LCP ≤ 2.5 s on both routes, CLS 0, performance 98, accessibility 100, axe 0 critical/serious on 8 pages; JS 159.2 KiB (start of the studio round) → 171.1 KiB.
- **Margin is thin**: individual runs reach 2527 ms on `/` and 2500 ms on `/planner`. A slower machine or network can put the median above 2.5 s.
- Lab numbers only (simulated throttling). No field (CrUX/RUM) data exists for this concept.
- Trade-off of R3: extended Persian/Urdu letters (U+0671–06FF) typed by a visitor render in the system Arabic font instead of Kufi.
