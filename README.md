# Ghina Media — independent concept

**تصوّر تجريبي مستقل — غير تابع للموقع الرسمي**

An independent Arabic RTL demo built around the public information on https://ghinamedia.com (Irbid, Jordan).
It is **not** Ghina Media's official website, is not endorsed by the company, and is set to `noindex`.

## What it contains

- `/` home page with a direct WhatsApp and phone bar
- `/planner`: five questions → initial recommendations from fixed rules (`lib/planner.ts`) → a prefilled WhatsApp message that the visitor sends themselves. There is no backend, no storage and no automatic pricing.
- `/services`, `/training`, `/activities`, `/contact`: published content only
- `/opportunities`: improvement ideas, each with a human approval gate
- `/developer`: about this concept

All data and its sources: [SOURCES.md](SOURCES.md).

## Stack

Next.js 16 App Router · React 19 · Tailwind CSS 4 · Droid Arabic Kufi (Apache 2.0) · `qrcode.react` · `lucide-react`

## Run

```
npm install
npm run lint
npm run typecheck
npm run build
npm start
```

No environment variables are needed (see `.env.example`).
