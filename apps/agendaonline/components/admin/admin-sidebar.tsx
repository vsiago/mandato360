"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    LogOut, 
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Layout,
    Plug,
    BarChart3,
    Headset,
    Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const MENU_GROUPS = [
    {
        label: "SITE",
        items: [
            { title: "Templates", href: "/admin/templates", icon: Layout },
            { title: "Plugins", href: "/admin/plugins", icon: Plug },
        ]
    },
    {
        label: "GESTÃO",
        items: [
            { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { title: "Clientes", href: "/admin/clientes", icon: Users },
            { title: "Relatórios", href: "/admin/relatorios", icon: BarChart3 },
        ]
    },
    {
        label: "SISTEMA",
        items: [
            { title: "Configurações", href: "/admin/config", icon: Settings },
        ]
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-[#0c0c0e] border-r border-stone-800/40 w-72 transition-all duration-300">
            {/* Logo */}
            <div className="h-20 flex items-center px-8 border-b border-stone-800/20 group">
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform shrink-0">
                    <ShieldCheck className="h-6 w-6 text-black" />
                </div>
                <div className="ml-4">
                    <h1 className="text-xl font-bold text-white leading-none tracking-tight">Admin</h1>
                    <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mt-1">Painel Root</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar px-0 py-8">
                {MENU_GROUPS.map((group, groupIdx) => (
                    <div key={group.label} className={cn(groupIdx > 0 && "mt-10")}>
                        <p className="px-8 mb-4 text-[10px] font-bold text-stone-500/50 uppercase tracking-[0.2em]">
                            {group.label}
                        </p>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center text-[14px] transition-all duration-300 relative gap-4 px-8 py-3.5",
                                            isActive
                                                ? "text-amber-500 bg-linear-to-r from-amber-500/10 to-transparent border-l-2 border-amber-500"
                                                : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/20 border-l-2 border-transparent"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5 transition-all duration-300 shrink-0",
                                            isActive ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-stone-500 group-hover:text-stone-300"
                                        )} />
                                        <span className={cn(
                                            "transition-colors tracking-wide",
                                            isActive ? "font-semibold" : "font-medium"
                                        )}>
                                            {item.title}
                                        </span>
                                        
                                        {isActive && (
                                            <div className="absolute inset-0 bg-amber-500/5 blur-xl -z-10" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto p-6 border-t border-stone-800/40">
                <button
                    onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.href = "/login" } })}
                    className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl text-rose-500 hover:bg-rose-500/5 transition-all duration-300 group"
                >
                    <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Sair do Painel</span>
                </button>
                
                <div className="mt-4 p-4 rounded-2xl bg-stone-900/40 border border-stone-800/40">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-stone-300">Operacional</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

