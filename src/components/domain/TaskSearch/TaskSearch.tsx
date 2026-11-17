'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter } from 'next/navigation';

import classNames from 'classnames';
import { Search, X } from 'lucide-react';

import { Button } from '@Ui/Button';
import { Input } from '@Ui/Input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@Ui/Tooltip';

import { buildListUrl } from '@Libs/list-url';

import type { TaskSearchProps } from './TaskSearch.types';

const DEBOUNCE_MS = 300;

export const TaskSearch = (props: TaskSearchProps) => {
  const { disabled = false, q } = props;
  const { t } = useTranslation('tasks');
  const router = useRouter();
  const [value, setValue] = useState(q);
  const lastSent = useRef(q);

  // The search term lives in the URL (`?q=`): typing updates it after a short pause, which makes
  // the server render the filtered first page. Searching resets the page position.
  useEffect(() => {
    if (value.trim() === lastSent.current) {
      return;
    }

    const timer = setTimeout(() => {
      lastSent.current = value.trim();
      router.replace(buildListUrl({ q: value }), { scroll: false });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [router, value]);

  const field = (
    // A disabled input swallows mouse events and its own cursor style (shadcn sets
    // pointer-events-none), so the not-allowed cursor and the tooltip live on this wrapper.
    <div className={classNames('relative', { 'cursor-not-allowed': disabled })}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label={t('list.search')}
        className="px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('list.search')}
        type="search"
        value={value}
      />
      {/* Our own clear button; the browser's native one is hidden above so there is only one. */}
      {value && !disabled ? (
        <Button
          aria-label={t('list.clearSearch')}
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={() => setValue('')}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X />
        </Button>
      ) : null}
    </div>
  );

  if (!disabled) {
    return field;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{field}</TooltipTrigger>
      <TooltipContent>{t('list.searchDisabled')}</TooltipContent>
    </Tooltip>
  );
};
