import { auth } from "../lib/auth";
import { db } from "../db";
import { user, tenants } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const email = "jaque@jaquegeovanelle.com";
    const password = "JaquePassword123!";
    const name = "Jaque Geovanelle";
    const slug = "jaque-geovanelle";

    console.log(`Step 1: Creating user: ${email}`);
    
    try {
        const res = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name
            }
        });
        const userId = res.user.id;
        console.log(`User created successfully! ID: ${userId}`);

        console.log("Step 2: Verifying email in database...");
        await db.update(user).set({ emailVerified: true }).where(eq(user.id, userId));

        console.log(`Step 3: Assigning tenant ${slug} to user ${userId}...`);
        await db.update(tenants).set({ ownerId: userId }).where(eq(tenants.slug, slug));

        console.log("All steps completed!");
        console.log(`User: ${email}`);
        console.log(`Password: ${password}`);
    } catch (e: any) {
        if (e.message?.includes("already exists") || e.code === "user_already_exists") {
             console.log("User already exists, just updating tenant owner.");
             const u = await db.query.user.findFirst({ where: eq(user.email, email) });
             if (u) {
                 await db.update(tenants).set({ ownerId: u.id }).where(eq(tenants.slug, slug));
                 console.log("Tenant owner updated to existing user.");
             }
        } else {
            console.error("Error:", e);
        }
    }
}

main().catch(console.error);
