"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
    Search, 
    Filter, 
    Hash, 
    User, 
    Calendar, 
    Clock, 
    Briefcase, 
    Scale, 
    Video, 
    Banknote, 
    MoreVertical, 
    ChevronRight,
    ArrowUpDown,
    Download,
    FileText,
    ExternalLink,
    Info,
    CheckCircle2,
    Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAppointmentsByTenantAction } from "@/lib/actions/appointments"
import { getMyTenant } from "@/lib/tenant-api"
import { AppointmentDetailsModal } from "@/components/CompleteAppointmentModal"
import { AppointmentModal } from "@/components/AppointmentModal"
import { getServicesAction } from "@/lib/actions/services"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ProcessosPage() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [services, setServices] = useState<any[]>([])
    const [tenant, setTenant] = useState<any>(null)
    const [activeTime, setActiveTime] = useState("09:00")

    useEffect(() => {
        async function loadData() {
            try {
                const tenantRes = await getMyTenant()
                if (tenantRes) {
                    setTenant(tenantRes)
                    const [aptRes, srvRes] = await Promise.all([
                        getAppointmentsByTenantAction(tenantRes.id),
                        getServicesAction(tenantRes.id)
                    ])
                    
                    if (aptRes.success) setAppointments(aptRes.appointments)
                    if (srvRes.success) setServices(srvRes.services)
                }
            } catch (error) {
                console.error("Error loading processes:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const processedData = useMemo(() => {
        return appointments.map(apt => {
            let details: any = {}
            try {
                if (apt.notes && apt.notes.startsWith('{')) {
                    details = JSON.parse(apt.notes)
                }
            } catch (e) {}

            return {
                ...apt,
                name: apt.name || "Cliente sem nome",
                details,
                mode: details.mode || 'standard',
                processNumber: details.processNumber || '-',
                nbNumber: details.nbNumber || '-',
                natureza: details.naturezaCausa || details.description || '-',
                titulo: details.titulo || apt.name || "Sem título"
            }
        })
    }, [appointments])

    const filteredData = useMemo(() => {
        return processedData.filter(item => {
            const matchesSearch = 
                (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (item.processNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (item.nbNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                (item.natureza?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
            
            const matchesType = typeFilter === "all" || item.mode === typeFilter
            
            return matchesSearch && matchesType
        })
    }, [processedData, searchTerm, typeFilter])

    const getIconForMode = (mode: string) => {
        switch(mode) {
            case 'audiencia': return <Scale className="h-4 w-4 text-blue-400" />
            case 'diligencia': return <Briefcase className="h-4 w-4 text-amber-500" />
            case 'reuniao': return <Video className="h-4 w-4 text-emerald-400" />
            case 'financeiro': return <Banknote className="h-4 w-4 text-brand-gold" />
            default: return <User className="h-4 w-4 text-brand-primary" />
        }
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-stone-950">
                <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-stone-950 min-h-screen">
            {/* Header Area */}
            <div className="p-8 border-b border-white/5 space-y-6 bg-stone-950/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                                <FileText className="h-6 w-6 text-brand-primary" />
                            </div>
                            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Gestão de Processos
                            </h1>
                        </div>
                        <p className="text-stone-500 text-sm font-medium">Visualize e gerencie toda a sua carteira jurídica em um só lugar.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-12 px-6 rounded-2xl bg-brand-primary text-stone-950 font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-brand-primary/20 gap-2"
                        >
                            <Plus className="h-4 w-4" /> Novo Processo
                        </Button>
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/5 bg-stone-900/50 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-all gap-2">
                            <Download className="h-4 w-4" /> Exportar Planilha
                        </Button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                        <Input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14 bg-stone-900/40 border-white/5 rounded-2xl text-sm font-bold placeholder:text-stone-700" 
                            placeholder="Buscar por cliente, processo ou NB..." 
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {[
                            { id: "all", label: "Todos", icon: FileText },
                            { id: "standard", label: "Consultas", icon: User },
                            { id: "audiencia", label: "Audiências", icon: Scale },
                            { id: "diligencia", label: "Diligências", icon: Briefcase },
                            { id: "reuniao", label: "Reuniões", icon: Video },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setTypeFilter(filter.id)}
                                className={cn(
                                    "flex items-center gap-2 px-6 h-14 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all shrink-0",
                                    typeFilter === filter.id 
                                        ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5" 
                                        : "bg-stone-900/40 border-white/5 text-stone-500 hover:border-white/10"
                                )}
                            >
                                <filter.icon className="h-3.5 w-3.5" />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 p-8">
                <div className="bg-stone-900/20 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-sm shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-stone-900/40">
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">Cliente <ArrowUpDown className="h-3 w-3" /></div>
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 uppercase tracking-widest">Tipo / Natureza</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 uppercase tracking-widest">Processo / ID</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 uppercase tracking-widest">Último Andamento</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredData.length > 0 ? filteredData.map((item) => (
                                    <tr 
                                        key={item.id} 
                                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => { setSelectedAppointment(item); setIsDetailsOpen(true); }}
                                    >
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-stone-950 border border-white/5 flex items-center justify-center text-xs font-bold text-stone-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">{item.name}</p>
                                                    <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest">{item.phone || 'Sem Telefone'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                {getIconForMode(item.mode)}
                                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.mode}</span>
                                            </div>
                                            <p className="text-xs font-bold text-stone-200 line-clamp-1">{item.natureza}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Badge variant="outline" className="h-5 px-1.5 bg-stone-950 border-white/10 text-[9px] font-black text-stone-500">PROC</Badge>
                                                    <span className="text-xs font-bold text-stone-300 tracking-tight">{item.processNumber}</span>
                                                </div>
                                                {item.nbNumber !== '-' && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Badge variant="outline" className="h-5 px-1.5 bg-amber-500/5 border-amber-500/20 text-[9px] font-black text-amber-500">NB/ID</Badge>
                                                        <span className="text-xs font-bold text-amber-100/60 tracking-tight">{item.nbNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="h-3.5 w-3.5 text-stone-600" />
                                                <span className="text-xs font-bold text-stone-300">
                                                    {format(parseISO(item.date), "dd 'de' MMM", { locale: ptBR })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-stone-600" />
                                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{item.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/5 transition-all">
                                                <MoreVertical className="h-4 w-4 text-stone-600" />
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-16 w-16 rounded-3xl bg-stone-900 flex items-center justify-center border border-white/5">
                                                    <Search className="h-8 w-8 text-stone-700" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-stone-500">Nenhum processo encontrado</p>
                                                    <p className="text-xs text-stone-700">Tente ajustar seus filtros ou busca.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedAppointment && (
                <AppointmentDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    appointment={selectedAppointment}
                    onComplete={() => { 
                        setIsDetailsOpen(false); 
                    }}
                />
            )}

            <AppointmentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                date={format(new Date(), 'yyyy-MM-dd')}
                time={activeTime}
                tenantId={tenant?.id || ""}
                services={services}
                onSuccess={() => {
                    setIsAddModalOpen(false);
                    // Reload data
                    if (tenant?.id) {
                        getAppointmentsByTenantAction(tenant.id).then(res => {
                            if (res.success) setAppointments(res.appointments)
                        })
                    }
                }}
                segmento={tenant?.segmento}
            />
        </div>
    )
}
