import { NextRequest, NextResponse } from "next/server"
import { getFullTaxonomy } from "@/lib/taxonomy"

/** GET /api/taxonomy/business-types/[id] — Full taxonomy for a business type (categories + services + placeholders) */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const taxonomy = await getFullTaxonomy(id)

        if (!taxonomy) {
            return NextResponse.json({ error: "Business type not found" }, { status: 404 })
        }

        return NextResponse.json(taxonomy)
    } catch {
        return NextResponse.json({ error: "Failed to load taxonomy" }, { status: 500 })
    }
}
