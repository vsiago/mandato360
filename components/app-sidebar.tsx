"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  LayoutDashboard,
  Users,
  MessageSquareText,
  FileText,
  FileCheck,
  Scale,
  Newspaper,
  Globe,
  BarChart3,
  Settings,
  MoreHorizontal,
  MapPin,
  Crown,
  UserCog,
  Map,
  PieChart,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { href: "/dashboard/eleitores", label: "Eleitores", shortLabel: "Eleitores", icon: Users },
  { href: "/dashboard/demandas", label: "Demandas da População", shortLabel: "Demandas", icon: MessageSquareText },
  { href: "/dashboard/assessores", label: "Assessores", shortLabel: "Equipe", icon: UserCog },
  { href: "/dashboard/mapa-politico", label: "Mapa Político", shortLabel: "Mapa", icon: Map },
  { href: "/dashboard/base-eleitoral", label: "Base Eleitoral", shortLabel: "Base", icon: PieChart },
  { href: "/dashboard/mapa-eleitoral", label: "Mapa Eleitoral", shortLabel: "Eleitoral", icon: MapPin },
  { href: "/dashboard/liderancas", label: "Lideranças", shortLabel: "Lideres", icon: Crown },
  { href: "/dashboard/projetos-lei", label: "Projetos de Lei", shortLabel: "Projetos", icon: FileText },
  { href: "/dashboard/indicacoes", label: "Indicações", shortLabel: "Indicações", icon: FileCheck },
  { href: "/dashboard/leis-aprovadas", label: "Leis Aprovadas", shortLabel: "Leis", icon: Scale },
  { href: "/dashboard/publicacoes", label: "Publicações do Mandato", shortLabel: "Posts", icon: Newspaper },
  { href: "/dashboard/landing-page", label: "Landing Page do Vereador", shortLabel: "Site", icon: Globe },
  { href: "/dashboard/relatorios", label: "Relatórios", shortLabel: "Relatórios", icon: BarChart3 },
  { href: "/dashboard/configuracoes", label: "Configurações", shortLabel: "Config", icon: Settings },
]

// Items shown in bottom bar (mobile) - first 4 + "Outros"
const MOBILE_VISIBLE_COUNT = 4
const mobileVisibleItems = menuItems.slice(0, MOBILE_VISIBLE_COUNT)
const mobileHiddenItems = menuItems.slice(MOBILE_VISIBLE_COUNT)

export function AppSidebar() {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if current page is in "Outros" menu
  const isOthersActive = mobileHiddenItems.some(
    (item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on route change
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
            <ul className="space-y-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                JS
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-foreground">Joao da Silva</p>
                <p className="text-xs text-muted-foreground">Vereador - PSD</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden safe-area-bottom select-none">
        <div className="flex h-16 items-stretch justify-around">
          {mobileVisibleItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-all duration-150",
                  "active:scale-95",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                  isActive && "bg-primary/10"
                )}>
                  <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
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
                isOthersActive || isDropdownOpen
                  ? "text-primary"
                  : "text-muted-foreground"
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
              <div className="absolute bottom-full right-0 mb-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-2 fade-in-0 duration-200">
                <div className="p-2">
                  {mobileHiddenItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground active:bg-muted"
                        )}
                      >
                        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
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
