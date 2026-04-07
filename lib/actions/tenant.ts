import { db } from "@/lib/db";
import { tenant } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getTenantBySlug(slug: string) {
  try {
    const result = await db.query.tenant.findFirst({
      where: eq(tenant.slug, slug),
    });
    return result;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }
}

export async function getAllTenants() {
  return await db.query.tenant.findMany();
}
