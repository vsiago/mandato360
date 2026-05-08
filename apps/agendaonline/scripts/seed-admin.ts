import "./env";
import { auth } from "../lib/auth";
import { db } from "../db";
import { user as userTable } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding superadmin...");

    try {
        // Create user via Better Auth API to handle password hashing
        const result = await auth.api.signUpEmail({
            body: {
                email: "admin@agendaonline.app",
                password: "Iaaa81510156!!!",
                name: "Admin Agenda Online",
            },
        });

        if (result) {
            console.log("User created successfully via Better Auth.");

            // Update role to root
            await db.update(userTable)
                .set({ role: "root", emailVerified: true })
                .where(eq(userTable.email, "admin@agendaonline.app"));

            console.log("User role updated to root.");
        }
    } catch (error: any) {
        if (error.message?.includes("already exists") || error.code === "user_already_exists") {
            console.log("User already exists, updating role to root...");
            await db.update(userTable)
                .set({ role: "root", emailVerified: true })
                .where(eq(userTable.email, "admin@agendaonline.app"));
            console.log("Role updated.");
        } else {
            console.error("Error seeding admin:", error);
        }
    }

    console.log("Seed finished.");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
