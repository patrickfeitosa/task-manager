import { expect, test } from '@playwright/test';

import { createTask, deleteTask, openList, taskCard, uniqueTitle } from './support/tasks';

test.describe('delete a task', () => {
  test('asks for confirmation, then removes the task and shows a success message', async ({
    page,
    request,
  }) => {
    const title = uniqueTitle('Delete');
    await createTask(request, title);

    await openList(page, title);
    await taskCard(page, title).getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete task' }).click();

    await expect(page.getByText('Task deleted.')).toBeVisible();
    await expect(taskCard(page, title)).toHaveCount(0);
  });

  test('cancelling the confirmation keeps the task', async ({ page, request }) => {
    const title = uniqueTitle('Keep');
    await createTask(request, title);

    await openList(page, title);
    await taskCard(page, title).getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(taskCard(page, title)).toBeVisible();
    await expect(page.getByText('Task deleted.')).toHaveCount(0);
  });

  test('"Undo" in the success message brings the task back', async ({ page, request }) => {
    const title = uniqueTitle('Undo');
    await createTask(request, title);

    await openList(page, title);
    await taskCard(page, title).getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete task' }).click();
    await page.getByRole('button', { name: 'Undo' }).click();

    await expect(page.getByText('Task restored.')).toBeVisible();
    await expect(taskCard(page, title)).toBeVisible();
  });

  test('deleting a task that is already gone shows an error message', async ({ page, request }) => {
    const title = uniqueTitle('Gone');
    const task = await createTask(request, title);

    await openList(page, title);
    // Removed behind the page's back, e.g. from another tab.
    await deleteTask(request, task.id);
    await taskCard(page, title).getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete task' }).click();

    await expect(page.getByText('This task no longer exists.')).toBeVisible();
  });
});
