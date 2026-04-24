/**
 * Admin middleware — checks for admin or superadmin role
 */

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null }
    }

    const role = (session.user as any).role
    if (role !== "admin" && role !== "superadmin") {
        return { error: NextResponse.json({ error: "Forbidden: admin access required" }, { status: 403 }), user: null }
    }

    return { error: null, user: session.user }
}

export async function requireRoot() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
        return { error: NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "")), user: null }
    }

    const role = (session.user as any).role
    if (role !== "root") {
        return { error: NextResponse.redirect(new URL("/painel", process.env.NEXT_PUBLIC_APP_URL || "")), user: null }
    }

    return { error: null, user: session.user }
}

