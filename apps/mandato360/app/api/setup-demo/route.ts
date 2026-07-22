import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "better-auth/crypto";

export async function POST(request: Request) {
  try {
    const now = new Date();

    // Admin user
    const adminEmail = "admin@mandato360.com";
    const adminPassword = "Admin@123456";

    const existingAdmin = await db.query.user.findFirst({
      where: eq(schema.user.email, adminEmail),
    });

    if (!existingAdmin) {
      const adminId = "user-admin-" + Date.now();
      const hashedPassword = await hash(adminPassword);

      await db.insert(schema.user).values({
        id: adminId,
        name: "Admin",
        email: adminEmail,
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
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing admin password
      const hashedPassword = await hash(adminPassword);
      await db
        .update(schema.account)
        .set({ password: hashedPassword, updatedAt: now })
        .where(eq(schema.account.userId, existingAdmin.id));
    }

    // Demo user
    const demoEmail = "demo@mandato360.com";
    const demoPassword = "Demo@123456";

    const existingDemo = await db.query.user.findFirst({
      where: eq(schema.user.email, demoEmail),
    });

    if (!existingDemo) {
      const demoId = "user-demo-" + Date.now();
      const hashedPassword = await hash(demoPassword);

      await db.insert(schema.user).values({
        id: demoId,
        name: "Demo User",
        email: demoEmail,
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
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing demo password
      const hashedPassword = await hash(demoPassword);
      await db
        .update(schema.account)
        .set({ password: hashedPassword, updatedAt: now })
        .where(eq(schema.account.userId, existingDemo.id));
    }

    return Response.json(
      {
        success: true,
        message: "Users created/updated successfully",
        credentials: {
          admin: {
            email: adminEmail,
            password: adminPassword,
          },
          demo: {
            email: demoEmail,
            password: demoPassword,
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
