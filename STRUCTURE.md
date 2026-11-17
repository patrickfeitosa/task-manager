# Folder Structure

Next.js 16 (App Router) + React 19.2 + TypeScript. tRPC 11, TanStack Query, Zod, shadcn/ui (Radix + Tailwind CSS 4), `react-hook-form`, `react-i18next`.
Tests: Vitest + Testing Library, Playwright (e2e), Storybook 10. Lint/format: Biome. Detailed rules: `.claude/skills/frontend-conventions.md`. Decisions: [`docs/adr/`](docs/adr/README.md).

## Top level

```
.
├── package.json          # Scripts: dev, build, start, test, e2e, lint, typecheck, storybook, commit
├── components.json       # shadcn/ui config (style, CSS file, aliases)
├── Dockerfile            # Optional: two-stage build, `next start` (see docker-compose.yml)
├── docker-compose.yml    # Optional: one service on port 3000 (in-memory store, do not scale)
├── .env.example          # Optional env vars: SEED_TASKS, E2E_PORT (copy to .env.local)
├── next.config.js        # Empty on purpose: the backend is the tRPC route handler
├── tsconfig.json         # Single tsconfig: `next` plugin, baseUrl ".", path aliases (source of truth)
├── vitest.config.ts      # jsdom, src/test/setup.ts, vite-tsconfig-paths reads the aliases
├── playwright.config.ts  # webServer (yarn dev / yarn start in CI), baseURL, Chromium
├── biome.json            # Lint + format + import order + sorted keys/props, ../ ban
├── docs/adr/             # Architecture Decision Records (see the `adr` skill)
├── .storybook/           # main.ts, preview.tsx
├── .husky/ .lintstagedrc.js .commitlintrc.js   # Git hooks, conventional commits
├── .github/workflows/    # ci.yml: lint, typecheck, test, build, e2e on pull_request
├── .claude/skills/       # Contributor/agent conventions
├── e2e/                  # Playwright specs, one file per area (see below); real in-memory backend
└── src/                  # Application code
```

## `e2e/` — Playwright (real browser)

```
e2e/
├── task-list.spec.ts     # SSR output, infinite scroll, ?page=N
├── task-create.spec.ts   # validation, creating, cancelling
├── task-edit.spec.ts     # editing, 404, saving a task deleted meanwhile
├── task-delete.spec.ts   # confirmation, cancel, undo, already-deleted error
├── task-search.spec.ts   # ?q filtering, no results, clearing
├── api.spec.ts           # tRPC contract: BAD_REQUEST / NOT_FOUND
├── preferences.spec.ts   # theme and language (persistence, hydration)
└── support/tasks.ts      # createTask / deleteTask / createManyTasks / openList / taskCard
```

One file per feature area. Every test creates its own data through the API with a unique title and finds it by searching for that title, so tests stay independent and can run in parallel. Playwright cannot launch inside a Claude Code sandbox; run it in a real terminal or CI.

## `src/`

| Path                        | Purpose                                                                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                      | Routing only: `/` (SSR list; `search-schema/` parses `?q` and `?page`), `/tasks/new`, `/tasks/[id]/edit`, `api/trpc/[trpc]/route.ts` (tRPC HTTP handler)                                             |
| `server/`                   | Backend. `trpc/` (init), `store/` (in-memory data), `routers/<resource>/`, `routers/app/` (root), `caller/`                                                                                          |
| `api/trpc/`                 | Typed tRPC client (`createClient`) and `TRPCProvider`/`useTRPC`                                                                                                                                      |
| `api/schemas/<resource>/`   | Zod schemas + inferred types, shared by server input validation and forms                                                                                                                            |
| `components/ui/<Name>/`     | shadcn/ui primitives (Button, Card, AlertDialog, ...) and generic `EmptyState`                                                                                                                       |
| `components/domain/<Name>/` | App-aware components: `AppHeader`, `ThemeToggle`, `LanguageSwitcher`, `TaskList`, `TaskItem`, `TaskForm`, `TaskSearch`, `TaskCardSkeleton`                                                           |
| `hooks/<useThing>/`         | TanStack Query wrappers over the tRPC client (`useTasks`, `useCreateTask`, ...)                                                                                                                      |
| `i18n/`                     | i18next init and `locales/<lang>/{common,tasks}.json`                                                                                                                                                |
| `lib/`                      | Pure helpers, one folder per module (`format-date/`, `language/`, `list-url/`, `query-client/`, `theme-script/`, `trpc-error/`, `utils/` with `cn` for shadcn), each with its spec and an `index.ts` |
| `styles/global/index.css`   | Tailwind + shadcn theme tokens                                                                                                                                                                       |
| `test/`                     | `setup.ts` (jest-dom, i18n), `render.tsx` (`renderWithProviders`)                                                                                                                                    |

## Layer responsibilities

| Layer               | Owns                                         | May depend on                |
| ------------------- | -------------------------------------------- | ---------------------------- |
| `lib/`              | Pure functions, no React                     | nothing in `src/`            |
| `api/schemas/`      | Zod schemas and types                        | nothing in `src/`            |
| `server/`           | Routers, in-memory store                     | `api/schemas/`               |
| `api/trpc/`         | Typed client                                 | `server/` (types only)       |
| `hooks/`            | Query/mutation wrappers                      | `api/`, `lib/`               |
| `components/ui`     | Generic presentation                         | `lib/`                       |
| `components/domain` | App-aware presentation                       | `ui`, `hooks`, `lib`, `i18n` |
| `app/`              | Routes, layouts, providers, SSR data loading | everything above             |

Data flows one way: `server` → (tRPC) → `hooks` → components/pages. Server Components may call `server/caller` directly (in-process, no HTTP). Client code never imports server code, only the `AppRouter` type.

## Path aliases (`tsconfig.json`)

`@Api`, `@Schemas`, `@Server`, `@Ui`, `@Domain`, `@Components`, `@Hooks`, `@Libs`, `@I18n`, `@Styles`, `@Test`, `@Types`, `@/`. `../` imports are a lint error.
