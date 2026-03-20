const { test, expect } = require('@playwright/test');

const { loginAsAdmin } = require('./helpers');

test.describe('Responsive navigation', () => {
  test('tablet layout opens and closes the sidebar from the menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 1100 });
    await loginAsAdmin(page);
    await page.goto('/');

    const toggle = page.locator('[data-nav-toggle]');
    const sidebar = page.locator('[data-sidebar]');
    const backdrop = page.locator('[data-nav-backdrop]');

    await expect(toggle).toBeVisible();
    await expect(sidebar).not.toBeInViewport();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(sidebar).toBeInViewport();
    await expect(backdrop).toBeVisible();

    await backdrop.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(sidebar).not.toBeInViewport();
  });

  test('mobile layout closes the sidebar after navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin(page);
    await page.goto('/');

    const toggle = page.locator('[data-nav-toggle]');
    const sidebar = page.locator('[data-sidebar]');

    await toggle.click();
    await expect(sidebar).toBeInViewport();

    await sidebar.getByRole('link', { name: 'Payments', exact: true }).click();
    await expect(page).toHaveURL(/\/payments$/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(sidebar).not.toBeInViewport();
    await expect(page.getByRole('heading', { name: 'Payments & Billing' })).toBeVisible();
  });
});
