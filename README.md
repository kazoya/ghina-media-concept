# Ghina Media — independent concept

**تصوّر تجريبي مستقل — غير تابع للموقع الرسمي**

An independent Arabic RTL demo built around the public information on https://ghinamedia.com (Irbid, Jordan).
It is **not** Ghina Media's official website, is not endorsed by the company, and is set to `noindex`.

## What it contains

- `/` home page with a direct WhatsApp and phone bar
- `/planner` — growth-plan studio: five questions → explained initial recommendations from fixed, versioned rules (each reason tied to an answer) → editable 30-day plan in four phases → editable content calendar (list, desktop grid) → brief: copy, print/save as PDF via the browser, JSON and CSV export, short WhatsApp message the visitor sends themselves → optional local drafts A/B, JSON import with validation, side-by-side comparison, full reset. No backend, no account, no automatic pricing.
- `/services`: filterable explorer with "when do you need it" notes and a link into the planner
- `/training`: three guided paths built only from published training topics, plus the published list
- `/activities`: published activities grouped by the relationship their wording supports (signed agreement / speaker / event participation / meeting), each with its source, plus a clearly labelled illustrative work-story template
- `/contact`: published contact details
- `/opportunities`: improvement ideas, each with a human approval gate
- `/developer`: about this concept
- Visual layer: Amman digital clock (`Asia/Amman`, Arabic date), a light particle background in the hero, cursor-following spotlight on selected cards (mouse only), soft scroll reveals — all disabled or static under `prefers-reduced-motion`, no animation libraries

All data and its sources: [SOURCES.md](SOURCES.md). Architecture, tests and evidence: [`docs/`](docs/).

## Stack

Next.js 16 App Router · React 19 · Tailwind CSS 4 · Droid Arabic Kufi (Apache 2.0) · `qrcode.react` · `lucide-react`

## Run

```
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm start
npx playwright install chromium               # once
BASE=http://localhost:3000 npm run test:e2e   # studio + site + visual suites
BASE=http://localhost:3000 LABEL=my-run npm run measure   # Lighthouse ×3 + axe, validated runs
```

All test and measurement tooling runs from this project's own dependencies.

No environment variables are needed (see `.env.example`).
