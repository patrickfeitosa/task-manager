# 0002. SSR list with infinite scroll and URL state

- Status: Accepted
- Date: 2026-11-16

## Context

The list page must be server-side rendered, and infinite scroll is a bonus. The store changes at runtime. Infinite scroll alone loses its position on reload, back navigation or a shared link, and we also wanted search.

## Decision

- `app/page.tsx` is an async Server Component with `dynamic = 'force-dynamic'` (otherwise it would be prerendered at build time with stale data). It fetches the first page through the in-process caller and passes it to the client `TaskList`, which seeds `useInfiniteQuery` with it as `initialData`. More pages load through tRPC with an offset cursor when an IntersectionObserver sentinel becomes visible.
- The list state lives in the URL: `?q=<term>` for search and `?page=N` for how many pages are loaded. The page parses it with `app/search-schema` (Zod `.catch`, so bad values fall back to defaults) and renders N pages at once (`limit = N * 10`, capped at 20 pages). `useTasks` splits that result back into regular pages so cursors stay aligned.
- `TaskList` updates `?page=` with `history.replaceState`. Next patches that function and, given a URL, dispatches a router restore that re-requests the dynamic page, which can remount the list and loop. So the call is skipped when the URL is already right, and otherwise passes Next's own history state (`__NA`) so the patch hands it straight to the browser.
- Typing in `TaskSearch` updates `?q=` (debounced `router.replace`); the list remounts through `key={q}` and the page position resets. The term is part of the query key. Mutations invalidate the list, and the form calls `router.refresh()` so the SSR output is fresh.

## Consequences

- The first paint contains real tasks, and reload, back/forward and shared links restore the scroll depth and search.
- A deep link like `?page=20` renders up to 200 items in one response; the cap bounds it.
- Offset cursors can skip or repeat items if tasks change between page loads. A keyset cursor would be the fix with a real database.
