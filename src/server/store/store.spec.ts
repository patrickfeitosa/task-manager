import { afterEach, describe, expect, it } from 'vitest';

import { SEED_COUNT } from './seed';
import { listTasks } from './store';

const globalForStore = globalThis as unknown as { taskStore?: unknown };

describe('store initial state', () => {
  afterEach(() => {
    delete process.env.SEED_TASKS;
    globalForStore.taskStore = undefined;
  });

  it('starts empty by default', () => {
    globalForStore.taskStore = undefined;

    expect(listTasks(0, 10)).toEqual({ items: [], nextCursor: null });
  });

  it('loads demo data when SEED_TASKS=true', () => {
    globalForStore.taskStore = undefined;
    process.env.SEED_TASKS = 'true';

    expect(listTasks(0, 100).items).toHaveLength(SEED_COUNT);
  });
});
