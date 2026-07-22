import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    // Hash bcrypt para Admin@123456
    // $2a$10$9LoIqJxl6b5cG5Fb4P9rO.32e1S4Hf1NYm5GcqCJfCcCeQpwE7qz6

    const adminPasswordHash = "$2a$10$9LoIqJxl6b5cG5Fb4P9rO.32e1S4Hf1NYm5GcqCJfCcCeQpwE7qz6";
    const demoPasswordHash = "$2a$10$1gA0h3Qqn5EHQ3T5r2H7r.8QzDT9yZEzVGCKXVJ2C5QKnZxBqR9xm";

    const now = new Date();

    // Check if admin exists
    const existingAdmin = await db.query.user.findFirst({
      where: eq(schema.user.email, "admin@mandato360.com"),
    });

    if (existingAdmin) {
      // Update password if needed
      await db
        .update(schema.account)
        .set({ password: adminPasswordHash, updatedAt: now })
        .where(eq(schema.account.userId, existingAdmin.id));
    } else {
      // Create admin user
      const adminId = "user-admin-" + Date.now();
      await db.insert(schema.user).values({
        id: adminId,
        name: "Admin",
        email: "admin@mandato360.com",
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
        role: "admin",
      });

      await db.insert(schema.account).values({
        id: "account-admin-" + Date.now(),
        accountId: "admin",
        providerId: "credential",
        userId: adminId,
        password: adminPasswordHash,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Check if demo exists
    const existingDemo = await db.query.user.findFirst({
      where: eq(schema.user.email, "demo@mandato360.com"),
    });

    if (existingDemo) {
      // Update password if needed
      await db
        .update(schema.account)
        .set({ password: demoPasswordHash, updatedAt: now })
        .where(eq(schema.account.userId, existingDemo.id));
    } else {
      // Create demo user
      const demoId = "user-demo-" + Date.now();
      await db.insert(schema.user).values({
        id: demoId,
        name: "Demo User",
        email: "demo@mandato360.com",
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
        role: "user",
      });

      await db.insert(schema.account).values({
        id: "account-demo-" + Date.now(),
        accountId: "demo",
        providerId: "credential",
        userId: demoId,
        password: demoPasswordHash,
        createdAt: now,
        updatedAt: now,
      });
    }

    return Response.json(
      {
        success: true,
        message: "Users created/updated successfully",
        credentials: {
          admin: {
            email: "admin@mandato360.com",
            password: "Admin@123456",
          },
          demo: {
            email: "demo@mandato360.com",
            password: "Demo@123456",
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
