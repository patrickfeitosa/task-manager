import { expect, test } from '@playwright/test';

import { openList, taskCard, uniqueTitle } from './support/tasks';

test.describe('create a task', () => {
  test('does not submit without a title and shows the validation error', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('The title is required.')).toBeVisible();
    await expect(page).toHaveURL(/\/tasks\/new$/);
  });

  test('treats a title with only spaces as empty', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.getByLabel('Title').fill('   ');
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('The title is required.')).toBeVisible();
  });

  test('creates a task with title and description and goes back to the list', async ({ page }) => {
    const title = uniqueTitle('Create');

    await page.goto('/tasks/new');
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('Description (optional)').fill('Some details');
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('Task created.')).toBeVisible();
    await expect(page).toHaveURL('/');

    await openList(page, title);
    await expect(taskCard(page, title)).toContainText('Some details');
  });

  test('the cancel button returns to the list without creating anything', async ({ page }) => {
    await page.goto('/tasks/new');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL('/');
  });
});
