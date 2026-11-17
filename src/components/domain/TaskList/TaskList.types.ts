import type { TaskList as TaskListData } from '@Schemas/task';

export type TaskListProps = {
  // First page(s), fetched on the server (SSR). `?page=3` makes this 3 pages worth of items.
  initialPage: TaskListData;
  // Search term from the URL (`?q=`).
  q: string;
};
