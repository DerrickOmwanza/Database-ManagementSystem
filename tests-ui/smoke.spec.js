const { test, expect } = require('@playwright/test');

test.describe('Application smoke flow', () => {
  test('health endpoint reports ready state', async ({ request }) => {
    const response = await request.get('/health');
    const body = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(body.status).toBe('healthy');
    expect(body.timestamp).toBeTruthy();
  });

  test('root redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole('heading', { name: 'Azani ISP Login' })).toBeVisible();
  });

  test('login screen renders the expected form controls', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(page).toHaveTitle(/Login/i);
    await expect(page.getByLabel('Username *')).toBeVisible();
    await expect(page.getByLabel('Password *')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
  });

  test('login screen remains usable on a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/auth/login');

    await expect(page.getByRole('heading', { name: 'Azani ISP Login' })).toBeVisible();
    await expect(page.locator('main.auth-card')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeInViewport();
  });
});
