# 0005. Language in a cookie, per-request i18n instance

- Status: Accepted
- Date: 2026-11-16

## Context

The language switch stored the choice in `localStorage` and applied it in an effect on the global i18next instance. The server cannot see `localStorage`, so it rendered English, and Next hydrates in pieces, so the header's effect switched the language before the list hydrated, causing hydration mismatches. The global instance is also shared by concurrent server requests, so it must not be mutated per request.

## Decision

- The choice is stored in a `language` cookie (`lib/language.ts` holds the supported languages and cookie name).
- `app/layout.tsx` reads the cookie, sets `<html lang>` and passes the language to `Providers`, which creates one i18next instance with `createI18n(language)` and exposes it through `I18nextProvider`. Server and client both start in the same language.
- The global instance from `@I18n` remains for tests and Storybook.

## Consequences

- No hydration mismatch and no flash of English after reload.
- The root layout reads cookies and is therefore rendered dynamically (all pages already are).
- Locale-based URLs (`app/[lang]/`) remain a possible future change if SEO per language is needed.
