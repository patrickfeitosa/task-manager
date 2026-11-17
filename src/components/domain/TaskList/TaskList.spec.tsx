import { render } from '@testing-library/react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { TaskList as TaskListData } from '@Schemas/task';

import { TaskList } from './TaskList';

const useTasks = vi.hoisted(() => vi.fn());

vi.mock('@Hooks/useTasks', () => ({ useTasks }));
vi.mock('@Domain/TaskSearch', () => ({
  TaskSearch: (props: { disabled?: boolean }) => (
    <input data-testid="search" disabled={props.disabled} />
  ),
}));
vi.mock('@Domain/TaskItem', () => ({ TaskItem: () => null }));

const emptyPage: TaskListData = { items: [], nextCursor: null };

const mockPages = (count: number, page: TaskListData = emptyPage) =>
  useTasks.mockReturnValue({
    data: { pages: Array.from({ length: count }, () => page) },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isFetchNextPageError: false,
  });

describe('TaskList URL sync', () => {
  const NEXT_STATE = { __NA: true };

  beforeEach(() => {
    window.history.replaceState(NEXT_STATE, '', '/');
  });
  afterEach(() => vi.restoreAllMocks());

  it('does not touch the history when the URL is already right (no router restore loop)', () => {
    mockPages(1);
    const replaceState = vi.spyOn(window.history, 'replaceState');

    render(<TaskList initialPage={emptyPage} q="" />);

    expect(replaceState).not.toHaveBeenCalled();
  });

  it('writes ?page=N reusing Next history state so the router is not involved', () => {
    mockPages(2);
    const replaceState = vi.spyOn(window.history, 'replaceState');

    render(<TaskList initialPage={emptyPage} q="" />);

    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(replaceState).toHaveBeenCalledWith(NEXT_STATE, '', '/?page=2');
  });

  it('shows the empty state when there are no tasks', () => {
    mockPages(1);

    const { getByText } = render(<TaskList initialPage={emptyPage} q="" />);

    expect(getByText('No tasks yet')).toBeInTheDocument();
  });
});

describe('TaskList search input', () => {
  const withTask: TaskListData = {
    items: [{ dataCriacao: '2025-01-01T00:00:00.000Z', id: '1', titulo: 'A' }],
    nextCursor: null,
  };

  it('is disabled when there are no tasks at all', () => {
    mockPages(1);

    const { getByTestId } = render(<TaskList initialPage={emptyPage} q="" />);

    expect(getByTestId('search')).toBeDisabled();
  });

  it('stays enabled when a search found nothing', () => {
    mockPages(1);

    const { getByTestId } = render(<TaskList initialPage={emptyPage} q="milk" />);

    expect(getByTestId('search')).toBeEnabled();
  });

  it('is enabled when there are tasks', () => {
    mockPages(1, withTask);

    const { getByTestId } = render(<TaskList initialPage={withTask} q="" />);

    expect(getByTestId('search')).toBeEnabled();
  });
});
