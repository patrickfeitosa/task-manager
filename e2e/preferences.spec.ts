import { expect, type Page, test } from '@playwright/test';

// Hydration problems are reported as console errors; collect them while the page loads.
const trackHydrationErrors = (page: Page) => {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat/i.test(message.text())) {
      errors.push(message.text());
    }
  });

  return errors;
};

test.describe('theme', () => {
  test('toggles dark mode and remembers it after a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const html = page.locator('html');

    await expect(html).not.toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('follows the OS preference when nothing was chosen', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('language', () => {
  test('switches to Portuguese and keeps it after a reload without hydration errors', async ({
    page,
  }) => {
    const hydrationErrors = trackHydrationErrors(page);

    await page.goto('/');
    await page.getByRole('button', { name: /Switch language/ }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tarefas');

    await page.reload();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tarefas');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    expect(hydrationErrors).toEqual([]);
  });

  test('switches back to English', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Switch language/ }).click();
    await page.getByRole('button', { name: /Mudar idioma/ }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tasks');
  });
});
