/**
 * Gera o HTML para o e-mail de boas-vindas e confirmação de cadastro
 */
export function getWelcomeEmailHtml(userName: string, confirmationLink: string) {
  const brandColor = "#D4AF37"; // Gold
  const secondaryColor = "#1C1C1C"; // Stone/Dark Gray
  const backgroundColor = "#F8F9FA";
  const cardColor = "#FFFFFF";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao AgendaOnline</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: ${backgroundColor};
      color: ${secondaryColor};
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .card {
      background-color: ${cardColor};
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .header {
      background-color: ${secondaryColor};
      padding: 40px;
      text-align: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: ${brandColor};
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 20px;
      color: ${secondaryColor};
    }
    
    p {
      margin-bottom: 20px;
      font-size: 16px;
      color: #4A4A4A;
    }
    
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    
    .button {
      background-color: ${brandColor};
      color: ${secondaryColor} !important;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }
    
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #888;
    }
    
    .divider {
      height: 1px;
      background-color: #EEE;
      margin: 30px 0;
    }
    
    .highlight {
      color: ${brandColor};
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">AgendaOnline</div>
      </div>
      
      <div class="content">
        <h1>${process.env.WELCOME_EMAIL_TITLE || `Olá, ${userName}!`}</h1>
        <p>${process.env.WELCOME_EMAIL_BODY || `Seja muito bem-vindo ao <span class="highlight">AgendaOnline</span>. Estamos entusiasmados por você ter se juntado à nossa plataforma de gestão profissional.`}</p>
        
        <p>Para começar a organizar sua agenda e oferecer a melhor experiência aos seus clientes, precisamos apenas que você confirme seu e-mail clicando no botão abaixo:</p>
        
        <div class="button-container">
          <a href="${confirmationLink}" class="button">Confirmar meu E-mail</a>
        </div>
        
        <p>Se o botão acima não funcionar, você pode copiar e colar o link abaixo no seu navegador:</p>
        <p style="font-size: 12px; word-break: break-all; color: #888;">${confirmationLink}</p>
        
        <div class="divider"></div>
        
        <p>Se você não realizou este cadastro, por favor ignore este e-mail.</p>
        
        <p>Com carinho,<br><strong>Equipe AgendaOnline</strong></p>
      </div>
    </div>
    
    <div class="footer">
      &copy; ${new Date().getFullYear()} AgendaOnline. Todos os direitos reservados.<br>
      Este é um e-mail automático, por favor não responda.
    </div>
  </div>
</body>
</html>
  `;
}
