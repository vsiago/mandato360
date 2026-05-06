import { auth } from "../lib/auth";
import { db } from "../db";
import { user as userTable } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Creating master user for Valesca...");

    const email = "valesca.grupoplan@grupoplan.com.br";
    const password = "grupoplan2026";
    const name = "Valesca Grupoplan";

    try {
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            },
        });

        if (result) {
            console.log("User created successfully.");
            await db.update(userTable)
                .set({ role: "superadmin", emailVerified: true })
                .where(eq(userTable.email, email));
            console.log("Role updated to superadmin.");
        }
    } catch (error: any) {
        if (error.message?.includes("already exists") || error.code === "user_already_exists") {
            console.log("User already exists, updating role...");
            await db.update(userTable)
                .set({ role: "superadmin", emailVerified: true })
                .where(eq(userTable.email, email));
            console.log("Role updated.");
        } else {
            console.error("Error:", error);
        }
    }
    process.exit(0);
}

main().catch(console.error);
