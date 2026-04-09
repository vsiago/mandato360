"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  CalendarDays,
  MoreHorizontal,
  Sparkles,
  Scale,
  FileCheck,
  User,
  Palette,
  MapPin,
  Crown,
  UserCog,
  BarChart3,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TenantData {
  slug: string
  name: string
  primaryColor?: string | null
  secondaryColor?: string | null
}

export function TenantBottombar({ tenant }: { tenant: TenantData }) {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const primaryColor = tenant.primaryColor || "#0F2B5B"

  const mainItems = [
    { label: "Home", href: `/${tenant.slug}/dashboard`, icon: LayoutDashboard },
    { label: "Eleitores", href: `/${tenant.slug}/dashboard/eleitores`, icon: UserPlus },
    { label: "Demandas", href: `/${tenant.slug}/dashboard/demandas`, icon: ClipboardList },
    { label: "Agenda", href: `/${tenant.slug}/dashboard/publico/agenda`, icon: CalendarDays },
  ]

  const moreItems = [
    { label: "Hero & Destaques", href: `/${tenant.slug}/dashboard/publico/hero`, icon: Sparkles },
    { label: "Leis / Projetos", href: `/${tenant.slug}/dashboard/publico/leis`, icon: Scale },
    { label: "Indicações Leg.", href: `/${tenant.slug}/dashboard/publico/indicacoes`, icon: FileCheck },
    { label: "Quem Sou", href: `/${tenant.slug}/dashboard/publico/quem-sou`, icon: User },
    { label: "Leads / Contatos", href: `/${tenant.slug}/dashboard/publico/leads`, icon: UserPlus },
    { label: "Editar Site", href: `/${tenant.slug}/dashboard/editar-site`, icon: Palette },
    { label: "Bairros", href: `/${tenant.slug}/dashboard/bairros`, icon: MapPin },
    { label: "Lideranças", href: `/${tenant.slug}/dashboard/liderancas`, icon: Crown },
    { label: "Assessores", href: `/${tenant.slug}/dashboard/assessores`, icon: UserCog },
    { label: "Pesquisas", href: `/${tenant.slug}/dashboard/pesquisas`, icon: ClipboardList },
    { label: "Relatórios", href: `/${tenant.slug}/dashboard/relatorios`, icon: BarChart3 },
    { label: "Configurações", href: `/${tenant.slug}/dashboard/configuracoes`, icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === `/${tenant.slug}/dashboard`) return pathname === href
    return pathname.startsWith(href)
  }

  const isMoreActive = moreItems.some(item => isActive(item.href))

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
      {/* Overlay */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-border bg-card/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navegação do mandato"
      >
        {mainItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors select-none",
                active ? "" : "text-muted-foreground"
              )}
              style={active ? { color: primaryColor } : undefined}
            >
              {/* Active indicator pill */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-150",
                  active && "scale-110"
                )}
              />
              <span>{label}</span>
            </Link>
          )
        })}

        {/* "Mais" dropdown trigger */}
        <div className="relative flex flex-1" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors select-none",
              isMoreActive || isDropdownOpen ? "" : "text-muted-foreground"
            )}
            style={(isMoreActive || isDropdownOpen) ? { color: primaryColor } : undefined}
          >
            {(isMoreActive || isDropdownOpen) && (
              <span
                className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
            )}
            <MoreHorizontal
              className={cn(
                "h-5 w-5 transition-transform duration-150",
                (isMoreActive || isDropdownOpen) && "scale-110"
              )}
            />
            <span>Mais</span>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-60 max-h-80 overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-2 fade-in-0 duration-200">
              <div className="p-2">
                {moreItems.map((item) => {
                  const active = isActive(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-primary/10"
                          : "text-foreground active:bg-muted"
                      )}
                      style={active ? { color: primaryColor } : undefined}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0")} style={active ? { color: primaryColor } : undefined} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
