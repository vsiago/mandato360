"use client"

import { usePathname } from "next/navigation"
import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const breadcrumbMap: Record<string, string> = {
  "/sistema": "Visão Geral",
  "/sistema/pipeline": "Pipeline de Pacientes",
  "/sistema/inbox": "Inbox Centralizado",
  "/sistema/agenda": "Agenda",
  "/sistema/metricas": "Métricas",
}

export function DashboardTopbar() {
  const pathname = usePathname()
  const currentPage = breadcrumbMap[pathname] ?? "Sistema"

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      {/* Logo mobile — aparece onde o hamburger ficava antes */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
          P
        </div>
        <span className="text-[13px] font-bold text-foreground">Pilar Sistema</span>
      </div>

      {/* Breadcrumb — desktop */}
      <div className="hidden items-center gap-2 text-sm lg:flex">
        <span className="text-muted-foreground">Sistema</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium text-foreground">{currentPage}</span>
      </div>

      {/* Breadcrumb — mobile (página atual) */}
      <span className="ml-auto text-[13px] font-semibold text-foreground lg:hidden">{currentPage}</span>

      {/* Search — desktop */}
      <div className="ml-auto hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground md:flex">
        <Search className="h-3.5 w-3.5" />
        <span>Buscar paciente...</span>
        <kbd className="ml-4 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </div>

      {/* Notifications */}
      <button
        className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label="Notificações"
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-secondary" />
      </button>

      {/* Clinic picker — desktop */}
      <button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted transition-colors md:flex">
        <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-secondary-foreground">C</div>
        <span className="font-medium text-foreground">Clínica Demo</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
    </header>
  )
}
