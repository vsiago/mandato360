import { test, expect } from '@playwright/test';

test('deve realizar login visual com sucesso', async ({ page }) => {
  // 1. Acessa a página de login
  console.log('Navegando para /login...');
  await page.goto('/login');
  
  // 2. Garante que a página carregou
  await expect(page.getByText('Bem-vindo de volta')).toBeVisible({ timeout: 10000 });

  // 3. Preenche as credenciais do script setup-test-user.ts
  console.log('Preenchendo credenciais...');
  await page.locator('#login-email').fill('vsiago22@gmail.com');
  await page.locator('#login-password').fill('81510156');

  // 4. Clica no botão e observa a resposta
  console.log('Clicando no botão de entrar...');
  await page.getByRole('button', { name: /Entrar no Painel/i }).click();

  // 5. Verifica se o Toast de sucesso apareceu (opcional, mas bom para debug)
  try {
    await expect(page.getByText('Login realizado com sucesso')).toBeVisible({ timeout: 5000 });
    console.log('Toast de sucesso detectado!');
  } catch (e) {
    console.log('Aviso: Toast de sucesso não apareceu a tempo, mas tentando prosseguir...');
  }

  // 6. Aguarda o redirecionamento para o Painel
  console.log('Aguardando redirecionamento para /painel...');
  await page.waitForURL('**/painel', { timeout: 20000 });
  
  // 7. Confirma que chegamos ao destino
  await expect(page).toHaveURL(/.*painel/);
  console.log('Login concluído com sucesso!');
});

test('deve falhar com senha incorreta', async ({ page }) => {
  await page.goto('/login');
  await page.locator('#login-email').fill('vsiago22@gmail.com');
  await page.locator('#login-password').fill('senha_errada');
  await page.getByRole('button', { name: /Entrar no Painel/i }).click();

  // Verifica mensagem de erro
  await expect(page.getByText(/Erro ao realizar login|E-mail ou senha inválidos/i)).toBeVisible();
});
