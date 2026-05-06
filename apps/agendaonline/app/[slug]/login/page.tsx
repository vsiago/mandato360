import { buildTenantConfig } from "@/lib/tenant-config-builder"
import { notFound, redirect } from "next/navigation"
import { TenantLoginForm } from "./login-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { hexToRgba } from "@/lib/style-utils"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function TenantLoginPage({ params }: PageProps) {
  const { slug } = await params
  const config = await buildTenantConfig(slug)

  if (!config) {
    notFound()
  }

  // Redirect if already logged in and matches owner
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user?.id === config.ownerId) {
    redirect("/painel")
  }

  const editorConfig = config.config as any
  const editorTheme = editorConfig?.theme || {}
  const heroConfig = editorConfig?.hero || {}
  const themeBg = editorTheme?.colors?.background || '#0f172a'
  
  // ─── Resolve Background exactly like resolveHero() ───
  // 1. Start with Mobile (Base)
  let resolvedGradient = heroConfig.gradient?.enabled ? heroConfig.gradient : editorTheme?.gradient
  let resolvedOverlay = heroConfig.overlay || { enabled: false }
  let resolvedVignette = heroConfig.vignette || { enabled: false }

  // 2. Apply Tablet Overrides
  const tablet = heroConfig.overrides?.tablet
  if (tablet) {
    if (tablet.gradient?.enabled) resolvedGradient = { ...resolvedGradient, ...tablet.gradient }
    if (tablet.overlay) resolvedOverlay = { ...resolvedOverlay, ...tablet.overlay }
    if (tablet.vignette) resolvedVignette = { ...resolvedVignette, ...tablet.vignette }
  }

  // 3. Apply Desktop Overrides (Login page is usually desktop-first)
  const desktop = heroConfig.overrides?.desktop
  if (desktop) {
    if (desktop.gradient?.enabled) resolvedGradient = { ...resolvedGradient, ...desktop.gradient }
    if (desktop.overlay) resolvedOverlay = { ...resolvedOverlay, ...desktop.overlay }
    if (desktop.vignette) resolvedVignette = { ...resolvedVignette, ...desktop.vignette }
  }

  // 4. Construct Gradient Style
  const gradientStyle = resolvedGradient?.enabled
      ? `linear-gradient(${resolvedGradient.angle}deg, ${resolvedGradient.stops
          .map((stop: any) => `${hexToRgba(stop.color, stop.opacity ?? 100)} ${stop.position}%`)
          .join(", ")})`
      : undefined

  const overlayColor = resolvedOverlay?.enabled ? resolvedOverlay.color : undefined
  const overlayOpacity = resolvedOverlay?.enabled ? resolvedOverlay.opacity : 0
  
  const vignette = resolvedVignette?.enabled ? resolvedVignette : undefined

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: themeBg }}
    >
      {/* ─── Background Layers (Exact match to Hero) ─── */}
      
      {/* 1. Background Image */}
      {config.branding.heroImageUrl && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundImage: `url(${config.branding.heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* 2. Color Overlay */}
      {overlayColor && (
        <div 
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }}
        />
      )}

      {/* 3. Theme/Hero Gradient */}
      {gradientStyle && (
        <div 
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ background: gradientStyle, opacity: (resolvedGradient.opacity ?? 100) / 100 }}
        />
      )}

      {/* 4. Vignette */}
      {vignette && (
        <div 
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, transparent ${100 - vignette.intensity}%, ${vignette.color} 100%)`
          }}
        />
      )}
      
      {/* 5. Login Card */}
      <div className="relative z-[10] w-full max-w-md">
        <TenantLoginForm config={config} />
      </div>
    </main>
  )
}
