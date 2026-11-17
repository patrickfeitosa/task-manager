import { TASKS_MAX_PAGES } from '@Schemas/task';

type ListUrlParams = { page?: number; q?: string };

// URL of the task list for a search term and the number of pages loaded. Defaults are omitted
// so the canonical list URL is just "/".
export const buildListUrl = (params: ListUrlParams) => {
  const { page = 1, q = '' } = params;
  const search = new URLSearchParams();

  if (q.trim()) {
    search.set('q', q.trim());
  }

  if (page > 1) {
    search.set('page', String(Math.min(page, TASKS_MAX_PAGES)));
  }

  const query = search.toString();

  return query ? `/?${query}` : '/';
};
