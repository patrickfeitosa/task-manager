import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@Test/render';

import { TaskForm } from './TaskForm';

const push = vi.fn();
const createMutateAsync = vi.fn();
const updateMutateAsync = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));
vi.mock('@Hooks/useCreateTask', () => ({
  useCreateTask: () => ({ isPending: false, mutateAsync: createMutateAsync }),
}));
vi.mock('@Hooks/useUpdateTask', () => ({
  useUpdateTask: () => ({ isPending: false, mutateAsync: updateMutateAsync }),
}));

describe('TaskForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('blocks submit and shows an error when the title is empty', async () => {
    renderWithProviders(<TaskForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Create task' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The title is required.');
    expect(createMutateAsync).not.toHaveBeenCalled();
  });

  it('creates a task and goes back to the list', async () => {
    createMutateAsync.mockResolvedValue({});
    renderWithProviders(<TaskForm />);

    await userEvent.type(screen.getByLabelText('Title'), 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: 'Create task' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(createMutateAsync).toHaveBeenCalledWith({ descricao: '', titulo: 'Buy milk' });
  });

  it('updates the task when editing', async () => {
    updateMutateAsync.mockResolvedValue({});
    renderWithProviders(
      <TaskForm
        task={{
          dataCriacao: '2025-01-01T00:00:00.000Z',
          id: 't1',
          titulo: 'Old',
        }}
      />,
    );

    await userEvent.clear(screen.getByLabelText('Title'));
    await userEvent.type(screen.getByLabelText('Title'), 'New');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(updateMutateAsync).toHaveBeenCalledWith({ descricao: '', id: 't1', titulo: 'New' }),
    );
  });
});
