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
  const editorTheme = editorConfig?.theme
  const heroConfig = editorConfig?.hero || {}
  const themeBg = editorTheme?.colors?.background || '#0f172a'
  
  // Hero-level gradient (desktop), fallback to theme gradient
  const heroDesktop = heroConfig.responsive?.desktop || {}
  const activeGradient = heroDesktop.gradient?.enabled ? heroDesktop.gradient : editorTheme?.gradient
  const gradientStyle = activeGradient?.enabled
      ? `linear-gradient(${activeGradient.angle}deg, ${activeGradient.stops
          .map((stop: any) => `${hexToRgba(stop.color, stop.opacity ?? 100)} ${stop.position}%`)
          .join(", ")})`
      : undefined

  const overlayColor = heroConfig.overlay?.enabled ? heroConfig.overlay.color : undefined
  const overlayOpacity = heroConfig.overlay?.enabled ? heroConfig.overlay.opacity : 0
  
  const vignette = heroConfig.vignette?.enabled ? heroConfig.vignette : undefined

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

      {/* 2. Color Overlay (Burgundy/Maroon feel from site) */}
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
          style={{ background: gradientStyle, opacity: (activeGradient.opacity ?? 100) / 100 }}
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
