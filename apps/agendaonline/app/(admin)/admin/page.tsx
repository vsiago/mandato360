import { getAdminMetrics } from "@/lib/actions/admin"
import { Users, CreditCard, UserPlus, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
    const metrics = await getAdminMetrics()

    const stats = [
        {
            title: "Total de Usuários",
            value: metrics.total,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-950/20",
            description: "Total de contas registradas"
        },
        {
            title: "Assinantes Pagantes",
            value: metrics.paid,
            icon: CreditCard,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-950/20",
            description: "Plano Profissional ou Premium"
        },
        {
            title: "Usuários Gratuitos",
            value: metrics.free,
            icon: UserPlus,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-950/20",
            description: "Plano Essencial ou Trial"
        }
    ]

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-stone-900 dark:text-white tracking-tight mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Visão Geral
                </h1>
                <p className="text-stone-500 dark:text-stone-400">Principais números da plataforma AgendaOnline.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon className={`h-7 w-7 ${stat.color}`} />
                            </div>
                            <div className="h-8 w-8 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center">
                                <TrendingUp className="h-4 w-4 text-stone-300" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest">{stat.title}</h3>
                            <p className="text-4xl font-black text-stone-900 dark:text-white tabular-nums">
                                {stat.value}
                            </p>
                        </div>
                        <p className="mt-4 text-xs text-stone-400 dark:text-stone-500 font-medium">{stat.description}</p>
                    </div>
                ))}
            </div>

            <div className="bg-linear-to-br from-stone-900 to-black rounded-3xl p-10 border border-stone-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <TrendingUp className="h-64 w-64 text-amber-500" />
                </div>
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Evolução do Negócio</h2>
                    <p className="text-stone-400 leading-relaxed">
                        Estamos monitorando o crescimento da base de usuários e a conversão para planos pagos. Continue focado na retenção e no valor entregue aos clientes.
                    </p>
                </div>
            </div>
        </div>
    )
}
