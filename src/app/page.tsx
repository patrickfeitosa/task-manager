import { TASKS_PAGE_SIZE } from '@Schemas/task';
import { serverCaller } from '@Server/caller';

import { TaskList } from '@Domain/TaskList';

import { homeSearchSchema } from './search-schema';

// The task store is in memory and changes at runtime, so this page must never be prerendered
// at build time.
export const dynamic = 'force-dynamic';

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// SSR (case requirement): the first page(s) are fetched on the server by calling the router
// in-process and handed to the client list, which continues with infinite scroll (ADR 0002).
// `?page=N` renders N pages at once so the scroll position survives a reload; `?q=` filters.
const Home = async (props: HomeProps) => {
  const { page, q } = homeSearchSchema.parse(await props.searchParams);
  const initialPage = await serverCaller().task.list({
    limit: page * TASKS_PAGE_SIZE,
    q: q || undefined,
  });

  // `key` resets the client list (and its history sync) whenever the search term changes.
  return <TaskList initialPage={initialPage} key={q} q={q} />;
};

export default Home;
