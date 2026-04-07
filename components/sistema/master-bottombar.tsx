"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Mandatos", href: "/master/tenants", icon: Building2 },
  { label: "Usuários", href: "/master/users", icon: Users },
  { label: "Configurações", href: "/master/settings", icon: Settings },
]

export function MasterBottomBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-border bg-card/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegação do sistema"
    >
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
            )}
            <Icon
              className={cn(
                "h-5 w-5 transition-transform duration-150",
                isActive && "scale-110"
              )}
            />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
