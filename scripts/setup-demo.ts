/**
 * SETUP SCRIPT - Create demo user for local testing
 * Run before starting dev server: npx ts-node scripts/setup-demo.ts
 */

import { db } from "../apps/mandato360/lib/db";
import * as schema from "../apps/mandato360/lib/db/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

const DEMO_USER = {
  email: "demo@mandato360.com",
  password: "Demo@123456",
  name: "Demo User",
};

const ADMIN_USER = {
  email: "admin@mandato360.com",
  password: "Admin@123456",
  name: "Admin",
};

async function setupDemo() {
  try {
    console.log("🚀 Setting up demo users...");

    // Check if demo user exists
    const existingDemo = await db.query.user.findFirst({
      where: eq(schema.user.email, DEMO_USER.email),
    });

    if (existingDemo) {
      console.log("✅ Demo user already exists");
      console.log(`   Email: ${DEMO_USER.email}`);
      console.log(`   Password: ${DEMO_USER.password}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);

    // Create demo user
    const now = new Date();
    const demoUser = await db
      .insert(schema.user)
      .values({
        id: "user-demo-0000",
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
        role: "user",
      })
      .returning();

    // Create account with password
    await db.insert(schema.account).values({
      id: "account-demo-0000",
      accountId: "demo",
      providerId: "credential",
      userId: demoUser[0].id,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    console.log("✅ Demo user created successfully!");
    console.log(`   Email: ${DEMO_USER.email}`);
    console.log(`   Password: ${DEMO_USER.password}`);

    // Create admin user
    const existingAdmin = await db.query.user.findFirst({
      where: eq(schema.user.email, ADMIN_USER.email),
    });

    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash(ADMIN_USER.password, 10);

      const adminUser = await db
        .insert(schema.user)
        .values({
          id: "user-admin-0000",
          name: ADMIN_USER.name,
          email: ADMIN_USER.email,
          emailVerified: true,
          image: null,
          createdAt: now,
          updatedAt: now,
          role: "admin",
        })
        .returning();

      await db.insert(schema.account).values({
        id: "account-admin-0000",
        accountId: "admin",
        providerId: "credential",
        userId: adminUser[0].id,
        password: hashedAdminPassword,
        createdAt: now,
        updatedAt: now,
      });

      console.log("✅ Admin user created successfully!");
      console.log(`   Email: ${ADMIN_USER.email}`);
      console.log(`   Password: ${ADMIN_USER.password}`);
    } else {
      console.log("✅ Admin user already exists");
      console.log(`   Email: ${ADMIN_USER.email}`);
      console.log(`   Password: ${ADMIN_USER.password}`);
    }

    console.log("\n🎉 Setup complete!");
    console.log("   Access at: http://localhost:3003");
    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setupDemo();
