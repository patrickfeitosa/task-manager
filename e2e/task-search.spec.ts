import { expect, test } from '@playwright/test';

import { createTask, taskCard, uniqueTitle } from './support/tasks';

test.describe('search', () => {
  test('typing filters the list and is tracked in the URL', async ({ page, request }) => {
    const marker = `needle${Date.now()}`;
    await createTask(request, `Find ${marker}`);
    await createTask(request, `Other ${uniqueTitle('task')}`);

    await page.goto('/');
    await page.getByRole('searchbox').fill(marker);

    await expect(page).toHaveURL(new RegExp(`q=${marker}`));
    await expect(page.getByTestId('task-item')).toHaveCount(1);
    await expect(taskCard(page, marker)).toBeVisible();
  });

  test('matches the description too, ignoring case', async ({ page, request }) => {
    const marker = `Haystack${Date.now()}`;
    await createTask(request, uniqueTitle('With description'), `contains ${marker}`);

    await page.goto(`/?q=${marker.toLowerCase()}`);

    await expect(page.getByTestId('task-item')).toHaveCount(1);
  });

  test('a ?q link filters on load', async ({ page, request }) => {
    const marker = `deeplink${Date.now()}`;
    await createTask(request, `Find ${marker}`);

    await page.goto(`/?q=${marker}`);

    await expect(page.getByRole('searchbox')).toHaveValue(marker);
    await expect(page.getByTestId('task-item')).toHaveCount(1);
  });

  test('a search without results offers to clear it', async ({ page }) => {
    await page.goto('/?q=no-such-task-xyz');

    await expect(page.getByText(/No tasks match/)).toBeVisible();
    // The input must stay usable so the term can be changed.
    await expect(page.getByRole('searchbox')).toBeEnabled();

    await page.getByRole('link', { name: 'Clear search' }).click();
    await expect(page).toHaveURL('/');
  });

  test('the clear button empties the search and removes ?q', async ({ page, request }) => {
    const marker = `clear${Date.now()}`;
    await createTask(request, `Find ${marker}`);

    await page.goto(`/?q=${marker}`);
    await page.getByRole('button', { name: 'Clear search' }).click();

    await expect(page.getByRole('searchbox')).toHaveValue('');
    await expect(page).toHaveURL('/');
  });
});
