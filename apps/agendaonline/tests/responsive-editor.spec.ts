import { test, expect } from '@playwright/test';

test.describe('Agenda Online Site Editor - Responsive Breakpoints', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the editor page
    await page.goto('/dashboard/editar-site');
    
    // Wait for the loader to disappear
    await page.waitForSelector('text=Carregando editor responsivo...', { state: 'hidden' });
  });

  test('should allow independent hero positioning for mobile and desktop', async ({ page }) => {
    // 1. Switch to Desktop
    const desktopBtn = page.getByRole('button', { name: 'Desktop' });
    await desktopBtn.click();
    await expect(desktopBtn).toHaveClass(/bg-background/); // Active state

    // 2. Select Hero Section in Nav (if needed)
    // The editor usually starts with Hero active, but let's be sure
    // await page.click('text=Hero'); 

    // 3. Change Hero Title for Desktop
    const titleInput = page.locator('div:has-text("Título") + input'); // Based on current structure
    // Since labels are in divs next to inputs
    await page.getByLabel('Título', { exact: true }).fill('Desktop Headline');

    // 4. Switch to Mobile (Celular)
    const mobileBtn = page.getByRole('button', { name: 'Celular' });
    await mobileBtn.click();
    await expect(mobileBtn).toHaveClass(/bg-background/);

    // 5. Verify Mobile Title (should be default or different)
    // and then change it for Mobile override
    await page.getByLabel('Título', { exact: true }).fill('Mobile Headline');

    // 6. Switch back to Desktop and verify it didn't change
    await desktopBtn.click();
    const desktopTitle = await page.getByLabel('Título', { exact: true }).inputValue();
    expect(desktopTitle).toBe('Desktop Headline');

    // 7. Save
    await page.getByRole('button', { name: /Salvar/i }).click();
    await expect(page.getByText('Site salvo com sucesso!')).toBeVisible();
  });

  test('should show override indicators when a property is customized for a device', async ({ page }) => {
    // 1. Switch to Tablet
    await page.getByRole('button', { name: 'Tablet' }).click();

    // 2. Change Description to create an override
    await page.getByLabel('Descrição', { exact: true }).fill('Custom Tablet Description');

    // 3. Check for the override indicator (the purple dot)
    const indicator = page.locator('button[title*="Override ativo"]');
    await expect(indicator).toBeVisible();

    // 4. Reset override
    await indicator.click();
    
    // 5. Verify it's gone
    await expect(indicator).toBeHidden();
  });
});
