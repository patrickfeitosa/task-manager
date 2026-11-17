import { useCallback, useSyncExternalStore } from 'react';

import { THEME_STORAGE_KEY } from '@Libs/theme-script';

export type Theme = 'dark' | 'light';

// The source of truth is the `dark` class on <html>; we subscribe to it instead of keeping React
// state, so the init script, the toggle and the toaster always agree.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, { attributeFilter: ['class'], attributes: true });

  return () => observer.disconnect();
};

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

// Server and hydration render with "light"; the real value is applied right after hydration.
const getServerSnapshot = (): Theme => 'light';

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, []);

  return { setTheme, theme };
};
