import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@Test/render';

import { TaskSearch } from './TaskSearch';

const replace = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));

describe('TaskSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replace.mockClear();
  });
  afterEach(() => vi.useRealTimers());

  it('updates the URL after the debounce', () => {
    renderWithProviders(<TaskSearch q="" />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'milk' } });
    expect(replace).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenCalledWith('/?q=milk', { scroll: false });
  });

  it('clears the search', () => {
    renderWithProviders(<TaskSearch q="milk" />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    act(() => vi.advanceTimersByTime(300));

    expect(replace).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('can be disabled (no tasks to search)', () => {
    renderWithProviders(<TaskSearch disabled q="" />);

    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  it('shows the not-allowed cursor and explains why on hover when disabled', async () => {
    vi.useRealTimers();
    renderWithProviders(<TaskSearch disabled q="" />);

    const wrapper = screen.getByRole('searchbox').parentElement as HTMLElement;
    expect(wrapper).toHaveClass('cursor-not-allowed');

    await userEvent.hover(wrapper);

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Create a task to enable search');
  });

  it('has no tooltip or not-allowed cursor when enabled', () => {
    renderWithProviders(<TaskSearch q="" />);

    expect(screen.getByRole('searchbox').parentElement).not.toHaveClass('cursor-not-allowed');
  });

  it('shows a single clear button (the native one is hidden by CSS)', () => {
    renderWithProviders(<TaskSearch q="milk" />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
