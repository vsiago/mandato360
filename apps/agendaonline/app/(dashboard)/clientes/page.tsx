"use client"

import * as React from "react"
import { Users, Search, Filter, Plus, Mail, Phone, Calendar, MoreHorizontal, User, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getCustomersAction } from "@/lib/actions/customers"
import { getMyTenant } from "@/lib/tenant-api"
import { Skeleton } from "@/components/ui/skeleton"

export default function ClientesPage() {
    const [loading, setLoading] = React.useState(true)
    const [customers, setCustomers] = React.useState<any[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [tenantId, setTenantId] = React.useState<string | null>(null)

    React.useEffect(() => {
        async function loadData() {
            try {
                const tenant = await getMyTenant()
                if (tenant?.id) {
                    setTenantId(tenant.id)
                    const res = await getCustomersAction(tenant.id)
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
        { label: "Total de Clientes", value: customers.length, icon: Users, trend: `+${customers.length}%` },
        { label: "Novos este mês", value: customers.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length, icon: Plus, trend: "Novos" },
        { label: "Ativos", value: customers.length, icon: CheckCircle2, trend: "100%" },
    ]

    return (
        <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Clientes
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie sua base de clientes e histórico de atendimentos.
                    </p>
                </div>
                <Button className="btn-gold-solid rounded-xl px-6 h-11 font-bold shadow-lg shadow-amber-500/10">
                    <Plus className="h-4 w-4 mr-2" /> Novo Cliente
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-card rounded-2xl border border-stone-200/60 dark:border-stone-800/60 shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md">
                        <div className="h-10 w-10 rounded-xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center shrink-0 border border-stone-200/20 dark:border-stone-800/40">
                            <stat.icon className="h-5 w-5 text-stone-500" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{stat.trend}</span>
                            </div>
                            <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por nome, email ou telefone..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-card border-stone-200/60 dark:border-stone-800/60 focus:ring-amber-500/20" 
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="h-12 px-5 rounded-xl border-stone-200/60 dark:border-stone-800/60 bg-card">
                        <Filter className="h-4 w-4 mr-2" /> Filtros
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                </div>
            ) : filteredCustomers.length > 0 ? (
                <div className="bg-card rounded-2xl border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200/60 dark:border-stone-800/60">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Cliente</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Contato</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Aniversário</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Cadastro</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200/40 dark:border-stone-800/40 flex items-center justify-center text-xs font-bold text-stone-500">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-foreground">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {customer.phone && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Phone className="h-3 w-3" /> {customer.phone}
                                                    </div>
                                                )}
                                                {customer.email && (
                                                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                                                        <Mail className="h-3 w-3" /> {customer.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                                                {customer.birthday ? new Date(customer.birthday).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '—'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] text-stone-500 font-medium">
                                                {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-stone-400 hover:text-foreground">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-stone-200/60 dark:border-stone-800/60 overflow-hidden">
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="h-20 w-20 bg-stone-50 dark:bg-stone-900 rounded-3xl flex items-center justify-center mb-6 border border-stone-200/20 dark:border-stone-800/40">
                            <Users className="h-10 w-10 text-stone-300 dark:text-stone-700" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                            {searchQuery ? "Nenhum resultado encontrado" : "Sua lista está vazia"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed">
                            {searchQuery 
                                ? "Tente buscar por outro termo ou limpe os filtros." 
                                : "Os clientes que agendarem pelo seu site aparecerão aqui automaticamente. Você também pode adicioná-los manualmente."}
                        </p>
                        {!searchQuery && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                <Button className="w-full sm:w-auto btn-gold-solid rounded-xl h-11 px-8 font-bold">
                                    Adicionar Primeiro Cliente
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
