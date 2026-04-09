import { AppSidebar } from "@/components/app-sidebar"
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

  return (
    <div 
      className="min-h-screen bg-[#F0F3F8]"
      style={{ 
        // @ts-ignore
        "--primary": primaryColor,
        "--secondary": secondaryColor,
        "--ring": primaryColor,
        "--sidebar-primary": secondaryColor,
      }}
    >
      <AppSidebar />
      {/* Desktop: padding to keep sidebar clear, Mobile: pb for bottom nav */}
      <main className="pb-20 md:pb-0 md:pl-64 flex flex-col min-h-screen w-full">
        <div className="flex-1 w-full bg-[#F0F3F8]">
          {children}
        </div>
      </main>
    </div>
  )
}
