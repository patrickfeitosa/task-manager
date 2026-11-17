'use client';

import { useTranslation } from 'react-i18next';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@Ui/Button';

import { useTheme } from '@Hooks/useTheme';

export const ThemeToggle = () => {
  const { t } = useTranslation('common');
  const { setTheme, theme } = useTheme();

  return (
    <Button
      aria-label={t('theme.toggle')}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      size="icon"
      variant="ghost"
    >
      {/* Both icons are rendered and swapped with CSS, so server and client markup match. */}
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
};
