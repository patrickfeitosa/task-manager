import { useInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '@Api/trpc';
import { TASKS_PAGE_SIZE, type TaskList } from '@Schemas/task';

import { splitIntoPages } from './useTasks.helpers';

type UseTasksOptions = {
  // First page(s) rendered on the server (SSR), used to seed the cache so there is no loading flash.
  initialPage: TaskList;
  // Search term; part of the query key, so each search has its own cache entry.
  q?: string;
};

export const useTasks = (props: UseTasksOptions) => {
  const { initialPage, q } = props;
  const trpc = useTRPC();

  return useInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(
      { limit: TASKS_PAGE_SIZE, q: q || undefined },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: splitIntoPages(initialPage, TASKS_PAGE_SIZE),
      },
    ),
  );
};
