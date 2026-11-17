import { expect, test } from '@playwright/test';

import { createTask, deleteTask, openList, taskCard, uniqueTitle } from './support/tasks';

test.describe('edit a task', () => {
  test('opens from the list with the current values and saves the changes', async ({
    page,
    request,
  }) => {
    const title = uniqueTitle('Edit');
    const edited = `${title} (edited)`;
    await createTask(request, title, 'Original description');

    await openList(page, title);
    await taskCard(page, title).getByRole('link', { name: 'Edit' }).click();

    await expect(page.getByLabel('Title')).toHaveValue(title);
    await expect(page.getByLabel('Description (optional)')).toHaveValue('Original description');

    await page.getByLabel('Title').fill(edited);
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('Task updated.')).toBeVisible();
    await expect(page).toHaveURL('/');

    await openList(page, edited);
    await expect(taskCard(page, edited)).toBeVisible();
  });

  test('does not save an empty title', async ({ page, request }) => {
    const task = await createTask(request, uniqueTitle('Edit empty'));

    await page.goto(`/tasks/${task.id}/edit`);
    await page.getByLabel('Title').fill('');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('The title is required.')).toBeVisible();
    await expect(page).toHaveURL(/\/edit$/);
  });

  test('an unknown task id shows the 404 page', async ({ page }) => {
    await page.goto('/tasks/does-not-exist/edit');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
    await page.getByRole('link', { name: 'Back to tasks' }).click();
    await expect(page).toHaveURL('/');
  });

  test('saving a task that was deleted meanwhile shows an error and stays on the form', async ({
    page,
    request,
  }) => {
    const task = await createTask(request, uniqueTitle('Edit gone'));

    await page.goto(`/tasks/${task.id}/edit`);
    await deleteTask(request, task.id);
    await page.getByLabel('Title').fill('Too late');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('This task no longer exists.')).toBeVisible();
    await expect(page).toHaveURL(/\/edit$/);
  });
});
