const { expect } = require('@playwright/test');

async function loginAsAdmin(page) {
  await page.goto('/auth/login');
  await page.getByLabel('Username *').fill('admin');
  await page.getByLabel('Password *').fill('admin123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).toHaveURL(/\/auth\/me$/);
}

module.exports = {
  loginAsAdmin,
};
