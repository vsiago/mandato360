"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  LayoutDashboard,
  ChevronDown,
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
  MoreHorizontal,
  Lock,
  Megaphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

interface MenuItem {
  href: string
  label: string
  shortLabel: string
  icon: any
}

interface MenuGroup {
  label: string
  icon: any
  items: MenuItem[]
}

function getMenuStructure(tenant: string): { home: MenuItem; groups: MenuGroup[]; settings: MenuItem } {
  return {
    home: { href: `/${tenant}/dashboard`, label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
    groups: [
      {
        label: "Público",
        icon: Megaphone,
        items: [
          { href: `/${tenant}/dashboard/publico/hero`, label: "Hero & Destaques", shortLabel: "Hero", icon: Sparkles },
          { href: `/${tenant}/dashboard/publico/leis`, label: "Leis / Projetos de Lei", shortLabel: "Leis", icon: Scale },
          { href: `/${tenant}/dashboard/publico/indicacoes`, label: "Indicações Legislativas", shortLabel: "Indicações", icon: FileCheck },
          { href: `/${tenant}/dashboard/publico/quem-sou`, label: "Quem Sou", shortLabel: "Perfil", icon: User },
          { href: `/${tenant}/dashboard/publico/agenda`, label: "Agenda Pública", shortLabel: "Agenda", icon: CalendarDays },
          { href: `/${tenant}/dashboard/publico/leads`, label: "Leads / Contatos", shortLabel: "Leads", icon: UserPlus },
          { href: `/${tenant}/dashboard/editar-site`, label: "Editar Site Visual", shortLabel: "Editor", icon: Palette },
        ],
      },
      {
        label: "Privado",
        icon: Lock,
        items: [
          { href: `/${tenant}/dashboard/bairros`, label: "Bairros", shortLabel: "Bairros", icon: MapPin },
          { href: `/${tenant}/dashboard/liderancas`, label: "Lideranças", shortLabel: "Líderes", icon: Crown },
          { href: `/${tenant}/dashboard/assessores`, label: "Assessores", shortLabel: "Equipe", icon: UserCog },
          { href: `/${tenant}/dashboard/pesquisas`, label: "Pesquisas", shortLabel: "Pesquisas", icon: ClipboardList },
          { href: `/${tenant}/dashboard/relatorios`, label: "Relatórios", shortLabel: "Relatórios", icon: BarChart3 },
        ],
      },
    ],
    settings: { href: `/${tenant}/dashboard/configuracoes`, label: "Configurações", shortLabel: "Config", icon: Settings },
  }
}

// Flatten for mobile
function getAllItems(tenant: string): MenuItem[] {
  const m = getMenuStructure(tenant)
  return [m.home, ...m.groups.flatMap(g => g.items), m.settings]
}

export function AppSidebar() {
  const pathname = usePathname()
  const params = useParams()
  const tenant = (params.tenant as string) || "vereador"
  const { data: session } = authClient.useSession()
  const menu = getMenuStructure(tenant)

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ "Público": true, "Privado": true })

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (href: string) => {
    if (href === `/${tenant}/dashboard`) return pathname === href
    return pathname.startsWith(href)
  }

  // Mobile
  const allItems = getAllItems(tenant)
  const MOBILE_VISIBLE_COUNT = 4
  const mobileVisibleItems = [allItems[0], allItems[1], allItems[2], allItems[allItems.length - 1]]
  const mobileHiddenItems = allItems.filter(item => !mobileVisibleItems.includes(item))

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isOthersActive = mobileHiddenItems.some(item => isActive(item.href))

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setIsDropdownOpen(false)
  }, [pathname])

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
            <Image
              src="/images/logo-mandato360.png"
              alt="Mandato360"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {/* Dashboard Home */}
            <Link
              href={menu.home.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-1",
                isActive(menu.home.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <LayoutDashboard className={cn("h-5 w-5 shrink-0", isActive(menu.home.href) && "text-primary")} />
              <span className="truncate">{menu.home.label}</span>
            </Link>

            {/* Groups */}
            {menu.groups.map((group) => {
              const GroupIcon = group.icon
              const isOpen = openGroups[group.label] !== false
              const hasActiveChild = group.items.some(item => isActive(item.href))

              return (
                <div key={group.label} className="mt-3">
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all",
                      hasActiveChild ? "text-primary" : "text-muted-foreground/70 hover:text-muted-foreground"
                    )}
                  >
                    <GroupIcon className="h-3.5 w-3.5" />
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                  </button>

                  <div className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <ul className="space-y-0.5 mt-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ml-1",
                                active
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <Icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-primary")} />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}

            {/* Settings */}
            <div className="mt-4 pt-3 border-t border-sidebar-border">
              <Link
                href={menu.settings.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive(menu.settings.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Settings className={cn("h-5 w-5 shrink-0", isActive(menu.settings.href) && "text-primary")} />
                <span className="truncate">{menu.settings.label}</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground uppercase">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-foreground">{session?.user?.name || 'Carregando...'}</p>
                <p className="text-xs text-muted-foreground uppercase">{(session?.user as any)?.role || 'Acesso'}</p>
              </div>
              <button 
                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login" } } })}
                className="text-xs text-red-500 hover:underline"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden safe-area-bottom select-none">
        <div className="flex h-16 items-stretch justify-around">
          {mobileVisibleItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-all duration-150",
                  "active:scale-95",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                  active && "bg-primary/10"
                )}>
                  <Icon className={cn("h-5 w-5", active && "text-primary")} />
                </div>
                <span className="truncate">{item.shortLabel}</span>
              </Link>
            )
          })}

          {/* "Outros" dropdown button */}
          <div className="relative flex flex-1" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-all duration-150",
                "active:scale-95",
                isOthersActive || isDropdownOpen ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                (isOthersActive || isDropdownOpen) && "bg-primary/10"
              )}>
                <MoreHorizontal className={cn("h-5 w-5", (isOthersActive || isDropdownOpen) && "text-primary")} />
              </div>
              <span>Outros</span>
            </button>

            {/* Dropdown menu - opens upward */}
            {isDropdownOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-56 max-h-80 overflow-y-auto overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-2 fade-in-0 duration-200">
                <div className="p-2">
                  {mobileHiddenItems.map((item) => {
                    const active = isActive(item.href)
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground active:bg-muted"
                        )}
                      >
                        <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay when dropdown is open */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  )
}
