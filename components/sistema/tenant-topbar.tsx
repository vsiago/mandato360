"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react"

interface TenantData {
  slug: string
  name: string
  primaryColor?: string | null
  secondaryColor?: string | null
  logoUrl?: string | null
}

const getBreadcrumbMap = (tenant: string): Record<string, string> => ({
  [`/${tenant}/dashboard`]: "Dashboard",
  [`/${tenant}/dashboard/publico/hero`]: "Hero & Destaques",
  [`/${tenant}/dashboard/publico/leis`]: "Leis / Projetos",
  [`/${tenant}/dashboard/publico/indicacoes`]: "Indicações Legislativas",
  [`/${tenant}/dashboard/publico/quem-sou`]: "Quem Sou",
  [`/${tenant}/dashboard/publico/agenda`]: "Agenda Pública",
  [`/${tenant}/dashboard/publico/leads`]: "Leads / Contatos",
  [`/${tenant}/dashboard/editar-site`]: "Editor Visual",
  [`/${tenant}/dashboard/eleitores`]: "Base Eleitoral",
  [`/${tenant}/dashboard/bairros`]: "Bairros",
  [`/${tenant}/dashboard/liderancas`]: "Lideranças",
  [`/${tenant}/dashboard/assessores`]: "Assessores",
  [`/${tenant}/dashboard/demandas`]: "Demandas",
  [`/${tenant}/dashboard/pesquisas`]: "Pesquisas",
  [`/${tenant}/dashboard/relatorios`]: "Relatórios",
  [`/${tenant}/dashboard/configuracoes`]: "Configurações",
  [`/${tenant}/dashboard/base-eleitoral`]: "Base Eleitoral",
  [`/${tenant}/dashboard/indicacoes`]: "Indicações",
  [`/${tenant}/dashboard/projetos-lei`]: "Projetos de Lei",
  [`/${tenant}/dashboard/leis-aprovadas`]: "Leis Aprovadas",
  [`/${tenant}/dashboard/publicacoes`]: "Publicações",
  [`/${tenant}/dashboard/mapa-eleitoral`]: "Mapa Eleitoral",
  [`/${tenant}/dashboard/mapa-politico`]: "Mapa Político",
})

export function TenantTopbar({ tenant }: { tenant: TenantData }) {
  const pathname = usePathname()
  const breadcrumbMap = getBreadcrumbMap(tenant.slug)
  
  // Find the most specific matching breadcrumb
  const currentPage = breadcrumbMap[pathname] 
    ?? Object.entries(breadcrumbMap).find(([key]) => pathname.startsWith(key))?.[1] 
    ?? "Dashboard"

  const primaryColor = tenant.primaryColor || "#0F2B5B"
  const secondaryColor = tenant.secondaryColor || "#0D9F6E"

  if (pathname.includes('/editar-site')) return null

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      {/* Logo mobile */}
      <div className="flex items-center gap-2 lg:hidden">
        {tenant.logoUrl ? (
          <Image
            src={tenant.logoUrl}
            alt={tenant.name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-cover"
          />
        ) : (
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {tenant.name[0]?.toUpperCase() || "M"}
          </div>
        )}
        <span className="text-[13px] font-bold text-foreground truncate max-w-[120px]">{tenant.name}</span>
      </div>

      {/* Breadcrumb — desktop */}
      <div className="hidden items-center gap-2 text-sm lg:flex">
        <span className="text-muted-foreground">{tenant.name}</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{currentPage}</span>
      </div>

      {/* Breadcrumb — mobile (página atual) */}
      <span className="ml-auto text-[13px] font-semibold text-foreground lg:hidden">{currentPage}</span>

      {/* Search — desktop */}
      <div className="ml-auto hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted/60 transition-colors md:flex">
        <Search className="h-3.5 w-3.5" />
        <span>Buscar eleitor...</span>
        <kbd className="ml-4 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </div>

      {/* Notifications */}
      <button
        className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label="Notificações"
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        <span
          className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: secondaryColor }}
        />
      </button>

      {/* Tenant picker — desktop */}
      <button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted transition-colors md:flex">
        <div
          className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          style={{ backgroundColor: secondaryColor }}
        >
          {tenant.name[0]?.toUpperCase() || "M"}
        </div>
        <span className="font-medium text-foreground max-w-[140px] truncate">{tenant.name}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
    </header>
  )
}
