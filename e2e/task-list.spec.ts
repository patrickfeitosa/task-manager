import { expect, test } from '@playwright/test';

import { createManyTasks } from './support/tasks';

test.describe('task list', () => {
  test.beforeAll(async ({ playwright }, testInfo) => {
    await createManyTasks(playwright, testInfo.project.use.baseURL, 25, 'List task');
  });

  test('is server-rendered: the HTML already contains the tasks', async ({ request }) => {
    const html = await (await request.get('/')).text();

    expect(html).toContain('data-testid="task-item"');
    expect(html).toContain('List task');
  });

  test('shows 10 tasks first and loads more when scrolling (infinite scroll)', async ({ page }) => {
    await page.goto('/');
    const items = page.getByTestId('task-item');

    await expect(items).toHaveCount(10);
    await page.getByTestId('scroll-sentinel').scrollIntoViewIfNeeded();
    await expect(items).not.toHaveCount(10);
  });

  test('?page=N is rendered on the server with N pages of tasks', async ({ request }) => {
    const html = await (await request.get('/?page=2')).text();

    expect(html.match(/data-testid="task-item"/g)).toHaveLength(20);
  });

  test('the URL follows the scroll depth and survives a reload', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('scroll-sentinel').scrollIntoViewIfNeeded();
    await expect(page).toHaveURL(/page=2/);

    await page.reload();

    await expect(page.getByTestId('task-item')).toHaveCount(20);
  });

  test('an invalid ?page falls back to the first page instead of failing', async ({ page }) => {
    await page.goto('/?page=abc');

    await expect(page.getByTestId('task-item')).toHaveCount(10);
  });
});
