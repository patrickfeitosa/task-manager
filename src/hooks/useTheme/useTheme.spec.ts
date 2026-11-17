import { act, renderHook, waitFor } from '@testing-library/react';

import { afterEach, describe, expect, it } from 'vitest';

import { useTheme } from './useTheme';

describe('useTheme', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('reads the dark class from <html>', () => {
    document.documentElement.classList.add('dark');

    expect(renderHook(() => useTheme()).result.current.theme).toBe('dark');
  });

  it('switches the class, persists the choice and re-renders', async () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');

    act(() => result.current.setTheme('dark'));

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    // MutationObserver notifies asynchronously.
    await waitFor(() => expect(result.current.theme).toBe('dark'));
  });
});
