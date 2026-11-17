# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A small task manager (written-case exercise) built on the Next.js 16 (App Router) + React 19.2 + TypeScript boilerplate. Backend: tRPC with an in-memory store. UI: shadcn/ui. The folder map is [`STRUCTURE.md`](STRUCTURE.md); the reasoning behind the main choices is in [`docs/adr/`](docs/adr/README.md).

## Commands

| Task                          | Command                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| Dev server                    | `yarn dev` (http://localhost:3000)                          |
| Production build / serve      | `yarn build` / `yarn start`                                 |
| Lint + format check (CI gate) | `yarn lint`                                                 |
| Lint/format with auto-fix     | `yarn lint:fix`                                             |
| Type-check only               | `yarn typecheck`                                            |
| All unit/component tests      | `yarn test`                                                 |
| Single test file              | `yarn vitest run src/path/to/File.spec.tsx`                 |
| Tests in watch mode           | `yarn test:watch`                                           |
| Coverage                      | `yarn test:coverage`                                        |
| E2E tests (Playwright)        | `yarn e2e` (first time: `yarn playwright install chromium`) |
| Storybook                     | `yarn storybook` (port 6006) / `yarn build-storybook`       |
| Guided conventional commit    | `yarn commit`                                               |
| Run in Docker (optional)      | `docker compose up --build` (single replica: in-memory)     |

Node 24 (LTS) is the target (`.nvmrc`; run `nvm use`), `engines` allows ≥ 22.12. The repo uses **yarn** (`yarn.lock`, `.npmrc` has `package-lock=false`); don't create a `package-lock.json`.

## Architecture

`src/app` is routing only. Everything else is layered, and data flows one way: `api` → `hooks` → components/pages. Components never call the backend directly; they go through hooks over the typed tRPC client. Full tree, layer table and alias list: [`STRUCTURE.md`](STRUCTURE.md).

- **Server vs Client Components:** Server Components by default. Add `'use client'` only to the leaf that needs state, effects, event handlers, TanStack Query, `react-hook-form` or `react-i18next` hooks. Providers live in `app/providers.tsx` (client) and are mounted in `app/layout.tsx`.
- **Backend:** tRPC routers in `src/server/routers/`, served by `app/api/trpc/[trpc]/route.ts`. Data lives in an in-memory store (`src/server/store`), lost on restart by design. Server Components call the router in-process through `@Server/caller`.
- **Validation:** one Zod schema per resource in `api/schemas/<resource>/` is used both as the tRPC `.input()` and as the form resolver. Schema messages are i18n keys, not text.
- **Server state:** TanStack Query only, through hooks in `hooks/`. Defaults live in `lib/query-client.ts`.
- **i18n:** every user-facing string goes through `react-i18next` (`en` and `pt` locales). Shared text is in the `common` namespace; a component/route uses its own namespace. The language comes from a cookie read in `app/layout.tsx` and each request gets its own i18n instance (ADR 0005). Props that become display text take already-translated strings.
- **Styling:** Tailwind CSS 4 utilities; design tokens in `src/styles/global/index.css` under `@theme`. UI primitives are shadcn/ui, in `components/ui/<Name>/` (folder-per-module). `cn()` from `@Libs/utils` is used by shadcn code; elsewhere prefer `classnames`. No CSS-in-JS.

## Conventions

- **Folder-per-module + naming + props + forms + i18n + imports:** read `.claude/skills/frontend-conventions.md` before adding anything under `src/`.
- **Imports:** PascalCase aliases defined once in `tsconfig.json`. `../` imports are a lint error (`noRestrictedImports`); `./` only for a module's own siblings. Biome enforces import order, sorted object keys and JSX props. A new alias also has to be added to the Biome import groups.
- **No `export *`:** `index.ts` files use explicit named exports (`performance.noReExportAll` is `error`).
- **Formatter/linter:** Biome. 2-space indent, 100 line width, single quotes, semicolons. Config in `biome.json`.
- **Testing:** read `.claude/skills/testing.md` before writing tests. Unit/component tests are `*.spec.ts(x)` co-located with the module (Vitest + Testing Library); router tests call `serverCaller()` in-process. e2e specs are in `e2e/` and run against the real in-memory backend (no mocking).
- **Playwright cannot launch inside a Claude Code sandbox session** — `yarn playwright test --list` works (proves specs resolve and typecheck), but an actual run fails at the `webServer` step (can't bind a local port). Never claim e2e tests pass without having run them in a real terminal or CI.
- **Commits:** conventional commits (`commitlint`); use `yarn commit`. Husky runs lint-staged (Biome + related tests) on commit. If hooks don't fire after a fresh clone, run `yarn install` (the `prepare` script runs `husky`).

## Environment

All optional, documented in `.env.example` (copy to `.env.local`, which is git-ignored):

- `SEED_TASKS=true` (or `yarn dev:seed`) starts the in-memory store with 25 sample tasks. By default the store is empty. Tests never rely on it: unit and e2e tests create the data they need.
- `E2E_PORT` (default 3000) is the port Playwright's server and base URL use. `playwright.config.ts` loads `.env*` files itself via `@next/env`.

## CI

`.github/workflows/ci.yml` runs on every pull request: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn build`, then `yarn e2e` with Chromium. Run the same four locally before pushing (`yarn lint && yarn typecheck && yarn test && yarn build`).

## Skills (`.claude/skills/`)

| Skill                  | Load when                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `frontend-conventions` | creating or restructuring a component, hook, api or schema module; choosing a folder; reviewing convention compliance |
| `testing`              | writing or changing a test or a story; deciding unit vs e2e                                                           |
| `adr`                  | making or changing an architectural decision (library, data flow, rendering strategy)                                 |
