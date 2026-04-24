import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { globalCategories } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin-guard"

function slugify(text: string): string {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

/** GET /api/admin/business-types/[id]/categories — List categories for a business type */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params
    const categories = await db
        .select()
        .from(globalCategories)
        .where(eq(globalCategories.businessTypeId, id))
        .orderBy(asc(globalCategories.sortOrder))

    return NextResponse.json(categories)
}

/** POST /api/admin/business-types/[id]/categories — Create a category */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id: businessTypeId } = await params
    const body = await request.json()
    const { name, sortOrder } = body

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const slug = slugify(name)
    const catId = `gc-${slugify(businessTypeId)}-${slug}`

    const [created] = await db.insert(globalCategories).values({
        id: catId,
        businessTypeId,
        name,
        slug,
        sortOrder: sortOrder ?? 0,
    }).returning()

    return NextResponse.json(created, { status: 201 })
}
