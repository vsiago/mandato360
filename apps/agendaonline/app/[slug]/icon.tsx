import { ImageResponse } from 'next/og'
import { db } from "@/db"
import { tenants } from "@/db/schema"
import { eq } from "drizzle-orm"

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const tenantDb = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    })

    const initial = tenantDb?.name ? tenantDb.name.charAt(0).toUpperCase() : 'A'
    const primaryColor = tenantDb?.primaryColor || '#8c6239'

    const hexColor = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hexColor,
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif',
                    borderRadius: '50%',
                }}
            >
                {initial}
            </div>
        ),
        { ...size }
    )
}
