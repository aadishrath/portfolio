import { test, expect } from '@playwright/test';

test('home offers direct contact, featured work, and retained project details', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Aadish Rathore', exact: true })).toBeVisible();
  await expect(page.getByText('Frontend Engineer | AI Frontend Engineer', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email Me' })).toHaveAttribute('href', 'mailto:adib.rathore@gmail.com');
  await expect(page.getByRole('link', { name: 'View Resume' }).first()).toHaveAttribute('href', '/AadishRathore.pdf');
  await page.screenshot({ path: 'test-results/home.png', fullPage: true, animations: 'disabled' });
  await page.getByRole('link', { name: 'View Projects', exact: true }).click();
  const trigger = page.getByRole('button', { name: 'View details for AdiBank Copilot' });
  await trigger.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'AdiBank Copilot' });
  await expect(dialog).toBeVisible();
  await page.screenshot({ path: 'test-results/modal-light.png', animations: 'disabled' });
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'View Repository' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close project details' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
  await page.screenshot({ path: 'test-results/desktop-projects.png', fullPage: true, animations: 'disabled' });
  expect(errors).toEqual([]);
});

test('ML projects render Markdown tables and expose only valid actions', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: 'Live Demo' })).toHaveCount(0);
  await page.getByRole('button', { name: 'View details for House Price Prediction' }).click();
  await expect(page.getByRole('dialog').getByRole('table').first()).toBeVisible();
});

test('theme persists and retired routes show a useful 404', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Toggle dark theme' });
  const before = await toggle.getAttribute('aria-pressed');
  await toggle.click(); await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true');
  for (const route of ['/rag', '/sentiment', '/missing']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  }
  await expect(page.getByRole('button', { name: /chatbot|assistant/i })).toHaveCount(0);
});

test('mobile navigation is hidden from keyboard focus and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation menu' });
  await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toHaveCount(0);
  await expect(page.locator('#mobile-navigation')).not.toBeVisible();
  await menu.click();
  await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole('dialog').getByRole('link', { name: 'Frontend Projects' }).click();
  await expect(page.getByRole('heading', { name: 'Frontend Projects', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile-projects.png', fullPage: true, animations: 'disabled' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});


test('deep project links scroll after loading and live links do not open dialogs', async ({ page }) => {
  await page.goto('/frontend#personal-portfolio-website-old');
  const target = page.locator('#personal-portfolio-website-old');
  await expect(target).toBeInViewport();
  expect(await target.evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(60);
  await page.goto('/frontend');
  const live = page.getByRole('link', { name: 'Live Demo' }).first();
  await expect(live).toHaveAttribute('target', '_blank');
  await live.evaluate(element => element.addEventListener('click', event => event.preventDefault()));
  await live.click();
  await expect(page.getByRole('dialog', { name: 'AdiBank Copilot' })).toHaveCount(0);
});


test('mobile project details keep actions accessible in dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => localStorage.setItem('portfolio-theme', 'dark'));
  await page.goto('/frontend');
  await page.getByRole('button', { name: 'View details for AdiBank Copilot' }).click();
  const dialog = page.getByRole('dialog', { name: 'AdiBank Copilot' });
  await expect(dialog.getByText('Engineering focus', { exact: true })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'View Repository', exact: true })).toBeInViewport();
  await expect(dialog.getByRole('button', { name: 'Close project details' })).toBeInViewport();
  await dialog.locator('.popup-body-container').evaluate(element => { element.scrollTop = element.scrollHeight; });
  await expect(dialog.getByRole('link', { name: 'View Repository', exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/modal-dark-mobile.png', animations: 'disabled' });
});
