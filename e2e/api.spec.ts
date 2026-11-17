import { expect, test } from '@playwright/test';

import { createTask, uniqueTitle } from './support/tasks';

// The backend contract, without the UI: meaningful errors for bad input and missing tasks.
test.describe('tRPC API', () => {
  test('rejects a task without a title with BAD_REQUEST', async ({ request }) => {
    const response = await request.post('/api/trpc/task.create', { data: { titulo: '' } });

    expect(response.status()).toBe(400);
    expect((await response.json()).error.data.code).toBe('BAD_REQUEST');
  });

  test('rejects a missing title field', async ({ request }) => {
    const response = await request.post('/api/trpc/task.create', { data: {} });

    expect(response.status()).toBe(400);
  });

  test('returns NOT_FOUND when updating an unknown task', async ({ request }) => {
    const response = await request.post('/api/trpc/task.update', {
      data: { id: 'does-not-exist', titulo: 'x' },
    });

    expect(response.status()).toBe(404);
    expect((await response.json()).error.data.code).toBe('NOT_FOUND');
  });

  test('returns NOT_FOUND when deleting an unknown task', async ({ request }) => {
    const response = await request.post('/api/trpc/task.delete', {
      data: { id: 'does-not-exist' },
    });

    expect(response.status()).toBe(404);
  });

  test('creates a task with id, title and creation date', async ({ request }) => {
    const task = await createTask(request, uniqueTitle('Api'), 'details');

    expect(task).toMatchObject({ descricao: 'details' });
    expect(task.id).toBeTruthy();
  });
});
