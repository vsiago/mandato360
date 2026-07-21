import { TenantSidebar } from "@/components/sistema/tenant-sidebar"
import { TenantTopbar } from "@/components/sistema/tenant-topbar"
import { TenantBottombar } from "@/components/sistema/tenant-bottombar"
import { TenantMain } from "@/components/sistema/tenant-main"
import { demoTenant } from "@/lib/demo-data"

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const primaryColor = demoTenant.primaryColor
  const secondaryColor = demoTenant.secondaryColor

  const tenantProps = {
    slug: demoTenant.slug,
    name: demoTenant.name,
    primaryColor: demoTenant.primaryColor,
    secondaryColor: demoTenant.secondaryColor,
    logoUrl: demoTenant.logoUrl,
    fotoPerfilUrl: demoTenant.fotoPerfilUrl,
  }

  return (
    <div
      className="flex h-[100dvh] overflow-hidden bg-[#F0F3F8]"
      style={{
        // @ts-ignore — CSS custom properties for white-label theming
        "--primary": primaryColor,
        "--secondary": secondaryColor,
        "--ring": primaryColor,
        "--sidebar-primary": secondaryColor,
        "--sidebar": primaryColor,
      }}
    >
      {/* Sidebar — desktop only */}
      <TenantSidebar tenant={tenantProps} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TenantTopbar tenant={tenantProps} />
        {/* Demo banner */}
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
          <span className="animate-pulse">🎯</span>
          <span>Modo Demonstração — Dados simulados</span>
          <span className="animate-pulse">🎯</span>
        </div>
        <TenantMain>
          {children}
        </TenantMain>
      </div>

      {/* Bottom navigation bar — mobile only */}
      <TenantBottombar tenant={tenantProps} />
    </div>
  )
}
