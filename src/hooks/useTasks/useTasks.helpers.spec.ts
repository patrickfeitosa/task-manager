import { describe, expect, it } from 'vitest';

import type { Task } from '@Schemas/task';

import { splitIntoPages } from './useTasks.helpers';

const items = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: String(index) }) as Task);

describe('splitIntoPages', () => {
  it('keeps a single page as is', () => {
    const result = splitIntoPages({ items: items(10), nextCursor: 10 }, 10);

    expect(result.pages).toHaveLength(1);
    expect(result.pageParams).toEqual([null]);
    expect(result.pages[0]?.nextCursor).toBe(10);
  });

  it('splits several pages with aligned cursors', () => {
    const result = splitIntoPages({ items: items(25), nextCursor: null }, 10);

    expect(result.pages.map((page) => page.items.length)).toEqual([10, 10, 5]);
    expect(result.pages.map((page) => page.nextCursor)).toEqual([10, 20, null]);
    expect(result.pageParams).toEqual([null, 10, 20]);
  });

  it('returns one empty page when there are no items', () => {
    const result = splitIntoPages({ items: [], nextCursor: null }, 10);

    expect(result.pages).toEqual([{ items: [], nextCursor: null }]);
  });
});
