import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { sendMail } from "@/lib/mail";
import { getWelcomeEmailHtml } from "@/lib/mail/templates/welcome-email";
import { getResetPasswordEmailHtml } from "@/lib/mail/templates/reset-password-email";



import { admin } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
            },
        },
    },
    plugins: [
        admin()
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        async sendResetPassword({ user, url }) {
            await sendMail({
                from: `"AgendaOnline | Segurança" <${process.env.SMTP_SECURITY_EMAIL}>`,
                to: user.email,
                subject: process.env.RESET_PASSWORD_EMAIL_SUBJECT || "Recuperação de Senha - AgendaOnline",
                html: getResetPasswordEmailHtml(user.name, url),
            });
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        async sendVerificationEmail({ user, url }) {
            await sendMail({
                from: `"AgendaOnline | Confirmação" <${process.env.SMTP_CONFIRMATION_EMAIL}>`,
                to: user.email,
                subject: process.env.WELCOME_EMAIL_SUBJECT || "Bem-vindo ao AgendaOnline!",
                html: getWelcomeEmailHtml(user.name, url),
            });
        },
    },
});
