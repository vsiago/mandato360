import { test, expect } from '@playwright/test';

test('deve carregar a página inicial com sucesso', async ({ page }) => {
  // Acessa a raiz do site (localhost:3002)
  await page.goto('/');
  
  // Verifica se o título da página ou algum texto principal está presente
  // Ajuste o texto conforme o conteúdo real da sua home
  await expect(page).toHaveTitle(/Agenda Online/);
  
  // Opcional: tira um print da home para conferência visual
  await page.screenshot({ path: 'test-results/home-page.png' });
  
  console.log('Página inicial carregada com sucesso!');
});
