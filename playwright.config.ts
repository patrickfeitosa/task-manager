import { loadEnvConfig } from '@next/env';
import { defineConfig, devices } from '@playwright/test';

// Playwright does not read .env files by itself; load them the way Next does so E2E_PORT can
// live in .env.local.
loadEnvConfig(process.cwd());

const PORT = Number(process.env.E2E_PORT ?? 3000);

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  reporter: process.env.CI ? 'github' : 'list',
  retries: process.env.CI ? 2 : 0,
  testDir: './e2e',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `${process.env.CI ? 'yarn start' : 'yarn dev'} -p ${PORT}`,
    reuseExistingServer: !process.env.CI,
    url: `http://localhost:${PORT}`,
  },
});
