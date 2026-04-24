"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LayoutDashboard, Calendar, Scissors, Settings, LogOut, CreditCard, ImageIcon, HelpCircle, Globe, Sun, Moon, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NAV_ITEMS = [
    { href: "/painel", label: "Painel", icon: LayoutDashboard },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/servicos", label: "Serviços", icon: Scissors },
    { href: "/antes-depois", label: "Fotos", icon: ImageIcon },
]

const USER_DROPDOWN_ITEMS = [
    { href: "/assinatura", label: "Assinatura", icon: CreditCard },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
]

const CONTENT_ITEMS: { href: string; label: string; icon: any }[] = []

/* Bottom bar items (mobile) — subset of NAV_ITEMS for thumb-friendly access */
const BOTTOM_BAR_ITEMS = [
    { href: "/painel", label: "Início", icon: LayoutDashboard },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/servicos", label: "Serviços", icon: Scissors },
    { href: "/antes-depois", label: "Fotos", icon: ImageIcon },
]


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const { theme, setTheme } = useTheme()

    // Root users should always be in the admin area
    useEffect(() => {
        // console.log("DEBUG SESSION:", session)
        if (session?.user?.role === "root") {
            router.push("/admin")
        }
    }, [session, router])

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                }
            }
        })
    }

    const pageTitle = [...NAV_ITEMS, ...CONTENT_ITEMS, ...USER_DROPDOWN_ITEMS].find(i => i.href === pathname)?.label || "Painel"
    const isEditorPage = pathname === "/editar-site"

    if (isEditorPage) {
        return (
            <div className="min-h-screen bg-[#0f0f12] selection:bg-amber-100 selection:text-amber-900">
                {children}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F6F3ED] dark:bg-stone-950 selection:bg-amber-100 selection:text-amber-900">

            {/* ══════════════════════════════════════════════
                DESKTOP SIDEBAR — hidden on mobile
               ══════════════════════════════════════════════ */}
            <aside className={cn(
                "hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-stone-50/50 dark:bg-stone-950/50 border-r border-stone-200/60 dark:border-stone-800/60 transition-all duration-300",
                isEditorPage ? "w-16" : "w-64"
            )}>

                {/* Logo */}
                <div className={cn("h-16 flex items-center border-b border-stone-100 dark:border-stone-800/60", isEditorPage ? "px-0 justify-center" : "px-5")}>
                    <Link href="/painel" className="flex items-center gap-2.5">
                        <img
                            src={isEditorPage ? "/logo-agenda-online-icon.svg" : "/logo-agenda-online.svg"}
                            alt="Agenda Online"
                            className={cn("h-9 w-auto transition-all duration-300", isEditorPage ? "h-8" : "h-9")}
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={cn("flex-1 overflow-y-auto custom-scrollbar", isEditorPage ? "px-1.5 py-3" : "px-3 py-10")}>
                    {!isEditorPage && <p className="px-5 mb-5 text-[10px] font-bold text-stone-400/40 uppercase tracking-[0.25em]">Menu Principal</p>}
                    <div className="space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={item.label}
                                    className={cn(
                                        "group flex items-center rounded-2xl text-[14px] transition-all duration-300 relative",
                                        isEditorPage ? "justify-center py-3" : "gap-4 px-5 py-3.5",
                                        isActive
                                            ? "bg-stone-200/50 dark:bg-stone-800/25 text-stone-900 dark:text-stone-100 shadow-xs"
                                            : "text-stone-500/80 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-amber-500/10 hover:shadow-[inset_3px_0_0_rgba(251,191,36,0.3)]"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-4.5 w-4.5 transition-all duration-300 shrink-0",
                                        isActive ? "text-amber-500 dark:text-amber-400" : "text-stone-400/80 group-hover:text-stone-600 dark:group-hover:text-stone-300"
                                    )} />
                                    {!isEditorPage && <span className={cn("transition-colors", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>}
                                </Link>
                            )
                        })}

                        {/* Admin Link */}
                        {(session?.user?.role === "admin" || session?.user?.role === "superadmin") && (
                            <Link
                                href="/admin"
                                title="Administração"
                                className={cn(
                                    "group flex items-center rounded-2xl text-[14px] transition-all duration-300 relative mt-4",
                                    isEditorPage ? "justify-center py-3" : "gap-4 px-5 py-3.5",
                                    pathname.startsWith("/admin")
                                        ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 shadow-xs"
                                        : "text-stone-500/80 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-amber-500/10 hover:shadow-[inset_3px_0_0_rgba(251,191,36,0.3)]"
                                )}
                            >
                                <Shield className={cn(
                                    "h-4.5 w-4.5 transition-all duration-300 shrink-0",
                                    pathname.startsWith("/admin") ? "text-amber-500 dark:text-amber-400" : "text-stone-400/80 group-hover:text-stone-600 dark:group-hover:text-stone-300"
                                )} />
                                {!isEditorPage && <span className={cn("transition-colors", pathname.startsWith("/admin") ? "font-semibold" : "font-medium")}>Administração</span>}
                            </Link>
                        )}
                    </div>

                </nav>

                {/* Footer — Quiet UI "Editar Site" Button */}
                {!isEditorPage && (
                    <div className="p-4 mt-auto">
                        <Link href="/editar-site">
                            <button className="w-full group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-stone-200/60 dark:border-stone-800/60 bg-white/50 dark:bg-stone-900/50 text-sm font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/80 hover:text-foreground hover:border-amber-500/30 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4.5 w-4.5 text-stone-400 group-hover:text-amber-500 transition-colors" />
                                    <span>Editar Site</span>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors" />
                            </button>
                        </Link>
                    </div>
                )}
                {isEditorPage && (
                    <div className="p-3 mt-auto border-t border-stone-100 dark:border-stone-800/60">
                        <Link href="/painel" title="Voltar ao Painel"
                            className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                            <LogOut className="h-4.5 w-4.5" />
                        </Link>
                    </div>
                )}
            </aside>

            {/* ══════════════════════════════════════════════
                MAIN CONTENT AREA
               ══════════════════════════════════════════════ */}
            <div className={cn("flex flex-col min-h-screen pb-20 lg:pb-0 transition-all duration-300", isEditorPage ? "lg:ml-16" : "lg:ml-64")}>

                <header className="sticky top-0 z-20 bg-[#F6F3ED]/80 dark:bg-stone-950/60 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/40 h-16 px-5 flex items-center justify-between transition-colors shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]">
                    {/* Mobile logo + Page title */}
                    <div className="flex items-center gap-3">
                        <Link href="/painel" className="lg:hidden flex items-center gap-2">
                            <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-10 w-auto" />
                        </Link>
                        <h1 className="hidden lg:block text-sm font-semibold text-foreground">{pageTitle}</h1>
                    </div>

                    <div className="flex items-center gap-4">

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 px-3 py-1.5 outline-hidden group hover:bg-stone-200/40 dark:hover:bg-stone-800/30 rounded-lg transition-all cursor-pointer">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <p className="text-xs font-medium text-stone-600 dark:text-stone-300 leading-none truncate max-w-30">{session?.user?.name || "Usuário"}</p>
                                        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 leading-none truncate max-w-30">{session?.user?.email}</p>
                                    </div>
                                    <Avatar className="h-8 w-8 ring-1 ring-stone-200/60 dark:ring-stone-800/40">
                                        <AvatarFallback className="bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 text-[10px] font-bold">
                                            {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border-stone-200/40 dark:border-stone-800/60 shadow-xl dark:bg-stone-950 backdrop-blur-xl">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <p className="text-xs font-semibold text-foreground truncate">{session?.user?.name || "Usuário"}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {USER_DROPDOWN_ITEMS.map((item) => (
                                        <Link key={item.href} href={item.href}>
                                            <DropdownMenuItem className="gap-3 px-3 py-2 rounded-lg cursor-pointer">
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </DropdownMenuItem>
                                        </Link>
                                    ))}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <div className="p-1.5">
                                    <div className="flex p-1 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200/40 dark:border-stone-800/60 gap-1">
                                        <button
                                            onClick={() => setTheme("light")}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all cursor-pointer",
                                                theme === "light"
                                                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm ring-1 ring-stone-950/5 dark:ring-white/10"
                                                    : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                                            )}
                                        >
                                            <Sun className="h-3 w-3" />
                                            <span>Light</span>
                                        </button>
                                        <button
                                            onClick={() => setTheme("dark")}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all cursor-pointer",
                                                theme === "dark"
                                                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm ring-1 ring-stone-950/5 dark:ring-white/10"
                                                    : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                                            )}
                                        >
                                            <Moon className="h-3 w-3" />
                                            <span>Dark</span>
                                        </button>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 flex flex-col px-4 py-6 sm:px-6">
                    {children}
                </main>
            </div>

            {/* ══════════════════════════════════════════════
                MOBILE BOTTOM BAR — visible only on mobile/tablet
               ══════════════════════════════════════════════ */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-stone-950/80 backdrop-blur-2xl border-t border-stone-200/50 dark:border-stone-800/50 pb-safe shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-around h-18 px-4 pb-2 pt-1 gap-1">
                    {BOTTOM_BAR_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 w-18 h-13 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "text-amber-700 dark:text-amber-400 bg-linear-to-b from-stone-50/50 to-amber-50/80 dark:from-stone-900/40 dark:to-amber-900/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(251,191,36,0.15)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(251,191,36,0.1)]"
                                        : "text-stone-500/80 dark:text-stone-400/80 hover:bg-stone-100/50 dark:hover:bg-stone-900/50 hover:text-stone-700 dark:hover:text-stone-300"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-transform duration-300",
                                    isActive ? "scale-110 drop-shadow-sm" : "scale-100"
                                )} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={cn(
                                    "text-[10px] tracking-wide transition-all",
                                    isActive ? "font-bold opacity-100" : "font-medium opacity-80"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
