import "dotenv/config";
import { sendMail } from "../lib/mail";
import { getWelcomeEmailHtml } from "../lib/mail/templates/welcome-email";

async function main() {
  console.log("🚀 Iniciando teste de envio de e-mail...");
  
  // No Resend (plano gratuito), você só pode enviar para o seu próprio e-mail de cadastro.
  const testEmail = process.env.TEST_RECEIVER_EMAIL;
  const userName = "Usuário Teste";
  const confirmationLink = "https://agendaonline.app/confirmar?token=teste-123";
  
  if (!testEmail || testEmail === "seu-email@exemplo.com") {
    console.error("❌ Erro: Defina a variável TEST_RECEIVER_EMAIL no seu .env com o seu e-mail de cadastro.");
    return;
  }

  const html = getWelcomeEmailHtml(userName, confirmationLink);
  
  const result = await sendMail({
    to: testEmail,
    subject: process.env.WELCOME_EMAIL_SUBJECT || "Bem-vindo ao AgendaOnline - Teste",
    html,
  });

  if (result.success) {
    console.log("✅ Teste concluído com sucesso!");
    console.log("📧 Verifique sua caixa de entrada (incluindo spam) em:", testEmail);
  } else {
    console.error("❌ Falha no teste de envio.");
    console.error(result.error);
  }
}

main().catch(console.error);
