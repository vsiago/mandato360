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
    Plus,
    LayoutGrid,
    List,
    LayoutTemplate
} from "lucide-react"
import { 
    DndContext, 
    DragOverlay, 
    closestCorners, 
    KeyboardSensor, 
    PointerSensor, 
    useSensor, 
    useSensors,
    DragStartEvent,
    DragEndEvent,
    TouchSensor
} from "@dnd-kit/core"
import { 
    arrayMove, 
    SortableContext, 
    sortableKeyboardCoordinates, 
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LEGAL_STATUSES, mapStatusToLegal } from "@/lib/utils/process-utils"
import { updateAppointmentAction } from "@/lib/actions/appointments"
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
import { useRouter } from "next/navigation"

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
    const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const router = useRouter()

    useEffect(() => {
        async function loadData() {
            try {
                const tenantRes = await getMyTenant()
                if (tenantRes) {
                    if (tenantRes.segmento !== "advocacia") {
                        router.push("/painel")
                        return
                    }
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
    }, [router])

    const processedData = useMemo(() => {
        return [...appointments]
            .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return dateB - dateA
            })
            .map(apt => {
                let details: any = {}
                try {
                    if (apt.notes && apt.notes.startsWith('{')) {
                        details = JSON.parse(apt.notes)
                    }
                } catch (e) {}

                return {
                    ...apt,
                    name: apt.customerName || "Cliente sem nome",
                    phone: apt.customerPhone || "Sem telefone",
                    details,
                    mode: details.mode || 'standard',
                    processNumber: details.processNumber || '-',
                    nbNumber: details.nbNumber || '-',
                    natureza: details.naturezaCausa || details.description || '-',
                    titulo: details.titulo || apt.customerName || "Sem título",
                    legalStatus: mapStatusToLegal(apt.status)
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

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const activeItem = filteredData.find(item => item.id === active.id)
        
        // Determinar a coluna de destino (pode ser o ID da coluna ou o ID de um card dentro dela)
        let overColumnId = over.id as string
        const isColumn = LEGAL_STATUSES.some(s => s.id === overColumnId)
        
        if (!isColumn) {
            // Se soltou em cima de um card, pegamos a coluna desse card
            const overItem = filteredData.find(item => item.id === over.id)
            if (overItem) {
                overColumnId = overItem.legalStatus
            }
        }

        if (activeItem && activeItem.legalStatus !== overColumnId && overColumnId) {
            // Guardar estado anterior para rollback
            const previousAppointments = [...appointments]

            // 1. Atualização Otimista Instantânea (UI)
            setAppointments(prev => prev.map(apt => {
                if (apt.id === active.id) {
                    let updatedNotes = apt.notes
                    try {
                        const parsed = JSON.parse(apt.notes || "{}")
                        parsed.status = overColumnId // Sincroniza o status no JSON
                        updatedNotes = JSON.stringify(parsed)
                    } catch (e) {}
                    
                    return { ...apt, status: overColumnId, notes: updatedNotes }
                }
                return apt
            }))

            // 2. Sincronização em Background (API)
            if (tenant?.id) {
                try {
                    // Preparar os dados para o servidor
                    let serverNotes = activeItem.notes
                    try {
                        const parsed = JSON.parse(serverNotes || "{}")
                        parsed.status = overColumnId
                        serverNotes = JSON.stringify(parsed)
                    } catch (e) {}

                    const result = await updateAppointmentAction(activeItem.id, tenant.id, {
                        status: overColumnId,
                        notes: serverNotes
                    })
                    
                    if (!result.success) {
                        // Rollback em caso de erro do servidor
                        setAppointments(previousAppointments)
                        toast.error("Erro ao sincronizar status. O card retornou.")
                    }
                } catch (error) {
                    // Rollback em caso de erro de rede
                    setAppointments(previousAppointments)
                    toast.error("Erro de conexão. Tente novamente.")
                }
            }
        }
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-stone-50 dark:bg-stone-950">
                <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full" />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-transparent">
            {/* Header Area */}
            <div className="py-5 sm:py-6 lg:py-5 border-b border-stone-200 dark:border-white/5 space-y-4 bg-white/80 dark:bg-stone-950/50 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                                <Scale className="h-4 w-4 text-brand-primary" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">
                                Gestão de Processos
                            </h1>
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium max-w-md">
                            Visualize e gerencie toda a sua carteira jurídica em um só lugar.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-1 rounded-2xl border border-stone-200 dark:border-white/5 mr-2">
                            <Button
                                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('table')}
                                className={cn("h-8 rounded-lg px-3 gap-2", viewMode === 'table' ? "bg-white dark:bg-stone-800 shadow-sm" : "text-stone-500")}
                            >
                                <List className="h-3.5 w-3.5" /> <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-widest">Lista</span>
                            </Button>
                            <Button
                                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('kanban')}
                                className={cn("h-8 rounded-lg px-3 gap-2", viewMode === 'kanban' ? "bg-white dark:bg-stone-800 shadow-sm" : "text-stone-500")}
                            >
                                <LayoutGrid className="h-3.5 w-3.5" /> <span className="hidden sm:inline font-bold text-[10px] uppercase tracking-widest">Quadro</span>
                            </Button>
                        </div>
                        <Button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex-1 md:flex-none h-9 px-4 rounded-lg bg-brand-primary text-white font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20 gap-2"
                        >
                            <Plus className="h-3.5 w-3.5" /> <span className="sm:inline">Novo Processo</span><span className="sm:hidden">Novo</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="flex-1 md:flex-none h-9 px-4 rounded-lg border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900/50 text-stone-600 dark:text-white font-bold text-[10px] uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-800 transition-all gap-2"
                        >
                            <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Exportar Planilha</span><span className="sm:hidden">Exportar</span>
                        </Button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-600 group-focus-within:text-brand-primary transition-colors" />
                        <Input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 sm:h-14 bg-white dark:bg-stone-900/40 border-stone-200 dark:border-white/5 rounded-2xl text-stone-900 dark:text-white text-sm font-bold placeholder:text-stone-400 dark:placeholder:text-stone-700 shadow-sm" 
                            placeholder="Buscar por cliente, processo ou NB..." 
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide px-1">
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
                                    "flex items-center gap-2 px-4 sm:px-6 h-11 sm:h-14 rounded-2xl border font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all shrink-0",
                                    typeFilter === filter.id 
                                        ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary shadow-lg shadow-brand-primary/5" 
                                        : "bg-white dark:bg-stone-900/40 border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-500 hover:border-stone-300 dark:hover:border-white/10 shadow-sm"
                                )}
                            >
                                <filter.icon className="h-3.5 w-3.5" />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List/Table/Kanban Area */}
            <div className="flex-1 py-4 sm:py-6 lg:py-4 overflow-hidden flex flex-col">
                {viewMode === 'table' ? (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block bg-white dark:bg-stone-900/20 border border-stone-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stone-100 dark:border-white/5 bg-stone-50 dark:bg-stone-900/40">
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">Cliente <ArrowUpDown className="h-3 w-3" /></div>
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest">Tipo / Natureza</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest">Processo / ID</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest">Último Andamento</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                                {filteredData.length > 0 ? filteredData.map((item) => (
                                    <tr 
                                        key={item.id} 
                                        className="group hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => { setSelectedAppointment(item); setIsDetailsOpen(true); }}
                                    >
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                                                    {item.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-brand-primary transition-colors">{item.name}</p>
                                                    <p className="text-[10px] text-stone-500 dark:text-stone-600 font-bold uppercase tracking-widest">{item.phone || 'Sem Telefone'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                {getIconForMode(item.mode)}
                                                <span className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">{item.mode}</span>
                                            </div>
                                            <p className="text-xs font-bold text-stone-700 dark:text-stone-200 line-clamp-1">{item.natureza}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Badge variant="outline" className="h-5 px-1.5 bg-stone-100 dark:bg-stone-950 border-stone-200 dark:border-white/10 text-[9px] font-black text-stone-600 dark:text-stone-500">PROC</Badge>
                                                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300 tracking-tight">{item.processNumber}</span>
                                                </div>
                                                {item.nbNumber !== '-' && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Badge variant="outline" className="h-5 px-1.5 bg-amber-500/5 border-amber-500/20 text-[9px] font-black text-amber-500">NB/ID</Badge>
                                                        <span className="text-xs font-bold text-amber-700/80 dark:text-amber-100/60 tracking-tight">{item.nbNumber}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar className="h-3.5 w-3.5 text-stone-400 dark:text-stone-600" />
                                                <span className="text-xs font-bold text-stone-600 dark:text-stone-300">
                                                    {format(parseISO(item.date), "dd 'de' MMM", { locale: ptBR })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-stone-400 dark:text-stone-600" />
                                                <span className="text-[10px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest">{item.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-stone-100 dark:hover:bg-white/5 transition-all">
                                                <MoreVertical className="h-4 w-4 text-stone-400 dark:text-stone-600" />
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center">
                                            <EmptyState />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {filteredData.length > 0 ? filteredData.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => { setSelectedAppointment(item); setIsDetailsOpen(true); }}
                            className="bg-white dark:bg-stone-900/40 border border-stone-200 dark:border-white/5 rounded-3xl p-5 space-y-4 active:scale-[0.98] transition-all shadow-sm dark:shadow-xl"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-500">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-stone-900 dark:text-white line-clamp-1">{item.name}</p>
                                        <p className="text-[9px] text-stone-500 dark:text-stone-600 font-bold uppercase tracking-widest">{item.phone || 'Sem Telefone'}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-stone-100 dark:hover:bg-white/5">
                                    <MoreVertical className="h-4 w-4 text-stone-400 dark:text-stone-600" />
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-100 dark:border-white/[0.03]">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {getIconForMode(item.mode)}
                                        <span className="text-[9px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest">{item.mode}</span>
                                    </div>
                                    <p className="text-xs font-bold text-stone-700 dark:text-stone-200 line-clamp-1">{item.natureza}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5 mb-1">
                                        <Calendar className="h-3 w-3 text-stone-400 dark:text-stone-600" />
                                        <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
                                            {format(parseISO(item.date), "dd/MM/yy", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Clock className="h-3 w-3 text-stone-400 dark:text-stone-600" />
                                        <span className="text-[10px] font-black text-stone-500 dark:text-stone-500 uppercase tracking-widest">{item.time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-950/50 px-2.5 py-1.5 rounded-xl border border-stone-100 dark:border-white/5">
                                    <span className="text-[8px] font-black text-stone-500 dark:text-stone-600 uppercase tracking-tighter">PROC</span>
                                    <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400">{item.processNumber}</span>
                                </div>
                                {item.nbNumber !== '-' && (
                                    <div className="flex items-center gap-1.5 bg-amber-500/5 px-2.5 py-1.5 rounded-xl border border-amber-500/10">
                                        <span className="text-[8px] font-black text-amber-600 uppercase tracking-tighter">NB</span>
                                        <span className="text-[10px] font-bold text-amber-700/60 dark:text-amber-200/60">{item.nbNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 px-6 bg-white dark:bg-stone-900/20 border border-stone-200 dark:border-white/5 rounded-3xl shadow-sm">
                            <EmptyState />
                        </div>
                    )}
                </div>
            </>
        ) : (
                    <div className="flex-1 overflow-hidden">
                        <KanbanBoard 
                            data={filteredData} 
                            sensors={sensors}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                            activeId={activeId}
                            onCardClick={(item) => { setSelectedAppointment(item); setIsDetailsOpen(true); }}
                        />
                    </div>
                )}
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

function KanbanBoard({ data, sensors, handleDragStart, handleDragEnd, activeId, onCardClick }: any) {
    const activeItem = data.find((item: any) => item.id === activeId)

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full gap-3 overflow-x-auto pb-4 scrollbar-hide px-1 pt-1">
                {LEGAL_STATUSES.map((status) => (
                    <KanbanColumn
                        key={status.id}
                        id={status.id}
                        title={status.label}
                        count={data.filter((item: any) => item.legalStatus === status.id).length}
                        color={status.color}
                        bgColor={status.bgColor}
                        borderColor={status.borderColor}
                    >
                        <SortableContext
                            items={data.filter((item: any) => item.legalStatus === status.id).map((i: any) => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2 min-h-[150px]">
                                {data
                                    .filter((item: any) => item.legalStatus === status.id)
                                    .map((item: any) => (
                                        <SortableCard 
                                            key={item.id} 
                                            item={item} 
                                            onClick={() => onCardClick(item)} 
                                        />
                                    ))}
                            </div>
                        </SortableContext>
                    </KanbanColumn>
                ))}
            </div>

            <DragOverlay dropAnimation={null}>
                {activeId ? (
                    <KanbanCard item={activeItem} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

function KanbanColumn({ id, title, count, children, color, bgColor, borderColor }: any) {
    const { setNodeRef } = useSortable({ id })

    return (
        <div 
            ref={setNodeRef}
            className="flex-none w-64 sm:w-72 flex flex-col h-full bg-stone-100/50 dark:bg-stone-900/30 border border-stone-200 dark:border-white/5 rounded-2xl overflow-hidden"
        >
            <div className="p-3 border-b border-stone-200 dark:border-white/5 flex items-center justify-between bg-white/40 dark:bg-stone-900/40 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", color.replace('text-', 'bg-'))} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900 dark:text-white">{title}</h3>
                </div>
                <Badge variant="outline" className={cn("h-5 px-2 text-[10px] font-bold border-none", bgColor, color)}>
                    {count}
                </Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {children}
            </div>
        </div>
    )
}

function SortableCard({ item, onClick }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
            <KanbanCard item={item} />
        </div>
    )
}

function KanbanCard({ item, isOverlay }: any) {
    if (!item) return null

    const statusInfo = LEGAL_STATUSES.find(s => s.id === item.legalStatus) || LEGAL_STATUSES[0]
    
    // Explicit mapping to ensure Tailwind compiler picks up these classes
    const ledColors: Record<string, string> = {
        triagem: "bg-blue-500",
        protocolo: "bg-amber-500",
        instrucao: "bg-purple-500",
        concluso: "bg-emerald-500",
        finalizado: "bg-stone-500"
    }
    const ledColor = ledColors[statusInfo.id] || "bg-blue-500"

    return (
        <div className={cn(
            "relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-xl p-3 shadow-sm space-y-2.5 cursor-grab active:cursor-grabbing hover:border-brand-primary/40 transition-all overflow-hidden",
            isOverlay && "shadow-2xl border-brand-primary ring-2 ring-brand-primary/20 rotate-2 scale-105"
        )}>
            {/* Status LED Bar */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", ledColor)} />
            
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="h-8 w-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-white/5">
                            {item.name.charAt(0).toUpperCase()}
                        </div>
                        {/* Pulsing LED */}
                        <div className={cn("absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-stone-900 animate-pulse", ledColor)} />
                    </div>
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                            <p className="text-[11px] font-bold text-stone-900 dark:text-white truncate">{item.name}</p>
                        </div>
                        <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest">{item.time}</p>
                    </div>
                </div>
                <Badge variant="outline" className={cn("h-4 px-1.5 border-none text-[8px] font-black uppercase tracking-widest", statusInfo.bgColor, statusInfo.color)}>
                    {item.mode.toUpperCase()}
                </Badge>
            </div>

            <div className="space-y-1.5 pl-1">
                <p className="text-[10px] font-bold text-stone-700 dark:text-stone-300 line-clamp-1">{item.natureza}</p>
                <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3 text-stone-400" />
                    <span className="text-[9px] font-bold text-stone-500">{item.processNumber}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-white/5 pl-1">
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-stone-400" />
                    <span className="text-[9px] font-bold text-stone-500">{format(parseISO(item.date), "dd/MM/yy")}</span>
                </div>
                <Button variant="ghost" className="h-6 w-6 p-0 rounded-lg">
                    <MoreVertical className="h-3 w-3 text-stone-400" />
                </Button>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center border border-stone-200 dark:border-white/5">
                <Search className="h-8 w-8 text-stone-400 dark:text-stone-700" />
            </div>
            <div>
                <p className="text-sm font-bold text-stone-600 dark:text-stone-500">Nenhum processo encontrado</p>
                <p className="text-xs text-stone-400 dark:text-stone-700">Tente ajustar seus filtros ou busca.</p>
            </div>
        </div>
    )
}
