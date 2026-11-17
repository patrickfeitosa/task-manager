---

title: Testing (Vitest, Playwright, Storybook)
description: How tests and stories are written in this repo — Vitest + Testing Library component tests, in-process tRPC router tests, renderWithProviders, i18n in tests, Playwright e2e against the real in-memory backend, Storybook conventions, and what each layer covers. Load when writing or changing a *.spec.ts(x) test, an e2e spec, or a *.stories.tsx file, or when deciding which layer should cover something.
---

# Testing

| Layer            | Location                                       | Tool                             | Covers                                                                             |
| ---------------- | ---------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| Router / backend | `src/server/**/*.spec.ts`                      | Vitest + `serverCaller()`        | tRPC procedures, validation, NOT_FOUND/BAD_REQUEST, pagination                     |
| Schemas / lib    | `src/api/schemas/**`, `src/lib/**` `*.spec.ts` | Vitest                           | Zod rules, pure helpers                                                            |
| Component        | `src/components/**/*.spec.tsx`                 | Vitest + Testing Library (jsdom) | Rendering, form validation, user interaction                                       |
| Visual / docs    | `src/components/**/*.stories.tsx`              | Storybook                        | Component states in isolation                                                      |
| E2E              | `e2e/*.spec.ts`                                | Playwright                       | SSR output, infinite scroll, create/edit/delete flows, search, 404, theme/language |

## Rules

- Vitest globals are off: import `describe`, `it`, `expect`, `vi` from `vitest`. `src/test/setup.ts` loads jest-dom matchers and i18n (English) and cleans up after each test.
- **Router tests call the router in-process** with `serverCaller()` from `@Server/caller`. No HTTP, no mocking. The in-memory store is shared per test file, so create your own tasks instead of relying on counts.
- **Component tests mock the hooks, not the network**: `vi.mock('@Hooks/useDeleteTask', ...)`. Also mock `next/navigation` when a component uses the router. Use `renderWithProviders` from `@Test/render` (fresh `QueryClient`, `retry: false`).
- Assert on the English text; i18n is initialised with `en`.
- **E2E runs against the real app and in-memory backend**, so no API mocking. Use unique titles per test (the store is shared across tests and workers) and never assume the list is empty.
- Async Server Components can't be rendered by Testing Library: cover them with Playwright. Playwright cannot run inside a Claude Code sandbox (`playwright test --list` works); run it in a real terminal or CI and never claim it passed otherwise.
- Stories: `Meta<typeof X>` / `StoryObj<typeof X>`, `tags: ['autodocs']`. Components that use tRPC hooks need the `TRPCProvider` decorator (see `TaskItem.stories.tsx`); prefer presentational stories.
- Coverage excludes stories, `*.types.ts`, `src/app/**`, `src/test/**`, `src/types/**`, `src/styles/**`.

## E2E layout

One spec file per feature area (`task-list`, `task-create`, `task-edit`, `task-delete`, `task-search`, `api`, `preferences`), with shared helpers in `e2e/support/tasks.ts`.

- **Independent tests.** Each test creates what it needs through the tRPC API (`createTask`) with `uniqueTitle(...)`, and opens the list filtered by that title (`openList`, `taskCard`). The store is shared and other tests run in parallel, so never assume the list is empty or that a new task is on the first page.
- **Use the UI for the flow under test, the API for setup.** E.g. the delete spec creates the task by API and then deletes it through the UI.
- **Cover error paths too:** a task deleted behind the page's back, a missing title, an unknown id.
- **Many tasks needed?** `createManyTasks` in a `test.beforeAll` (the test-scoped `request` fixture is not available there).
- **New area:** add `e2e/<area>.spec.ts`; import helpers from `./support/tasks`.
