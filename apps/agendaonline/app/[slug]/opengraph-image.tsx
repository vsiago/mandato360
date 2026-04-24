import { ImageResponse } from 'next/og'
import { db } from "@/db"
import { tenants } from "@/db/schema"
import { eq } from "drizzle-orm"

export const alt = 'Agenda Online'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const tenantDb = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    })

    if (!tenantDb) {
        return new Response('Not found', { status: 404 })
    }

    const primaryColor = tenantDb.primaryColor || '#8c6239'
    const name = tenantDb.name || 'Agenda Online'
    const logoUrl = tenantDb.logoUrl
    const address = tenantDb.address || ''

    const hexColor = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#140e03',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.03) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.03) 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `linear-gradient(135deg, ${hexColor}99 0%, rgba(20, 14, 3, 0.95) 100%)`,
                    }}
                />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                }}>
                    {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoUrl}
                            alt="Logo"
                            height={220}
                            style={{ objectFit: 'contain', marginBottom: '40px' }}
                        />
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            marginBottom: '40px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '180px',
                                height: '180px',
                                backgroundColor: hexColor,
                                borderRadius: '50%',
                                fontSize: '90px',
                                fontWeight: 'bold',
                                marginBottom: '40px',
                                boxShadow: `0 20px 40px rgba(0,0,0,0.5)`,
                            }}>
                                {name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}

                    <h1 style={{
                        fontSize: '72px',
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        margin: 0,
                        padding: '0 40px',
                        textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        maxWidth: '1000px'
                    }}>
                        {name}
                    </h1>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    fontSize: '24px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    zIndex: 10
                }}>
                    {address ? `${address} • ` : ''}Powered by Agenda Online
                </div>
            </div>
        ),
        { ...size }
    )
}
