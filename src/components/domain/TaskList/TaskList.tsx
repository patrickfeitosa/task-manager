'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Link from 'next/link';

import { ClipboardList, Plus, SearchX } from 'lucide-react';

import { TaskCardSkeleton } from '@Domain/TaskCardSkeleton';
import { TaskItem } from '@Domain/TaskItem';
import { TaskSearch } from '@Domain/TaskSearch';
import { Button } from '@Ui/Button';
import { EmptyState } from '@Ui/EmptyState';

import { useTasks } from '@Hooks/useTasks';
import { buildListUrl } from '@Libs/list-url';

import type { TaskListProps } from './TaskList.types';

export const TaskList = (props: TaskListProps) => {
  const { initialPage, q } = props;
  const { t } = useTranslation('tasks');
  const { data, fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage } = useTasks({
    initialPage,
    q,
  });
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pagesLoaded = data.pages.length;

  // Keep `?page=N` in sync with how many pages are loaded, so reloading or sharing the URL
  // restores the scroll depth.
  useEffect(() => {
    const url = buildListUrl({ page: pagesLoaded, q });

    if (url === `${window.location.pathname}${window.location.search}`) {
      return;
    }

    // Next patches history.replaceState: given a URL it dispatches a router "restore", which
    // re-requests this dynamic page from the server, can flash loading.tsx and remount this list,
    // re-running this effect in a loop. Passing Next's own history state (it carries `__NA`) makes
    // the patch hand the call straight to the browser: just the address bar changes.
    const state = window.history.state;

    if (state?.__NA) {
      window.history.replaceState(state, '', url);
    }
  }, [pagesLoaded, q]);

  // Infinite scroll: when the sentinel at the bottom enters the viewport, load the next page.
  // After a failed page load we stop auto-fetching (the user retries) to avoid a request loop.
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasNextPage || isFetchNextPageError) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage]);

  const tasks = data.pages.flatMap((page) => page.items);

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('list.title')}</h1>

      {/* Disabled only when no task exists at all; with an active search that found nothing it must
          stay usable so the term can be changed. */}
      <TaskSearch disabled={tasks.length === 0 && !q} q={q} />

      {tasks.length === 0 ? (
        q ? (
          <EmptyState
            action={
              <Button asChild variant="outline">
                <Link href="/">{t('list.clearSearch')}</Link>
              </Button>
            }
            description={t('list.noResultsDescription')}
            icon={<SearchX />}
            title={t('list.noResults', { q })}
          />
        ) : (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/tasks/new">
                  <Plus />
                  {t('list.new')}
                </Link>
              </Button>
            }
            description={t('empty.description')}
            icon={<ClipboardList />}
            title={t('empty.title')}
          />
        )
      ) : null}

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem task={task} />
          </li>
        ))}
      </ul>

      {isFetchingNextPage ? (
        <div aria-label={t('list.loadingMore')} className="flex flex-col gap-3" role="status">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : null}

      {isFetchNextPageError ? (
        <div className="flex items-center gap-2" role="alert">
          <p className="text-sm text-destructive">{t('list.loadMoreError')}</p>
          <Button onClick={() => fetchNextPage()} size="sm" variant="outline">
            {t('list.retry')}
          </Button>
        </div>
      ) : null}

      {hasNextPage ? (
        <div data-testid="scroll-sentinel" ref={sentinelRef} />
      ) : tasks.length > 0 ? (
        <p className="text-center text-sm text-muted-foreground">{t('endOfList')}</p>
      ) : null}
    </section>
  );
};
