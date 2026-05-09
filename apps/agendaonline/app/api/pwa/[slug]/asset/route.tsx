import { ImageResponse } from 'next/og'
import { db } from "@/db"
import { tenants } from "@/db/schema"
import { eq } from "drizzle-orm"

// Removed edge runtime to allow DB access via postgres-js

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const size = parseInt(searchParams.get('size') || '512')
    const type = searchParams.get('type') || 'icon' // 'icon' or 'splash'

    const tenantDb = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    })

    if (!tenantDb) {
        return new Response('Not found', { status: 404 })
    }

    const primaryColor = tenantDb.primaryColor || '#8c6239'
    const logoUrl = tenantDb.logoUrl || tenantDb.avatarUrl
    const name = tenantDb.name || 'Agenda'
    const config = (tenantDb.config as any) || {}
    const designSystem = (tenantDb.designSystem as any) || {}

    const hexColor = primaryColor.startsWith('#') ? primaryColor : `#${primaryColor}`
    
    // Attempt to extract the "official" gradient from the hero or design system
    let background = `linear-gradient(135deg, ${hexColor} 0%, ${tenantDb.hoverColor || hexColor} 100%)`
    
    const heroGradient = config.__editorConfig?.hero?.gradient
    const themeGradient = designSystem.theme?.gradient
    const activeGradient = heroGradient?.enabled ? heroGradient : themeGradient

    if (activeGradient?.enabled && activeGradient.stops?.length > 0) {
        const stops = activeGradient.stops
            .sort((a: any, b: any) => a.position - b.position)
            .map((s: any) => `${s.color} ${s.position}%`)
            .join(', ')
        background = `linear-gradient(${activeGradient.angle || 135}deg, ${stops})`
    }

    const isSplash = type === 'splash'
    const width = isSplash ? 1024 : size
    const height = isSplash ? 2048 : size

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
                    background: background,
                }}
            >
                {/* Logo Container */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isSplash ? '40%' : '70%',
                    height: isSplash ? '40%' : '70%',
                }}>
                    {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logoUrl}
                            alt="Logo"
                            style={{ 
                                objectFit: 'contain', 
                                width: '100%', 
                                height: '100%',
                                // Remove any rounding as requested
                                borderRadius: '0',
                            }}
                        />
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: isSplash ? '40px' : '20%',
                            fontSize: isSplash ? '120px' : `${size * 0.4}px`,
                            color: 'white',
                            fontWeight: 'bold',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                
                {isSplash && (
                    <div style={{
                        position: 'absolute',
                        bottom: '80px',
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold',
                        opacity: 0.8,
                        letterSpacing: '0.1em',
                    }}>
                        {name.toUpperCase()}
                    </div>
                )}
            </div>
        ),
        {
            width,
            height,
        }
    )
}
