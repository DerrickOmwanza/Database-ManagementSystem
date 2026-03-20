const { defineConfig, devices } = require('@playwright/test');

const port = Number(process.env.PLAYWRIGHT_PORT || 3100);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;
const databaseName = process.env.PLAYWRIGHT_DB_NAME || 'azani_isp_playwright';

module.exports = defineConfig({
  testDir: './tests-ui',
  globalSetup: './tests-ui/global.setup.js',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
  webServer: {
    command: `node server.js`,
    url: `${baseURL}/health`,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: String(port),
      NODE_ENV: 'test',
      SESSION_SECRET: 'playwright-session-secret',
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_USER: process.env.DB_USER || 'root',
      DB_PASS: process.env.DB_PASS || '',
      DB_PORT: process.env.DB_PORT || '3306',
      DB_NAME: databaseName,
    },
  },
});
