import nodemailer from "nodemailer";

/**
 * Interface para os parâmetros de envio de e-mail
 */
export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Cria o transportador SMTP usando as credenciais do ambiente
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true para 465, false para outros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envia um e-mail transacional
 */
export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  const fromName = process.env.SMTP_FROM_NAME || "AgendaOnline";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "noreply@agendaonline.com.br";

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || "Por favor, visualize este e-mail em um cliente que suporte HTML.",
    });

    console.log("E-mail enviado com sucesso:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error };
  }
}
