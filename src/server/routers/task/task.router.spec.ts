import { beforeAll, describe, expect, it } from 'vitest';

import { serverCaller } from '@Server/caller';

// Exercises the real router in-process (no HTTP) against the in-memory store.
describe('taskRouter', () => {
  // The store starts empty, so create what the pagination tests need.
  beforeAll(async () => {
    for (let index = 0; index < 30; index++) {
      await serverCaller().task.create({ titulo: `Seed ${index}` });
    }
  });

  it('creates a task with id and creation date', async () => {
    const task = await serverCaller().task.create({ descricao: 'details', titulo: 'Write tests' });

    expect(task).toMatchObject({ descricao: 'details', titulo: 'Write tests' });
    expect(task.id).toBeTruthy();
    expect(Number.isNaN(Date.parse(task.dataCriacao))).toBe(false);
  });

  it('rejects a task without a title', async () => {
    await expect(serverCaller().task.create({ titulo: '' })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    });
    await expect(serverCaller().task.create({ titulo: '   ' })).rejects.toMatchObject({
      code: 'BAD_REQUEST',
    });
  });

  it('updates and deletes an existing task', async () => {
    const caller = serverCaller();
    const { id } = await caller.task.create({ titulo: 'Before' });

    const updated = await caller.task.update({ id, titulo: 'After' });
    expect(updated.titulo).toBe('After');
    expect((await caller.task.byId({ id })).titulo).toBe('After');

    await caller.task.delete({ id });
    await expect(caller.task.byId({ id })).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('returns NOT_FOUND when updating or deleting an unknown task', async () => {
    const caller = serverCaller();

    await expect(caller.task.update({ id: 'nope', titulo: 'x' })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    await expect(caller.task.delete({ id: 'nope' })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('paginates with a cursor until the end of the list', async () => {
    const caller = serverCaller();
    const first = await caller.task.list({ limit: 10 });

    expect(first.items).toHaveLength(10);
    expect(first.nextCursor).toBe(10);

    let cursor: number | null = first.nextCursor;
    let seen = first.items.length;

    while (cursor !== null) {
      const page = await caller.task.list({ cursor, limit: 10 });
      seen += page.items.length;
      cursor = page.nextCursor;
    }

    expect(seen).toBeGreaterThanOrEqual(25);
  });

  it('filters by search term (title or description, case-insensitive)', async () => {
    const caller = serverCaller();
    const marker = `needle${Date.now()}`;
    await caller.task.create({ titulo: `Has ${marker.toUpperCase()} in title` });
    await caller.task.create({ descricao: `and ${marker} here`, titulo: 'Other' });
    await caller.task.create({ titulo: 'Unrelated' });

    const result = await caller.task.list({ limit: 10, q: marker });

    expect(result.items).toHaveLength(2);
    expect(result.nextCursor).toBeNull();
  });

  it('can return several pages at once (used by ?page=N)', async () => {
    expect((await serverCaller().task.list({ limit: 30 })).items).toHaveLength(30);
  });
});
