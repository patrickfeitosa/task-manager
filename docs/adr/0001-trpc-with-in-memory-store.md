# 0001. tRPC backend with an in-memory store

- Status: Accepted
- Date: 2026-11-16

## Context

The case asks for a task backend exposed through tRPC, holding data in memory (no database). The boilerplate shipped an axios + MSW data path, which does not fit an end-to-end typed RPC. The case mentions Next.js v15 but also asks for the most recent versions; the boilerplate is on Next 16.

## Decision

- Use tRPC v11 with its TanStack Query integration. Routers live in `src/server/routers`, served over HTTP by `app/api/trpc/[trpc]/route.ts` and callable in-process through `@Server/caller`. The client only imports the `AppRouter` _type_. axios and MSW were removed.
- Tasks are kept in an array on `globalThis`, so the store survives dev hot reloads and is shared by the HTTP handler and the SSR caller.
- The store starts empty, as the case describes. Demo data is opt-in (`SEED_TASKS=true`, `yarn dev:seed`); tests create their own data instead of depending on it.
- Stay on Next 16 (React 19.2). Everything the case needs works the same; the one visible difference is that `params` is a Promise, which the edit page awaits.

## Consequences

- End-to-end types without codegen. Router tests run in-process without mocks, and e2e tests need no API mocking.
- Data is lost on restart and is not shared across serverless instances. Acceptable here; a real deployment needs a database behind `src/server/store`, the only module to change.
