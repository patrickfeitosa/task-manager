import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@Test/render';

import { TaskItem } from './TaskItem';

const deleteMutateAsync = vi.fn();

vi.mock('@Hooks/useDeleteTask', () => ({
  useDeleteTask: () => ({ isPending: false, mutateAsync: deleteMutateAsync }),
}));
vi.mock('@Hooks/useCreateTask', () => ({
  useCreateTask: () => ({ isPending: false, mutateAsync: vi.fn() }),
}));

const task = {
  dataCriacao: '2025-01-01T10:00:00.000Z',
  descricao: 'Some details',
  id: 't1',
  titulo: 'Write README',
};

describe('TaskItem', () => {
  it('renders the task', () => {
    renderWithProviders(<TaskItem task={task} />);

    expect(screen.getByText('Write README')).toBeInTheDocument();
    expect(screen.getByText('Some details')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/tasks/t1/edit');
  });

  it('only deletes after the user confirms', async () => {
    renderWithProviders(<TaskItem task={task} />);

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteMutateAsync).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Delete task' }));
    expect(deleteMutateAsync).toHaveBeenCalledWith({ id: 't1' });
  });
});
