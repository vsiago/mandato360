"use client"

import * as React from "react"
import { Users, Search, Filter, Plus, Mail, Phone, Calendar, MoreHorizontal, User, CheckCircle2, ChevronRight, MessageCircle, ExternalLink, ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getCustomersAction } from "@/lib/actions/customers"
import { getMyTenant } from "@/lib/tenant-api"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function ClientesPage() {
    const [loading, setLoading] = React.useState(true)
    const [customers, setCustomers] = React.useState<any[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [tenantId, setTenantId] = React.useState<string | null>(null)
    const [tenant, setTenant] = React.useState<any>(null)

    React.useEffect(() => {
        async function loadData() {
            try {
                const t = await getMyTenant()
                if (t?.id) {
                    setTenant(t)
                    setTenantId(t.id)
                    const res = await getCustomersAction(t.id)
                    if (res.success) {
                        setCustomers(res.customers || [])
                    }
                }
            } catch (error) {
                console.error("Error loading customers:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
    )

    const stats = [
        { label: "Total de Clientes", value: customers.length, icon: Users, accent: "text-brand-primary bg-brand-primary/10", trend: `+${customers.length}%` },
        { label: "Novos este mês", value: customers.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length, icon: Plus, accent: "text-emerald-500 bg-emerald-500/10", trend: "Novos" },
        { label: "Ativos", value: customers.length, icon: CheckCircle2, accent: "text-amber-500 bg-amber-500/10", trend: "100%" },
    ]

    // Skeleton Components
    const HeaderSkeleton = () => (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2 lg:px-0">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-10 w-48 rounded-xl" />
                <Skeleton className="h-4 w-64 rounded-lg" />
            </div>
            <Skeleton className="w-full lg:w-40 h-10 lg:h-12 rounded-xl" />
        </div>
    )

    const StatsSkeleton = () => (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className={cn(
                    "bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl p-4 lg:p-6 shadow-xl h-[100px] lg:h-[140px] flex flex-col justify-between",
                    i === 3 && "col-span-2 lg:col-span-1"
                )}>
                    <div className="flex justify-between">
                        <Skeleton className="h-11 w-11 rounded-xl" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-16 rounded" />
                        <Skeleton className="h-3 w-24 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )

    const FiltersSkeleton = () => (
        <div className="flex flex-col lg:flex-row gap-3 items-center">
            <Skeleton className="flex-1 w-full h-12 lg:h-14 rounded-2xl" />
            <Skeleton className="w-full lg:w-32 h-12 lg:h-14 rounded-2xl" />
        </div>
    )

    const ListSkeleton = () => (
        <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl overflow-hidden shadow-2xl flex flex-col divide-y divide-stone-100 dark:divide-white/[0.03]">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 lg:p-5 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48 rounded" />
                        <Skeleton className="h-3 w-32 rounded" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <Skeleton className="h-10 w-10 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    )

    const TipSkeleton = () => (
        <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-5 lg:p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-64 rounded" />
            </div>
            <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
    )

    return (
        <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 animate-in fade-in duration-500">
            {/* ── Header ── */}
            {loading ? <HeaderSkeleton /> : (
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-1 lg:mb-2 lg:px-0">
                    <div className="flex-1">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Clientes
                        </h2>
                        <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">
                            Gerencie sua base de contatos e histórico de atendimentos.
                        </p>
                    </div>
                    
                    <Button className="w-full lg:w-auto text-white rounded-xl px-6 h-10 lg:h-12 font-bold flex items-center justify-center gap-2 transition-all bg-brand-gold text-[11px] lg:text-sm">
                        <Plus className="h-4 w-4 lg:h-5 lg:w-5" /> Novo Cliente
                    </Button>
                </div>
            )}

            {/* ── Stats Grid ── */}
            {loading ? <StatsSkeleton /> : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className={cn(
                            "bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col justify-between min-h-[100px] lg:min-h-[140px]",
                            i === 2 && "col-span-2 lg:col-span-1" // Mobile full width for the 3rd one
                        )}>
                            <div className="flex items-start justify-between">
                                <div className={cn("h-9 w-9 lg:h-11 lg:w-11 rounded-xl flex items-center justify-center border border-stone-100 dark:border-white/5 shadow-inner", stat.accent)}>
                                    <stat.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <div className="text-xl lg:text-2xl font-black text-stone-900 dark:text-white mt-3 leading-none">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Filters & Search ── */}
            {loading ? <FiltersSkeleton /> : (
                <div className="flex flex-col lg:flex-row gap-3 items-center px-0 lg:px-0">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 group-focus-within:text-brand-primary transition-colors" />
                        <Input 
                            placeholder="Buscar por nome, email ou telefone..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900/40 backdrop-blur-md border-stone-200 dark:border-white/[0.03] text-stone-900 dark:text-white rounded-2xl pl-12 h-12 lg:h-14 text-sm lg:text-base focus-visible:ring-brand-primary/20 transition-all shadow-lg" 
                        />
                    </div>
                    <Button variant="outline" className="w-full lg:w-auto h-12 lg:h-14 px-6 rounded-2xl border-stone-200 dark:border-white/[0.03] bg-white dark:bg-stone-900/40 backdrop-blur-md text-stone-500 dark:text-stone-400 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-center gap-2 transition-all shadow-sm">
                        <Filter className="h-4 w-4" /> Filtros
                    </Button>
                </div>
            )}

            {/* ── Customers List ── */}
            {loading ? <ListSkeleton /> : (
                <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                    {filteredCustomers.length > 0 ? (
                        <div className="divide-y divide-stone-100 dark:divide-white/[0.03]">
                            {filteredCustomers.map((customer) => (
                                <div key={customer.id} className="group hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-all p-4 lg:p-5 flex items-center gap-4 cursor-pointer">
                                    {/* Avatar */}
                                    <div className="h-12 w-12 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform">
                                        {customer.image ? (
                                            <img src={customer.image} alt={customer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-black text-stone-500 dark:text-stone-400">
                                                {customer.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm lg:text-base font-bold text-stone-900 dark:text-white group-hover:text-brand-primary transition-colors truncate">
                                            {customer.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            {customer.phone && (
                                                <div className="flex items-center gap-1.5 text-stone-500 text-[11px] lg:text-xs">
                                                    <Phone className="h-3 w-3" /> {customer.phone}
                                                </div>
                                            )}
                                            {customer.email && (
                                                <div className="hidden sm:flex items-center gap-1.5 text-stone-500 text-[11px] lg:text-xs">
                                                    <Mail className="h-3 w-3" /> {customer.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <a 
                                            href={customer.phone ? `https://wa.me/${customer.phone.replace(/\D/g, '')}` : '#'} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="h-10 w-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </a>
                                        <button className="h-10 w-10 rounded-xl bg-stone-50 dark:bg-white/[0.03] border border-stone-200 dark:border-white/10 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-white transition-all">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* ── Empty State ── */
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                            <div className="h-20 w-20 rounded-[2.5rem] bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                                <Users className="h-10 w-10 text-stone-300 dark:text-stone-700" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Sua lista está vazia
                            </h3>
                            <p className="text-sm text-stone-400 dark:text-stone-500 max-w-xs mx-auto mb-8">
                                {searchQuery 
                                    ? "Nenhum cliente encontrado para sua busca." 
                                    : "Os clientes que agendarem pelo seu site aparecerão aqui automaticamente."}
                            </p>
                            {!searchQuery && (
                                <Button className="bg-brand-gold text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-gold/10">
                                    Adicionar Primeiro Cliente
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {/* ── Tip Card ── */}
            {loading ? <TipSkeleton /> : (
                <div className="bg-white dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-white/[0.03] p-5 lg:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
                    <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                        <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-6 w-6 lg:h-7 lg:w-7 text-brand-primary" />
                        </div>
                        <div>
                            <h4 className="text-sm lg:text-base font-bold text-stone-900 dark:text-white leading-tight">Privacidade e Segurança</h4>
                            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Sua base de dados é criptografada e protegida conforme a LGPD.</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto h-11 lg:h-12 px-6 rounded-xl border-stone-200 dark:border-white/5 text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-white/5 font-bold text-[11px] lg:text-xs">
                        Saiba Mais
                    </Button>
                </div>
            )}
        </div>
    )
}
