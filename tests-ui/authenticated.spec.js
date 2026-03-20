const { test, expect } = require('@playwright/test');

const { loginAsAdmin } = require('./helpers');

test.describe('Authenticated browser flows', () => {
  test('admin can log in through the real UI and reach the account page', async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
    await expect(page.locator('.user-name')).toHaveText('System Administrator');
    await expect(page.locator('.user-role').first()).toHaveText('Admin');
    await expect(page.getByText('Username').locator('..').getByText('admin')).toBeVisible();
  });

  test('dashboard shows seeded operational content after login', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'System Dashboard' })).toBeVisible();
    await expect(page.getByRole('table').first()).toContainText('Playwright Academy');
    await expect(page.getByRole('link', { name: 'Register Institution' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Generate Reports' })).toBeVisible();
  });

  test('institutions page shows the seeded institution record', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/institutions');

    await expect(page.getByRole('heading', { name: 'Registered Institutions' })).toBeVisible();
    await expect(page.getByRole('table')).toContainText('Playwright Academy');
    await expect(page.getByRole('table')).toContainText('Jane Testing');
    await expect(page.getByRole('table')).toContainText('10 MBPS');
  });

  test('payments page shows overdue monthly billing data', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/payments');

    await expect(page.getByRole('heading', { name: 'Payments & Billing' })).toBeVisible();
    await expect(page.getByRole('table')).toContainText('Playwright Academy');
    await expect(page.getByRole('table')).toContainText('Monthly');
    await expect(page.getByRole('table')).toContainText('Overdue');
    await expect(page.getByRole('table')).toContainText('Fine');
  });

  test('reports page shows seeded summaries and history', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/reports');

    await expect(page.getByRole('heading', { name: 'Operational Reports' })).toBeVisible();
    await expect(page.locator('[data-report-section="disconnections"]')).toContainText('Late monthly payment');
    await expect(page.locator('[data-report-section="upgrades"]')).toContainText('20 MBPS');
    await expect(page.locator('main.content-area')).toContainText('Playwright Academy');
  });

  test('logging out clears the authenticated session', async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('button', { name: 'Log Out' }).click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await page.goto('/auth/me');
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole('heading', { name: 'Azani ISP Login' })).toBeVisible();
  });
});
