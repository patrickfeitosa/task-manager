import type { TaskList } from '@Schemas/task';

// The server may render several pages at once (`?page=3` -> 30 items). Split them back into
// regular pages so useInfiniteQuery's cursors line up with what the client would have fetched.
export const splitIntoPages = (initial: TaskList, size: number) => {
  const chunks = Math.max(1, Math.ceil(initial.items.length / size));
  const pages: TaskList[] = Array.from({ length: chunks }, (_, index) => ({
    items: initial.items.slice(index * size, (index + 1) * size),
    nextCursor: index < chunks - 1 ? (index + 1) * size : initial.nextCursor,
  }));
  const pageParams = pages.map((_, index) => (index === 0 ? null : index * size));

  return { pageParams, pages };
};
