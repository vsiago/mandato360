"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LayoutDashboard, Calendar, Scissors, Settings, LogOut, CreditCard, ImageIcon, HelpCircle, Globe, Sun, Moon, ShieldCheck, Users, DollarSign, BarChart3, Star, Headset, ChevronRight, ChevronDown, Plug, Layout, Puzzle, Scale, Briefcase, FileText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { getMyTenant } from "@/lib/tenant-api"
import type { TenantData } from "@/lib/tenant-types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { convertDemoAccount } from "@/lib/actions/admin"
import { toast } from "sonner"

function buildNavGroups(segmento?: string) {
    const isAdvocacia = segmento === "advocacia"
    
    return [
        {
            label: "SITE",
            items: [
                { href: "/editar-site", label: "Editor de Site", icon: Globe },
            ]
        },
        {
            label: "GESTÃO",
            items: [
                { href: "/painel", label: "Painel", icon: BarChart3 },
                { href: "/agenda", label: "Agenda", icon: Calendar },
                { href: "/servicos", label: isAdvocacia ? "Áreas Jurídicas" : "Serviços", icon: isAdvocacia ? Scale : Scissors },
                { href: "/clientes", label: "Clientes", icon: Users },
                { href: "/financeiro", label: "Financeiro", icon: DollarSign },
                { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
            ]
        },
        {
            label: "CONTEÚDO",
            items: [
                { href: "/antes-depois", label: isAdvocacia ? "Portfólio de Casos" : "Fotos", icon: isAdvocacia ? Briefcase : ImageIcon },
                { href: "/depoimentos", label: "Depoimentos", icon: Star },
                { href: "/faq", label: "Perguntas (FAQ)", icon: HelpCircle },
            ]
        },
        {
            label: "SISTEMA",
            items: [
                { href: "/configuracoes", label: "Configurações", icon: Settings },
                { href: "/assinatura", label: "Assinatura", icon: CreditCard },
            ]
        }
    ]
}

const USER_DROPDOWN_ITEMS = [
    { href: "/assinatura", label: "Assinatura", icon: CreditCard },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
]

const CONTENT_ITEMS: { href: string; label: string; icon: any }[] = []

/* Bottom bar items (mobile) — subset of NAV_ITEMS for thumb-friendly access */
function buildBottomBarItems(segmento?: string) {
    const isAdvocacia = segmento === "advocacia"
    return [
        { href: "/painel", label: "Início", icon: LayoutDashboard },
        { href: "/agenda", label: "Agenda", icon: Calendar },
        { href: "/servicos", label: isAdvocacia ? "Jurídico" : "Serviços", icon: isAdvocacia ? Scale : Scissors },
        { href: "/antes-depois", label: isAdvocacia ? "Casos" : "Fotos", icon: isAdvocacia ? Briefcase : ImageIcon },
    ]
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const { theme, setTheme } = useTheme()
    const [tenant, setTenant] = useState<TenantData | null>(null)
    const [cachedBranding, setCachedBranding] = useState<{ logo: string; mini: string; title: string; primary: string; hover: string } | null>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Load branding from cache for immediate display
        const cached = localStorage.getItem("tenant_branding_cache")
        if (cached) {
            try {
                setCachedBranding(JSON.parse(cached))
            } catch (e) {}
        }
    }, [])

    useEffect(() => {
        getMyTenant().then((data) => {
            setTenant(data)
            if (data) {
                const branding = {
                    logo: data.logoUrl,
                    mini: data.logoMiniUrl || data.avatarUrl || data.logoUrl,
                    title: data.title || "Agenda Online",
                    primary: data.colors?.primary || "#F5CC70",
                    hover: data.colors?.hover || "#CA912A"
                }
                localStorage.setItem("tenant_branding_cache", JSON.stringify(branding))
                setCachedBranding(branding)
            }
        }).catch(() => {})
    }, [])

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

    // Modal state
    const [newEmail, setNewEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isConverting, setIsConverting] = useState(false)

    const handleConvert = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tenant?.id) return
        if (!newEmail || !newPassword) {
            toast.error("Por favor, preencha o e-mail e a senha.")
            return
        }

        setIsConverting(true)
        
        try {
            const res = await convertDemoAccount({
                email: newEmail,
                password: newPassword,
                tenantId: tenant.id
            })
            if (res.success) {
                toast.success("Conta atualizada com sucesso! Você agora é o dono oficial.")
                // Refresh data
                setTenant(prev => prev ? { ...prev, isDemo: false } : null)
                router.refresh()
            }
        } catch (err) {
            toast.error("Erro ao converter conta. Tente outro e-mail.")
        } finally {
            setIsConverting(false)
        }
    }

    const NAV_GROUPS = buildNavGroups(tenant?.segmento)
    const NAV_ITEMS = NAV_GROUPS.flatMap(group => group.items)
    const BOTTOM_BAR_ITEMS = buildBottomBarItems(tenant?.segmento)

    const pageTitle = [...NAV_ITEMS, ...CONTENT_ITEMS, ...USER_DROPDOWN_ITEMS].find(i => i.href === pathname)?.label || "Painel"
    const isEditorPage = pathname === "/editar-site"

    if (isEditorPage) {
        return (
            <div className="min-h-screen bg-[#0f0f12] selection:bg-amber-100 selection:text-amber-900">
                {children}
            </div>
        )
    }

    const accentColor = tenant?.colors?.primary || cachedBranding?.primary || "#F5CC70"
    const hoverColor = tenant?.colors?.hover || cachedBranding?.hover || "#CA912A"

    return (
        <div 
            className="min-h-screen bg-[#F6F3ED] dark:bg-stone-950 selection:bg-amber-100 selection:text-amber-900"
            style={{ 
                '--tenant-primary': accentColor,
                '--tenant-hover': hoverColor
            } as React.CSSProperties}
        >

            {/* ══════════════════════════════════════════════
                DESKTOP SIDEBAR — hidden on mobile
               ══════════════════════════════════════════════ */}
            <aside className={cn(
                "hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-[#0c0a09] border-r border-stone-800/40 transition-all duration-500 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}>
                {/* Collapse Toggle Button */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center shadow-xl z-50 hover:scale-110 hover:bg-stone-800 transition-all cursor-pointer group/toggle"
                >
                    <ChevronRight className={cn("w-3.5 h-3.5 text-stone-400 group-hover/toggle:text-brand-primary transition-transform duration-500", !isCollapsed && "rotate-180")} />
                </button>

                {/* Logo */}
                <div className={cn("h-20 flex items-center border-b border-stone-800/20 transition-all duration-500", isCollapsed ? "px-0 justify-center" : "px-6")}>
                    <Link href="/painel" className="flex items-center gap-2.5">
                        <img
                            src={(tenant?.logoUrl || cachedBranding?.logo)
                                ? (isCollapsed 
                                    ? (tenant?.logoMiniUrl || tenant?.avatarUrl || tenant?.logoUrl || cachedBranding?.mini) 
                                    : (tenant?.logoUrl || cachedBranding?.logo))
                                : (isCollapsed ? "/logo-agenda-online-icon.svg" : "/logo-agenda-online.svg")
                            }
                            alt={tenant?.title || cachedBranding?.title || "Agenda Online"}
                            className={cn("w-auto transition-all duration-500", isCollapsed ? "h-10 animate-in zoom-in-50" : "h-9", (tenant?.logoUrl || cachedBranding?.logo) && "object-contain")}
                        />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={cn("flex-1 overflow-y-auto custom-scrollbar transition-all duration-500", isCollapsed ? "px-0 py-4" : "px-0 py-6")}>
                    {NAV_GROUPS.map((group, groupIdx) => (
                        <div key={group.label} className={cn(groupIdx > 0 && "mt-8")}>
                            {!isCollapsed && (
                                <p className="px-6 mb-4 text-[10px] font-bold text-stone-500/50 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-2 duration-500">
                                    {group.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={isCollapsed ? item.label : undefined}
                                            className={cn(
                                                "group flex items-center text-[14px] transition-all duration-300 relative",
                                                isCollapsed ? "justify-center py-3.5 w-full" : "gap-4 px-6 py-3.5",
                                                isActive
                                                    ? "text-brand-primary bg-gradient-to-r from-brand-primary/10 to-transparent border-l-2 border-brand-primary"
                                                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/20 border-l-2 border-transparent"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-5 w-5 transition-all duration-300 shrink-0",
                                                isActive ? "text-brand-primary drop-shadow-[0_0_8px_var(--tenant-primary)]" : "text-stone-500 group-hover:text-stone-300"
                                            )} style={isActive ? { filter: `drop-shadow(0 0 8px ${accentColor}66)` } : {}} />
                                            {!isCollapsed && (
                                                <span className={cn(
                                                    "transition-colors tracking-wide animate-in fade-in slide-in-from-left-2 duration-500",
                                                    isActive ? "font-semibold" : "font-medium"
                                                )}>
                                                    {item.label}
                                                </span>
                                            )}

                                            {/* Active Glow Effect */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-brand-primary/5 blur-xl -z-10" />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Admin Link — Kept outside groups for prominence or can be added to PRINCIPAL */}
                    {(session?.user?.role === "admin" || session?.user?.role === "superadmin") && (
                        <div className="mt-1">
                            <Link
                                href="/admin"
                                title={isCollapsed ? "Administração" : undefined}
                                className={cn(
                                    "group flex items-center text-[14px] transition-all duration-300 relative",
                                    isCollapsed ? "justify-center py-3.5 w-full" : "gap-4 px-6 py-3.5",
                                    pathname.startsWith("/admin")
                                        ? "text-brand-primary bg-gradient-to-r from-brand-primary/10 to-transparent border-l-2 border-brand-primary"
                                        : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/20 border-l-2 border-transparent"
                                )}
                            >
                                <ShieldCheck className={cn(
                                    "h-5 w-5 transition-all duration-300 shrink-0",
                                    pathname.startsWith("/admin") ? "text-brand-primary" : "text-stone-500 group-hover:text-stone-300"
                                )} style={pathname.startsWith("/admin") ? { filter: `drop-shadow(0 0 8px ${accentColor}66)` } : {}} />
                                {!isCollapsed && <span className={cn("transition-colors tracking-wide animate-in fade-in slide-in-from-left-2 duration-500", pathname.startsWith("/admin") ? "font-semibold" : "font-medium")}>Administração</span>}
                                
                                {/* Active Glow Effect */}
                                {pathname.startsWith("/admin") && (
                                    <div className="absolute inset-0 bg-brand-primary/5 blur-xl -z-10" />
                                )}
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Footer Help Card */}
                {!isCollapsed && (
                    <div className="p-4 mt-auto border-t border-stone-800/20 animate-in fade-in duration-500">
                        <div className="p-4 rounded-2xl bg-stone-900/40 border border-stone-800/40 flex items-center gap-3 group cursor-pointer hover:bg-stone-900/60 transition-all duration-300">
                            <div className="h-10 w-10 rounded-xl bg-stone-800/50 flex items-center justify-center shrink-0 border border-stone-700/30">
                                <Headset className="h-5 w-5 text-stone-500 group-hover:text-brand-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-stone-200 truncate">Precisa de ajuda?</p>
                                <p className="text-[10px] text-stone-500 truncate">Acesse nossa central</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-stone-600 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                    </div>
                )}
                
                {isCollapsed && (
                    <div className="p-4 mt-auto border-t border-stone-800/20 flex justify-center">
                        <div className="h-10 w-10 rounded-xl bg-stone-800/50 flex items-center justify-center text-stone-500 hover:text-brand-primary hover:bg-stone-800 transition-all cursor-pointer">
                            <Headset className="h-5 w-5" />
                        </div>
                    </div>
                )}
                
                {isEditorPage && (
                    <div className="p-3 mt-auto border-t border-stone-800/40">
                        <Link href="/painel" title="Voltar ao Painel"
                            className="flex items-center justify-center py-3 rounded-xl text-stone-500 hover:bg-stone-800/40 hover:text-stone-200 transition-all">
                            <LogOut className="h-5 w-5" />
                        </Link>
                    </div>
                )}
            </aside>

            {/* ══════════════════════════════════════════════
                MAIN CONTENT AREA
               ══════════════════════════════════════════════ */}
            <div className={cn("flex flex-col min-h-screen pb-20 lg:pb-0 transition-all duration-500 ease-in-out", isCollapsed ? "lg:ml-20" : "lg:ml-64")}>

                <header className="sticky top-0 z-20 bg-[#F6F3ED]/80 dark:bg-stone-950/60 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/40 h-16 px-5 flex items-center justify-between transition-colors shadow-sm">
                    {/* Mobile logo + Page title */}
                    <div className="flex items-center gap-3">
                        <Link href="/painel" className="lg:hidden flex items-center gap-2">
                            <img 
                                src={tenant?.logoUrl || cachedBranding?.logo || "/logo-agenda-online.svg"} 
                                alt={tenant?.title || cachedBranding?.title || "Agenda Online"} 
                                className="h-10 w-auto object-contain" 
                            />
                        </Link>
                        <h1 className="hidden lg:block text-sm font-semibold text-foreground">{pageTitle}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {mounted && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 px-3 py-1.5 outline-hidden group hover:bg-stone-200/40 dark:hover:bg-stone-800/30 rounded-lg transition-all cursor-pointer">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <p className="text-xs font-medium text-stone-600 dark:text-stone-300 leading-none truncate max-w-30">{session?.user?.name || "Usuário"}</p>
                                            <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 leading-none truncate max-w-30">{session?.user?.email}</p>
                                        </div>
                                        <Avatar className="h-8 w-8 ring-1 ring-stone-200/60 dark:ring-stone-800/40">
                                            {(tenant?.founder?.imageUrl || session?.user?.image) && (
                                                <img 
                                                    src={tenant?.founder?.imageUrl || session?.user?.image || ""} 
                                                    alt={session?.user?.name || ""} 
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                            <AvatarFallback className="bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 text-[10px] font-bold">
                                                {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <ChevronDown className="h-3.5 w-3.5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-colors" />
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
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 flex flex-col px-4 pt-6 sm:px-6">
                    {/* Demo Warning Banner */}
                    {mounted && tenant?.isDemo && (
                        <div className="mb-6 animate-in slide-in-from-top-4 duration-700">
                            <div className="bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-sm group">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="h-5 w-5 text-stone-950" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                            Conta de Demonstração Ativa
                                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                        </h3>
                                        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed max-w-2xl">
                                            Este é um acesso temporário. Para garantir a segurança dos seus dados e do seu site, você <strong>precisa substituir</strong> o e-mail e a senha genéricos por dados oficiais nas configurações.
                                        </p>
                                        <div className="flex flex-wrap gap-3 mt-4">
                                            <Link href="/configuracoes">
                                                <button className="text-[11px] font-black uppercase tracking-widest bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer">
                                                    Configurar Conta Oficial
                                                </button>
                                            </Link>
                                            <Link href="/assinatura">
                                                <button className="text-[11px] font-black uppercase tracking-widest border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-stone-900 transition-all cursor-pointer">
                                                    Ativar Plano
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                                        ? "text-brand-secondary dark:text-brand-primary bg-gradient-to-b from-stone-50/50 to-brand-primary/10 dark:from-stone-900/40 dark:to-brand-primary/10 shadow-brand-primary/15 dark:shadow-brand-primary/10"
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
            {/* ══════════════════════════════════════════════
                MANDATORY CONVERSION MODAL
               ══════════════════════════════════════════════ */}
            {mounted && tenant?.isDemo && (
                <Dialog open={true} onOpenChange={() => {}}>
                    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-white dark:bg-stone-950 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="relative h-32 bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center overflow-hidden">
                            <ShieldCheck className="h-20 w-20 text-white/20 absolute -right-4 -bottom-4 rotate-12" />
                            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl relative z-10">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                                    Torne-se o Dono Oficial
                                </DialogTitle>
                                <DialogDescription className="text-stone-500 dark:text-stone-400 mt-2 text-sm leading-relaxed">
                                    Para continuar usando o painel, você precisa substituir o e-mail e a senha temporários por dados reais que só você tenha acesso.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleConvert} className="space-y-6 mt-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-stone-400">Seu Novo E-mail</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="ex: voce@email.com"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="h-12 rounded-xl bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-stone-400">Sua Nova Senha</Label>
                                        <Input 
                                            id="pass" 
                                            type="password" 
                                            placeholder="Mínimo 6 caracteres"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="h-12 rounded-xl bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isConverting}
                                    className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    {isConverting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                                            Salvando...
                                        </div>
                                    ) : (
                                        "Salvar e Começar Agora"
                                    )}
                                </Button>

                                <div className="pt-4 text-center">
                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                                        Ao salvar, sua conta deixará de ser demo.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
