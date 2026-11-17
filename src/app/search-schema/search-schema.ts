import { z } from 'zod';

import { SEARCH_MAX_LENGTH, TASKS_MAX_PAGES } from '@Schemas/task';

// `/?q=milk&page=3`. `.catch` turns missing, malformed or repeated params into defaults instead
// of throwing, so a hand-edited URL never produces an error page.
export const homeSearchSchema = z.object({
  // Number of pages loaded (infinite scroll position), so reload / back / shared links restore it.
  page: z.coerce.number().int().min(1).max(TASKS_MAX_PAGES).catch(1),
  q: z.string().trim().max(SEARCH_MAX_LENGTH).catch(''),
});

export type HomeSearch = z.infer<typeof homeSearchSchema>;
