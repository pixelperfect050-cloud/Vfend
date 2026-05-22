import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://brandrocket-ebon.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile iPhone X (375x812)',
      use: { ...devices['iPhone X'] },
    },
    {
      name: 'Mobile iPhone 12 Pro (390x844)',
      use: { ...devices['iPhone 12 Pro'] },
    },
    {
      name: 'iPad Mini (768x1024)',
      use: { ...devices['iPad Mini'] },
    },
  ],
});
