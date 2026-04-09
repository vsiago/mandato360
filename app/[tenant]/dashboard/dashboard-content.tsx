"use client"

import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, Crown, FileCheck, Scale, MapPin, UserCog, CalendarDays, ClipboardList,
  TrendingUp, ArrowUpRight, Clock, Users
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts"
import { cn } from "@/lib/utils"

const FUNIL_LABELS: Record<string, string> = {
  novo: "Novos",
  contato: "Em Contato",
  engajado: "Engajados",
  apoiador: "Apoiadores",
  lideranca: "Lideranças",
  inativo: "Inativos",
}

const FUNIL_COLORS: Record<string, string> = {
  novo: "#3B82F6",
  contato: "#8B5CF6",
  engajado: "#0D9F6E",
  apoiador: "#10B981",
  lideranca: "#0F2B5B",
  inativo: "#94A3B8",
}

const STATUS_LABELS: Record<string, string> = {
  tramitando: "Tramitando",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  arquivado: "Arquivado",
  pendente: "Pendente",
  concluido: "Concluído",
}

const STATUS_COLORS: Record<string, string> = {
  tramitando: "#3B82F6",
  aprovado: "#10B981",
  rejeitado: "#EF4444",
  arquivado: "#94A3B8",
  pendente: "#8B5CF6",
  concluido: "#0D9F6E",
}

const AGENDA_TIPO_LABELS: Record<string, string> = {
  visita: "Visita",
  acao: "Ação",
  audiencia: "Audiência",
  reuniao: "Reunião",
  evento: "Evento",
  outro: "Outro",
}

interface DashboardContentProps {
  tenantName: string
  stats: {
    leads: number
    liderancas: number
    indicacoesLeg: number
    projetosTramitando: number
    bairros: number
    assessores: number
    agendas: number
    pesquisas: number
  }
  funilData: { funil: string; count: number }[]
  projetosChart: { status: string; count: number }[]
  agenda: any[]
  recentLeads: any[]
}

