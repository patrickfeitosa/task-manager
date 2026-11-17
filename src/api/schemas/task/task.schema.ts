import { z } from 'zod';

// Single source of truth for a task: the tRPC router validates with it and the form reuses it
// through zodResolver (ADR 0003). Messages are i18n keys (namespace `tasks`), not display text.
export const TITLE_MAX_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 500;
export const SEARCH_MAX_LENGTH = 100;
export const TASKS_PAGE_SIZE = 10;
// Upper bound for `?page=N` (N pages are loaded at once on the server), so a URL can't ask for
// the whole store in one request.
export const TASKS_MAX_PAGES = 20;

export const taskInputSchema = z.object({
  descricao: z.string().trim().max(DESCRIPTION_MAX_LENGTH, 'descriptionTooLong').optional(),
  titulo: z.string().trim().min(1, 'titleRequired').max(TITLE_MAX_LENGTH, 'titleTooLong'),
});

export const taskSchema = taskInputSchema.extend({
  // ISO string so the value crosses server -> client component props without a transformer.
  dataCriacao: z.string(),
  id: z.string(),
});

export const taskListSchema = z.object({
  items: z.array(taskSchema),
  nextCursor: z.number().nullable(),
});

export const taskListInputSchema = z.object({
  cursor: z.number().int().min(0).nullish(),
  limit: z
    .number()
    .int()
    .min(1)
    .max(TASKS_PAGE_SIZE * TASKS_MAX_PAGES)
    .default(TASKS_PAGE_SIZE),
  // Case-insensitive match on title and description.
  q: z.string().trim().max(SEARCH_MAX_LENGTH).optional(),
});
