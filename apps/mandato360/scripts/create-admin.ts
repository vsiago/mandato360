import "dotenv/config";
import { auth } from "../lib/auth";

async function createAdmin() {
    try {
        console.log("Creating admin master user...");
        
        // Use better-auth internal api to create user with hashed password
        const user = await auth.api.signUpEmail({
            body: {
                email: "admin@mandato360.com.br",
                password: "Ia81510156!",
                name: "Admin Master",
                role: "admin",
            }
        });

        console.log("Admin user created successfully:", user);
    } catch (error) {
        console.error("Failed to create admin user:", error);
    } finally {
        process.exit();
    }
}

createAdmin();
