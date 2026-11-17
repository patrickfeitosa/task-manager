import {
  type APIRequestContext,
  expect,
  type Page,
  type PlaywrightWorkerArgs,
} from '@playwright/test';

// Helpers shared by the e2e specs. The app starts empty and tests share one in-memory store,
// so every test creates the data it needs through the same tRPC endpoint the UI uses, with a
// unique title, and finds it again by searching for that title.

export type ApiTask = { id: string; titulo: string; descricao?: string };

export const uniqueTitle = (name: string) =>
  `${name} ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const createTask = async (
  request: APIRequestContext,
  titulo: string,
  descricao?: string,
): Promise<ApiTask> => {
  const response = await request.post('/api/trpc/task.create', { data: { descricao, titulo } });

  expect(response.ok()).toBe(true);

  return (await response.json()).result.data;
};

export const deleteTask = (request: APIRequestContext, id: string) =>
  request.post('/api/trpc/task.delete', { data: { id } });

// `request` is test-scoped and cannot be used in beforeAll, so build a context from the
// project's baseURL. Used by specs that need many tasks (pagination).
export const createManyTasks = async (
  playwright: PlaywrightWorkerArgs['playwright'],
  baseURL: string | undefined,
  count: number,
  prefix: string,
) => {
  const api = await playwright.request.newContext({ baseURL });

  for (let index = 0; index < count; index++) {
    await createTask(api, uniqueTitle(`${prefix} ${index}`));
  }

  await api.dispose();
};

// Opens the list filtered by a term. Other tests create tasks concurrently, so a new task is not
// guaranteed to be among the first 10 of the unfiltered list; its unique title always is here.
export const openList = (page: Page, q: string) => page.goto(`/?q=${encodeURIComponent(q)}`);

export const taskCard = (page: Page, title: string) =>
  page.getByTestId('task-item').filter({ hasText: title });