export function DashboardContent({ tenantName, stats, funilData, projetosChart, agenda, recentLeads }: DashboardContentProps) {
  const kpis = [
    { label: "Total de Leads", value: stats.leads, icon: UserPlus, delta: "+12%", sub: "vs. mês anterior", positive: true, cor: "bg-blue-50 text-blue-600" },
    { label: "Lideranças", value: stats.liderancas, icon: Crown, delta: String(stats.liderancas), sub: "cadastradas", positive: null, cor: "bg-violet-50 text-violet-600" },
    { label: "Indicações Leg.", value: stats.indicacoesLeg, icon: FileCheck, delta: String(stats.indicacoesLeg), sub: "registradas", positive: null, cor: "bg-secondary/10 text-secondary" },
    { label: "Projetos Tramitando", value: stats.projetosTramitando, icon: Scale, delta: String(stats.projetosTramitando), sub: "em andamento", positive: null, cor: "bg-cyan-50 text-cyan-600" },
    { label: "Bairros", value: stats.bairros, icon: MapPin, delta: String(stats.bairros), sub: "mapeados", positive: null, cor: "bg-emerald-50 text-emerald-600" },
    { label: "Assessores", value: stats.assessores, icon: UserCog, delta: String(stats.assessores), sub: "na equipe", positive: null, cor: "bg-indigo-50 text-indigo-600" },
    { label: "Eventos Agenda", value: stats.agendas, icon: CalendarDays, delta: String(stats.agendas), sub: "agendados", positive: null, cor: "bg-blue-50 text-blue-600" },
    { label: "Pesquisas", value: stats.pesquisas, icon: ClipboardList, delta: String(stats.pesquisas), sub: "realizadas", positive: null, cor: "bg-violet-50 text-violet-600" },
  ]

  const funilChartData = funilData.map(d => ({
    name: FUNIL_LABELS[d.funil] || d.funil,
    value: d.count,
    fill: FUNIL_COLORS[d.funil] || "#94A3B8",
  }))

  const projetosChartData = projetosChart.map(d => ({
    name: STATUS_LABELS[d.status] || d.status,
    value: d.count,
    fill: STATUS_COLORS[d.status] || "#94A3B8",
  }))

  const today = new Date()
  const dateStr = today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="flex flex-col gap-6">
      {/* Header — Pilar style */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground capitalize">{dateStr} — {tenantName}</p>
        </div>
        <Badge variant="outline" className="gap-1.5 border-secondary/40 bg-secondary/5 text-secondary text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
          Dados ao vivo
        </Badge>
      </div>

      {/* KPI Cards — Pilar grid layout */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                  <span className="text-2xl md:text-3xl font-bold text-foreground">{kpi.value}</span>
                </div>
                <div className={cn("flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg", kpi.cor)}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {kpi.positive !== null && (
                  kpi.positive
                    ? <ArrowUpRight className="h-3.5 w-3.5 text-secondary" />
                    : null
                )}
                <span className={cn(
                  "text-xs font-medium",
                  kpi.positive === true ? "text-secondary" : "text-muted-foreground"
                )}>
                  {kpi.positive !== null ? kpi.delta : ""}
                </span>
                <span className="text-xs text-muted-foreground">{kpi.sub}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Funil de Leads — Donut chart */}
        <div className="col-span-1 lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Funil de Leads
            </h2>
            <span className="text-xs text-muted-foreground">Distribuição</span>
          </div>
          {funilChartData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={180} className="md:max-w-[50%]">
                <PieChart>
                  <Pie
                    data={funilChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {funilChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1 w-full">
                {funilChartData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
              <UserPlus className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">Nenhum lead cadastrado</p>
              <p className="text-xs">Comece adicionando contatos</p>
            </div>
          )}
        </div>

        {/* Projetos por Status — Vertical bar */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Scale className="h-4 w-4 text-violet-600" />
              Projetos Legislativos
            </h2>
          </div>
          {projetosChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={projetosChartData} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: "#4B5C72" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                    {projetosChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-col gap-1.5">
                {projetosChartData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
              <Scale className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">Nenhum projeto cadastrado</p>
              <p className="text-xs">Adicione projetos de lei e indicações</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Agenda + Recent Leads */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Agenda */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              Próximos Eventos
            </h2>
            <a href="#" className="flex items-center gap-1 text-xs text-secondary hover:underline">
              Ver tudo <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {agenda.length > 0 ? (
            <div className="flex flex-col gap-1">
              {agenda.map((event: any) => (
                <div key={event.id} className="flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-blue-50 text-center shrink-0">
                    <span className="text-[9px] font-bold text-blue-600 uppercase leading-none">
                      {new Date(event.dataEvento).toLocaleDateString("pt-BR", { month: "short" })}
                    </span>
                    <span className="text-sm font-black text-blue-700 leading-none">
                      {new Date(event.dataEvento).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{event.titulo}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.local || "Local não definido"}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold shrink-0">
                    {AGENDA_TIPO_LABELS[event.tipo] || event.tipo}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[160px] text-muted-foreground">
              <CalendarDays className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">Nenhum evento agendado</p>
              <p className="text-xs">Adicione eventos na Agenda Pública</p>
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
              Leads Recentes
            </h2>
            <a href="#" className="flex items-center gap-1 text-xs text-secondary hover:underline">
              Ver tudo <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {recentLeads.length > 0 ? (
            <div className="flex flex-col gap-1">
              {recentLeads.map((l: any) => (
                <div key={l.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-[11px] font-bold text-secondary uppercase shrink-0">
                    {l.nome?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{l.nome}</p>
                    <p className="text-xs text-muted-foreground">{l.telefone || l.email || "Sem contato"}</p>
                  </div>
                  <Badge
                    className="text-[10px] font-bold shrink-0"
                    style={{
                      backgroundColor: `${FUNIL_COLORS[l.funil] || "#94A3B8"}15`,
                      color: FUNIL_COLORS[l.funil] || "#94A3B8",
                      borderColor: `${FUNIL_COLORS[l.funil] || "#94A3B8"}30`
                    }}
                    variant="outline"
                  >
                    {FUNIL_LABELS[l.funil] || l.funil}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[160px] text-muted-foreground">
              <UserPlus className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">Nenhum lead recente</p>
              <p className="text-xs">Leads aparecerão aqui quando capturados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
