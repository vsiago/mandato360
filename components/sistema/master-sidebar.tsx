"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  ShieldCheck,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Gestão de Mandatos", href: "/master/tenants", icon: Building2 },
  { label: "Usuários Globais", href: "/master/users", icon: Users },
]

export function MasterSidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative hidden flex-col border-r border-border bg-primary transition-all duration-300 lg:flex min-h-screen",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b border-white/10 px-6 py-5", collapsed && "justify-center px-0")}>
        {!collapsed ? (
            <div className="flex items-center gap-2">
                <div className="bg-secondary p-1.5 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-secondary-foreground" />
                </div>
                <span className="text-white font-outfit font-black text-xl uppercase tracking-tighter">
                    MANDATO<span className="text-secondary font-medium">360</span>
                </span>
            </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-bold">
            M
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-6" aria-label="Navegação Master">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-white/50 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-secondary" : "text-white/30 group-hover:text-white/60",
                  collapsed ? "h-6 w-6" : "h-5 w-5"
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
      <div className="border-t border-white/10 px-3 py-4 flex flex-col gap-1">
        <Link
          href="/master/settings"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-white/50 transition-all hover:bg-white/5 hover:text-white",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Configurações" : undefined}
        >
          <Settings className={cn("shrink-0 text-white/30", collapsed ? "h-6 w-6" : "h-5 w-5")} />
          {!collapsed && <span>Configurações</span>}
        </Link>

        {/* User Card */}
        {!collapsed ? (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-secondary-foreground shadow-inner">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white mb-0.5">{user?.name || 'Admin'}</p>
                    <p className="truncate text-[10px] uppercase tracking-wider font-black text-white/30">Super Admin</p>
                </div>
            </div>
        ) : (
            <div className="mt-4 flex justify-center">
                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-secondary-foreground">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
            </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm hover:scale-110 transition-all z-50"
        aria-label={collapsed ? "Expandir" : "Recolher"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
