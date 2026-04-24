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
    ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const MENU_ITEMS = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        title: "Clientes",
        icon: Users,
        href: "/admin/clientes",
    },
    {
        title: "Configurações",
        icon: Settings,
        href: "/admin/config",
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-72 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10 group">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-stone-900 dark:text-white leading-none tracking-tight">Admin</h1>
                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-1">Painel Root</p>
                    </div>
                </div>

                <nav className="space-y-1.5">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                                    isActive 
                                        ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold" 
                                        : "text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/50 hover:text-stone-900 dark:hover:text-stone-100"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-transform group-hover:scale-110",
                                    isActive ? "text-amber-600 dark:text-amber-400" : "text-stone-400 dark:text-stone-500"
                                )} />
                                <span className="flex-1 text-sm">{item.title}</span>
                                {isActive && (
                                    <ChevronRight className="h-4 w-4 opacity-50" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-stone-100 dark:border-stone-900">
                <button
                    onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.href = "/login" } })}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-rose-500 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all group"
                >
                    <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Sair do Painel</span>
                </button>
                
                <div className="mt-6 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Status do Sistema</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Operacional</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
