# Sources

Every factual item in this concept comes from the public website https://ghinamedia.com, inspected on 2026-09-29.
Nothing was taken from private sources. No client names, testimonials, metrics, prices or accreditations were added.

| Data in `lib/site.ts` | Source page |
|---|---|
| Phone `+962781385015`, email `ghina@ghinamedia.com` | Header / footer of every page |
| WhatsApp `wa.me/962781385015` | https://ghinamedia.com/contact/ (WhatsApp link) |
| Address "King Abdullah II Eben Al Hussein, Irbid, Jordan" | https://ghinamedia.com/contact/ |
| Facebook, Instagram, LinkedIn links | https://ghinamedia.com/contact/ |
| "10 years of experience", "Certified Media Planning Professional", SEO / PPC / Social Media / Brand Reputation Monitoring | https://ghinamedia.com/ |
| Vision and mission (translated to Arabic) | https://ghinamedia.com/ |
| 11 services | https://ghinamedia.com/services/ |
| 13 training programmes (duplicates removed only) | https://ghinamedia.com/training-workshops/ |
| 16 activities (Arabic text as published, lightly shortened), each tagged with the relationship its wording supports: signed agreement, speaker/guest, event participation, meeting | https://ghinamedia.com/our-activities/ |
| Description of Ghina Fahmawi as founder and "المدربة في شركة ميتا" | https://ghinamedia.com/our-activities/ |

## Written for the concept (not claims about the company)

- One-line descriptions of each service and the "when do you need it / what you need / next step" notes (`serviceGuide`) — general explanations, not Ghina Media's official scope.
- The three training paths (`trainingPaths`) — groupings of published training topics suggested by this concept, not programmes announced by Ghina Media.
- The illustrative work story on `/activities` and the sample output on `/` — labelled as illustrative on the page.
- The planner rules in `lib/planner.ts`: fixed, deterministic mappings from answers to published services. Its output is labelled as initial recommendations, not AI analysis.
- The "opportunities" page: observations about the public site (for example, no booking or FAQ page found) phrased as suggestions, each with a human approval gate.

## Not published on the site (shown as missing)

- Opening hours.
- Prices, packages, client list.

## Assets

The company's logo and website images are **not** included in this repository. The header uses a text wordmark.

`public/ghina-fahmawi.webp`: portrait supplied by the project owner on 2026-09-29 for this concept (resized to 720px WebP). It is not taken from ghinamedia.com. Remove it if the pictured person does not approve its use.
The Droid Arabic Kufi font files (`app/fonts/`) are licensed under the Apache License 2.0. They were converted from TTF to WOFF2 (same glyphs, fontTools) to reduce download size.

## Code reused and adapted

Adapted (not copied verbatim) from a local reference project, `C:\apcasystems`, which was only read:

| Here | Adapted from | Notes |
|---|---|---|
| `components/hero-particles.tsx` | `js/nodes.js` + `js/apca-particles.js` | nodes.js — Copyright (C) 2018 Oğuzhan Eroğlu, MIT License, https://github.com/rohanrhu/nodes.js. Rewritten as a React canvas: fewer nodes, slower drift, pauses off-screen and in hidden tabs, pointer push on mouse devices only, a single static frame under `prefers-reduced-motion`. |
| `components/amman-clock.tsx` | `initDigitalClock` in `apca-script.js` | Same `Intl` + `Asia/Amman` approach; rebuilt with `useSyncExternalStore` (no hydration mismatch, one shared timer cleared when the last clock unmounts), Arabic date. |
| `components/interactions.tsx` | `initScrollReveal` and the scrolled-header idea in `initNavigation` (`apca-script.js`) | IntersectionObserver reveal; content stays visible without JavaScript and under reduced motion. |

No configuration, data, images, texts or client names from that project were used.
