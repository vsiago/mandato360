"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  Scale,
  FileCheck,
  User,
  CalendarDays,
  UserPlus,
  Palette,
  MapPin,
  Crown,
  UserCog,
  ClipboardList,
  BarChart3,
  Settings,
  Megaphone,
  Lock,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

interface TenantData {
  slug: string
  name: string
  primaryColor?: string | null
  secondaryColor?: string | null
  logoUrl?: string | null
  fotoPerfilUrl?: string | null
}

interface MenuItem {
  href: string
  label: string
  icon: any
}

interface MenuGroup {
  label: string
  icon: any
  items: MenuItem[]
}

function getMenuStructure(tenant: string): { home: MenuItem; groups: MenuGroup[]; settings: MenuItem } {
  return {
    home: { href: `/${tenant}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    groups: [
      {
        label: "Público",
        icon: Megaphone,
        items: [
          { href: `/${tenant}/dashboard/publico/hero`, label: "Hero & Destaques", icon: Sparkles },
          { href: `/${tenant}/dashboard/publico/leis`, label: "Leis / Projetos", icon: Scale },
          { href: `/${tenant}/dashboard/publico/indicacoes`, label: "Indicações Leg.", icon: FileCheck },
          { href: `/${tenant}/dashboard/publico/quem-sou`, label: "Quem Sou", icon: User },
          { href: `/${tenant}/dashboard/publico/agenda`, label: "Agenda Pública", icon: CalendarDays },
          { href: `/${tenant}/dashboard/publico/leads`, label: "Leads / Contatos", icon: UserPlus },
          { href: `/${tenant}/dashboard/editar-site`, label: "Editar Site", icon: Palette },
        ],
      },
      {
        label: "Privado",
        icon: Lock,
        items: [
          { href: `/${tenant}/dashboard/eleitores`, label: "Base Eleitoral", icon: UserPlus },
          { href: `/${tenant}/dashboard/bairros`, label: "Bairros", icon: MapPin },
          { href: `/${tenant}/dashboard/liderancas`, label: "Lideranças", icon: Crown },
          { href: `/${tenant}/dashboard/assessores`, label: "Assessores", icon: UserCog },
          { href: `/${tenant}/dashboard/demandas`, label: "Demandas", icon: ClipboardList },
          { href: `/${tenant}/dashboard/pesquisas`, label: "Pesquisas", icon: ClipboardList },
          { href: `/${tenant}/dashboard/relatorios`, label: "Relatórios", icon: BarChart3 },
        ],
      },
    ],
    settings: { href: `/${tenant}/dashboard/configuracoes`, label: "Configurações", icon: Settings },
  }
}

export function TenantSidebar({ tenant }: { tenant: TenantData }) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const [collapsed, setCollapsed] = useState(() => pathname.includes('/editar-site'))
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "Público": true, "Privado": true })

  useEffect(() => {
    if (pathname.includes('/editar-site')) {
      setCollapsed(true)
    }
  }, [pathname])

  const menu = getMenuStructure(tenant.slug)
  const primaryColor = tenant.primaryColor || "#0F2B5B"
  const secondaryColor = tenant.secondaryColor || "#0D9F6E"

  const isActive = (href: string) => {
    if (href === `/${tenant.slug}/dashboard`) return pathname === href
    return pathname.startsWith(href)
  }

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside
      className={cn(
        "relative hidden flex-col border-r border-white/10 transition-all duration-300 lg:flex",
        collapsed ? "w-[68px]" : "w-[220px]"
      )}
      style={{ backgroundColor: primaryColor }}
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b border-white/10 px-4 py-4", collapsed && "justify-center px-0")}>
        {!collapsed ? (
          tenant.logoUrl ? (
            <Image
              src={tenant.logoUrl}
              alt={tenant.name}
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          ) : (
            <span className="text-sm font-bold text-white truncate">{tenant.name}</span>
          )
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: secondaryColor }}
          >
            {tenant.name[0]?.toUpperCase() || "M"}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-4 scrollbar-quiet" aria-label="Navegação do mandato">
        {/* Home */}
        <Link
          href={menu.home.href}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
            isActive(menu.home.href)
              ? "bg-white/10 text-white"
              : "text-white/55 hover:bg-white/[0.08] hover:text-white/90",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? menu.home.label : undefined}
        >
          <LayoutDashboard
            className={cn(
              "shrink-0 transition-colors",
              isActive(menu.home.href) ? "" : "text-white/40 group-hover:text-white/70",
              collapsed ? "h-5 w-5" : "h-4 w-4"
            )}
            style={isActive(menu.home.href) ? { color: secondaryColor } : undefined}
          />
          {!collapsed && <span>{menu.home.label}</span>}
          {isActive(menu.home.href) && !collapsed && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
          )}
        </Link>

        {/* Groups */}
        {menu.groups.map((group) => {
          const GroupIcon = group.icon
          const isOpen = openGroups[group.label] !== false
          const hasActiveChild = group.items.some(item => isActive(item.href))

          return (
            <div key={group.label} className="mt-2">
              {!collapsed ? (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                    hasActiveChild ? "text-white/70" : "text-white/30 hover:text-white/50"
                  )}
                >
                  <GroupIcon className="h-3 w-3" />
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>
              ) : (
                <div className="my-1.5 mx-3 h-px bg-white/10" />
              )}

              <div className={cn(
                "overflow-hidden transition-all duration-200",
                !collapsed && !isOpen ? "max-h-0 opacity-0" : "max-h-[600px] opacity-100"
              )}>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/55 hover:bg-white/[0.08] hover:text-white/90",
                        collapsed && "justify-center px-0"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "shrink-0 transition-colors",
                          active ? "" : "text-white/40 group-hover:text-white/70",
                          collapsed ? "h-5 w-5" : "h-4 w-4"
                        )}
                        style={active ? { color: secondaryColor } : undefined}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {active && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 px-2 py-3 flex flex-col gap-0.5">
        <Link
          href={menu.settings.href}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-all hover:bg-white/[0.08] hover:text-white/80",
            collapsed && "justify-center px-0",
            isActive(menu.settings.href) && "bg-white/10 text-white"
          )}
          title={collapsed ? "Configurações" : undefined}
        >
          <Settings
            className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")}
            style={isActive(menu.settings.href) ? { color: secondaryColor } : { color: "rgba(255,255,255,0.3)" }}
          />
          {!collapsed && <span>Configurações</span>}
        </Link>

        {/* User */}
        {!collapsed && (
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: secondaryColor }}
            >
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-white/80">{session?.user?.name || "Carregando..."}</p>
              <p className="truncate text-[10px] text-white/40">{tenant.name}</p>
            </div>
            <button
              onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login" } } })}
              className="text-white/30 hover:text-white/60 transition-colors"
              title="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground transition-colors z-50"
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
