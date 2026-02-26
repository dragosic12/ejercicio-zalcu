import { expect, test } from '@playwright/test';

test('smoke: homepage sections and locale switch', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Ingeniería de software con mentalidad de producto/i })).toBeVisible();
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.locator('#image-lab')).toBeVisible();

  await page.getByTestId('locale-toggle').click();
  await expect(page.getByRole('heading', { name: /Software engineering with a product mindset/i })).toBeVisible();
});

test('mobile: ai lab is usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('link', { name: /Lab IA|AI Lab/i }).click();
  await expect(page.locator('#image-lab')).toBeVisible();
  await expect(page.locator('#hf-token')).toBeVisible();
  await expect(page.locator('#prompt')).toBeVisible();
});

