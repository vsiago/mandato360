import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
    },
    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3004",
        "https://mandato360.com.br",
    ],
	emailAndPassword: {
		enabled: true,
	},
    logger: {
        level: "warn",
        log: (level, message, args) => {
            // Suppress generic session query failures in the console to reduce noise
            // These are already handled by the middleware catch blocks
            if (message?.includes("Failed query") && message?.includes("session")) {
                return;
            }
            if (level === "error") console.error(`[Better Auth]: ${message}`, args);
            else if (level === "warn") console.warn(`[Better Auth]: ${message}`, args);
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
            }
        }
    }
});
