"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Kanban,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  { label: "Visão Geral", href: "/sistema", icon: LayoutDashboard },
  { label: "Pipeline", href: "/sistema/pipeline", icon: Kanban },
  { label: "Inbox", href: "/sistema/inbox", icon: MessageSquare },
  { label: "Agenda", href: "/sistema/agenda", icon: CalendarDays },
  { label: "Métricas", href: "/sistema/metricas", icon: BarChart3 },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative hidden flex-col border-r border-white/10 bg-primary transition-all duration-300 lg:flex",
        collapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b border-white/10 px-4 py-4", collapsed && "justify-center px-0")}>
        {!collapsed ? (
          <Image
            src="/images/logo-branca.png"
            alt="Pilar Saúde"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-xs font-bold">
            P
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-4" aria-label="Navegação do sistema">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/8 hover:text-white/90",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-secondary" : "text-white/40 group-hover:text-white/70",
                  collapsed ? "h-5 w-5" : "h-4 w-4"
                )}
              />
              {!collapsed && <span>{label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-secondary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 px-2 py-3 flex flex-col gap-0.5">
        <Link
          href="/sistema/configuracoes"
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-all hover:bg-white/8 hover:text-white/80",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Configurações" : undefined}
        >
          <Settings className={cn("shrink-0 text-white/30", collapsed ? "h-5 w-5" : "h-4 w-4")} />
          {!collapsed && <span>Configurações</span>}
        </Link>

        {/* User */}
        {!collapsed && (
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground">
              C
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-white/80">Clínica Demo</p>
              <p className="truncate text-[10px] text-white/40">clinica@demo.com.br</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground transition-colors"
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
