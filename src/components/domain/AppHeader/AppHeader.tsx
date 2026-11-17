'use client';

import { useTranslation } from 'react-i18next';

import Link from 'next/link';

import { CheckSquare, Plus } from 'lucide-react';

import { LanguageSwitcher } from '@Domain/LanguageSwitcher';
import { ThemeToggle } from '@Domain/ThemeToggle';
import { Button } from '@Ui/Button';

export const AppHeader = () => {
  const { t } = useTranslation('common');

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-2 px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <CheckSquare className="size-5" />
          {t('app.name')}
        </Link>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/tasks/new">
              <Plus />
              {t('app.newTask')}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
