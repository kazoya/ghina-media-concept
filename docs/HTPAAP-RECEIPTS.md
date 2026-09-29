# HTPAAP transfer receipts

Protocol: `source → observed mechanism → local invariant → change → test → result`. Grades: A = code + reproducible test.

## 1. Dialog focus return — Radix Primitives

| | |
|---|---|
| Source | `radix-ui/primitives` @ `f7ecd5ab16f5e1e820eb5786a1419a98a2d594ae` |
| Paths verified to exist | `packages/react/dialog/src/{dialog.tsx,index.ts,dialog.test.tsx}`, `packages/react/focus-scope/src/focus-scope.tsx`, `packages/react/dismissable-layer/src/dismissable-layer.tsx` |
| Observed | `focus-scope.tsx:168-194` stores `document.activeElement` on mount and focuses it again on unmount; `dialog.tsx:322` refocuses the trigger on close; `dialog.tsx:463` links content to the title with `aria-labelledby`. |
| Alternative explanation | Native `<dialog>` + `showModal()` already traps focus and handles Escape, but does **not** guarantee focus returns to the trigger across browsers — that is the part worth transferring. |
| Local invariant | Closing any studio dialog (button, Escape) returns focus to the element that opened it; the dialog is named by its title. |
| Change | `components/studio/ui.tsx` `Dialog`: remembers `document.activeElement` before `showModal()`, restores it on the `close` event; `aria-labelledby` via `useId`. No dependency added. |
| Test | `tests/e2e/studio.e2e.mjs`: "dialog: focus returns to trigger on close", "dialog: Escape closes and keeps current plan". |
| Result | PASS (local and production). Grade **A** for the behaviour tested; screen-reader announcement was not tested with a real screen reader. |

## 2. Parse boundary — Zod

| | |
|---|---|
| Source | `colinhacks/zod` @ `2bf7b0630d5378033e90bcee82cb32b0fe04628e`, `packages/zod/src/v4/classic/parse.ts` (verified to exist) |
| Observed | Lines 5–6: `ZodSafeParseSuccess<T> = { success: true; data }` / `ZodSafeParseError<T> = { success: false; error }` — a discriminated result instead of throwing or defaulting. |
| Alternative explanation | Adding Zod would give the same shape; the lesson is the boundary contract, not the library. |
| Local invariant | Every value from outside the UI (JSON import, localStorage, `?goal=`) passes `ParseResult<T>`; failure carries Arabic field errors; unknown `schemaVersion` is rejected, never coerced. |
| Change | `lib/planner/validate.ts` (`parseAnswers`, `parseDraft`, `parseImportText`), used by `storage.ts` and the studio import. No dependency added. |
| Test | `tests/planner.test.ts`: valid, malformed JSON, oversized, unknown version, number-for-text, none+channel, too many items, date before start, duplicate ids, invalid date, over-length. E2E: invalid and oversized import leave the plan untouched. |
| Counterfactual | Disabling the none+channel rule made two tests fail; restoring it made them pass (see `TESTING.md`). |
| Result | PASS. Grade **A**. |

TigerBeetle/SQLite were not used: nothing in this marketing site needs their mechanisms.
