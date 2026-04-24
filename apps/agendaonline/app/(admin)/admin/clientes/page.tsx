"use client"

import { useEffect, useState } from "react"
import { getAllClients, deleteClient } from "@/lib/actions/admin"
import { 
    Search, 
    MoreHorizontal, 
    Mail, 
    Calendar, 
    Trash2, 
    Edit, 
    Shield, 
    User,
    CheckCircle2,
    XCircle,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

export default function AdminClientes() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchClients()
    }, [])

    async function fetchClients() {
        try {
            const data = await getAllClients()
            setClients(data)
        } catch (err) {
            toast.error("Erro ao carregar clientes")
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja deletar este cliente? Esta ação é irreversível.")) return
        
        try {
            await deleteClient(id)
            toast.success("Cliente deletado com sucesso")
            fetchClients()
        } catch (err) {
            toast.error("Erro ao deletar cliente")
        }
    }

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Gestão de Clientes
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400">Visualize e gerencie todos os usuários da plataforma.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <Input 
                            placeholder="Buscar por nome ou e-mail..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-12 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-2xl"
                        />
                    </div>
                    
                    <Link href="/admin/novo">
                        <Button className="h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/20 gap-2 shrink-0">
                            <Plus className="h-5 w-5" />
                            <span className="hidden sm:inline">Novo Inquilino</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                                <th className="px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">Cliente</th>
                                <th className="px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest">Cadastro</th>
                                <th className="px-6 py-4 text-xs font-black text-stone-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-6 h-20 bg-stone-50/20" />
                                    </tr>
                                ))
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-stone-400">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            ) : filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 font-bold border border-stone-200 dark:border-stone-700">
                                                {client.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-900 dark:text-white leading-none mb-1">{client.name}</p>
                                                <p className="text-xs text-stone-400 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {client.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {client.emailVerified ? (
                                            <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full w-fit">
                                                <CheckCircle2 className="h-3 w-3" /> Verificado
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full w-fit">
                                                <XCircle className="h-3 w-3" /> Pendente
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-xs font-black uppercase tracking-tighter px-2 py-1 rounded-md w-fit",
                                            client.role === 'root' ? "bg-amber-500 text-black" : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
                                        )}>
                                            {client.role === 'root' && <Shield className="h-3 w-3" />}
                                            {client.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400 tabular-nums">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 opacity-40" />
                                            {format(new Date(client.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 transition-all">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDelete(client.id)}
                                                className="h-9 w-9 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
