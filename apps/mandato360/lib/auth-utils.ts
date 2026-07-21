/**
 * Security utilities for Authorization & RBAC
 * Integrates with Better Auth sessions
 */

import { headers } from "next/headers";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "./db/schema";

export type UserRole = "admin" | "assessor" | "readonly" | "user";

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
  tenantIds: string[]; // All tenants user has access to
}

/**
 * Get current user session from Better Auth
 * ⚠️ MUST be called only in Server Components or Server Actions
 */
export async function getSession() {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/get-session`,
      {
        headers: { cookie },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("[Auth] Failed to get session:", error);
    return null;
  }
}

/**
 * Get authenticated user context with tenant information
 * Throws error if user is not authenticated
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized: No active session");
  }

  // TODO: Fetch user's tenants from database
  // For now, assume single tenant from user relationship
  const user = session.user;

  return {
    userId: user.id,
    email: user.email,
    role: (user.role as UserRole) || "user",
    tenantId: null, // Will be set by the caller based on context
    tenantIds: [], // Fetch from DB when multi-tenant support is needed
  };
}

/**
 * Validate that user has access to a specific tenant
 * Throws error if access is denied
 */
export async function validateTenantAccess(
  tenantId: string,
  minRole: UserRole = "readonly"
): Promise<AuthContext> {
  const auth = await getAuthContext();

  // TODO: Implement multi-tenant relationship validation
  // For now, basic check
  if (!tenantId) {
    throw new Error("Invalid tenant ID");
  }

  // Fetch tenant to verify it exists
  const tenant = await db.query.tenant.findFirst({
    where: eq(schema.tenant.id, tenantId as any),
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  // TODO: Check if user has relationship to this tenant
  // const userTenant = await db.query.userTenant.findFirst({
  //   where: and(
  //     eq(schema.userTenant.userId, auth.userId),
  //     eq(schema.userTenant.tenantId, tenantId)
  //   ),
  // });

  // if (!userTenant) {
  //   throw new Error("Access denied to this tenant");
  // }

  // Role-based access control (future enhancement)
  // const roleHierarchy: Record<UserRole, number> = {
  //   admin: 3,
  //   assessor: 2,
  //   readonly: 1,
  //   user: 0,
  // };
  // if (roleHierarchy[auth.role] < roleHierarchy[minRole]) {
  //   throw new Error(`Insufficient permissions. Required: ${minRole}`);
  // }

  return { ...auth, tenantId };
}

/**
 * Safe wrapper for server actions with automatic authorization
 */
export async function withAuth<T>(
  handler: (auth: AuthContext) => Promise<T>,
  minRole?: UserRole
): Promise<T> {
  try {
    const auth = await getAuthContext();
    if (minRole && !canAccess(auth.role, minRole)) {
      throw new Error(`Insufficient permissions. Required: ${minRole}`);
    }
    return await handler(auth);
  } catch (error) {
    console.error("[Auth Error]", error);
    throw error;
  }
}

/**
 * Check if user role has required permission level
 */
function canAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    admin: 3,
    assessor: 2,
    readonly: 1,
    user: 0,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}

/**
 * Verify user is authenticated (quick check)
 */
export async function ensureAuthenticated() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}
