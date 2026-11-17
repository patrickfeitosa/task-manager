# Task Manager

A small task manager built for a written case: **Next.js (App Router) + tRPC + shadcn/ui**. The backend keeps tasks in memory and is exposed through tRPC. The list page is server-side rendered and loads more tasks with infinite scroll. All data is fictional.

## Run it

Requirements: Node 22.12+ (`.nvmrc` says 24) and yarn.

```bash
yarn install
yarn dev            # http://localhost:3000 (starts with an empty list)
yarn dev:seed       # same, with 25 sample tasks to try infinite scroll
```

| Task                 | Command                                        |
| -------------------- | ---------------------------------------------- |
| Unit/component tests | `yarn test`                                    |
| E2E tests            | `yarn playwright install chromium && yarn e2e` |
| Lint / typecheck     | `yarn lint` / `yarn typecheck`                 |
| Production build     | `yarn build && yarn start`                     |
| Storybook            | `yarn storybook`                               |
| Docker (optional)    | `docker compose up --build`                    |

No environment variables are required. Copy `.env.example` to `.env.local` to see the optional ones: `SEED_TASKS=true` starts with 25 fictional sample tasks (like `yarn dev:seed`, but in any shell), and `E2E_PORT` changes the port the e2e tests use. Tasks live in memory: restarting the server clears them, and the app starts empty by default.

### Docker (optional)

`docker compose up --build` builds and serves the app on http://localhost:3000 without installing Node. Use `SEED_TASKS=true docker compose up --build` for sample data. It is a single container on purpose: tasks live in that process's memory, so running several replicas would give each its own list. The image build needs internet access (Google Fonts).

## What it does

- `/` — task list, server-rendered, newest first. Infinite scroll loads 10 more at a time. Each task can be edited or deleted (confirmation dialog, success/error toast, and an "Undo" action that re-creates the task).
- **URL state:** `?page=N` records how many pages are loaded (reload or share a link and you land at the same depth; the server renders N pages at once), and `?q=term` is the search. See [ADR 0002](docs/adr/0002-ssr-list-with-url-state.md).
- Header with theme toggle (light/dark/system) and language switch (EN/PT); empty, no-results, 404 and error states; skeletons shaped like the real cards.
- `/tasks/new` and `/tasks/[id]/edit` — form built with react-hook-form. An empty title is blocked in the browser and also rejected by the server. Loading, success and error states are shown.
- Errors: updating or deleting a missing task returns `NOT_FOUND`, an empty title returns `BAD_REQUEST`. The UI shows translated messages (English and Portuguese locales exist).

A task has `id`, `titulo` (required), `descricao` (optional) and `dataCriacao`.

## How it works

```
Browser ──hooks (TanStack Query)──▶ tRPC client ──HTTP /api/trpc──▶ router ──▶ in-memory store
Server Component (page.tsx) ───────────────────in-process caller──▶ router
```

- `src/server/` — tRPC init, routers (`task.list/byId/create/update/delete`) and the store.
- `src/api/schemas/task` — one Zod schema used by the router (`.input()`) and by the form (`zodResolver`).
- `src/hooks/` — thin wrappers over the typed tRPC client.
- `src/components/ui` — shadcn/ui primitives; `src/components/domain` — `TaskList`, `TaskItem`, `TaskForm`.
- The page is `force-dynamic`: the first page of tasks is fetched on the server and handed to the client list as initial data, so the HTML already contains the tasks.

The project follows the conventions in `CLAUDE.md`, `STRUCTURE.md` and `.claude/skills/`. The reasoning behind the main decisions is in [`docs/adr/`](docs/adr/README.md).
