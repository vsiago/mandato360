import { TenantSidebar } from "@/components/sistema/tenant-sidebar"
import { TenantTopbar } from "@/components/sistema/tenant-topbar"
import { TenantBottombar } from "@/components/sistema/tenant-bottombar"
import { getTenantBySlug } from "@/lib/actions/tenant"
import { notFound } from "next/navigation"

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)

  if (!tenantData) {
    return notFound()
  }

  const primaryColor = tenantData.primaryColor || "#0F2B5B"
  const secondaryColor = tenantData.secondaryColor || "#0D9F6E"

  const tenantProps = {
    slug: tenantData.slug,
    name: tenantData.name,
    primaryColor: tenantData.primaryColor,
    secondaryColor: tenantData.secondaryColor,
    logoUrl: tenantData.logoUrl,
    fotoPerfilUrl: tenantData.fotoPerfilUrl,
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
        {/* Extra padding-bottom on mobile for the bottombar */}
        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24 lg:px-8 lg:py-6 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom navigation bar — mobile only */}
      <TenantBottombar tenant={tenantProps} />
    </div>
  )
}
