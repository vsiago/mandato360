import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { businessTypes } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin-guard"

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

/** GET /api/admin/business-types — List all business types */
export async function GET() {
    const { error } = await requireAdmin()
    if (error) return error

    const types = await db
        .select()
        .from(businessTypes)
        .orderBy(asc(businessTypes.sortOrder))

    return NextResponse.json(types)
}

/** POST /api/admin/business-types — Create a new business type */
export async function POST(request: NextRequest) {
    const { error } = await requireAdmin()
    if (error) return error

    const body = await request.json()
    const { name, icon, emoji, description } = body

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const slug = slugify(name)
    const id = `bt-${slug}`

    // Check for duplicate slug
    const existing = await db.query.businessTypes.findFirst({
        where: eq(businessTypes.slug, slug),
    })
    if (existing) {
        return NextResponse.json({ error: "Business type with this name already exists" }, { status: 409 })
    }

    // Get max sort order
    const all = await db.select().from(businessTypes)
    const maxSort = all.reduce((max, t) => Math.max(max, t.sortOrder), -1)

    const [created] = await db.insert(businessTypes).values({
        id,
        name,
        slug,
        icon: icon || emoji || "📝",
        emoji: emoji || icon || "📝",
        description: description || "",
        sortOrder: maxSort + 1,
    }).returning()

    return NextResponse.json(created, { status: 201 })
}
