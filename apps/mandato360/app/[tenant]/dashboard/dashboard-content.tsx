"use client"

import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, Crown, CalendarDays, ClipboardList,
  TrendingUp, ArrowUpRight, Users, Scale, Sparkles
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

/* ── Custom Tooltip ── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-lg px-3 py-2 shadow-xl">
      <p className="text-[11px] font-semibold text-foreground">{payload[0]?.name || label}</p>
      <p className="text-xs text-muted-foreground">{payload[0]?.value} registros</p>
    </div>
  )
}

export function DashboardContent({ tenantName, stats, funilData, projetosChart, agenda, recentLeads }: DashboardContentProps) {
  const kpis = [
    { label: "Eleitores", value: stats.leads, icon: UserPlus, sub: "cadastrados", gradient: "from-blue-500/10 to-blue-600/5", iconBg: "bg-blue-500/15 text-blue-600", ring: "ring-blue-500/10" },
    { label: "Demandas", value: stats.projetosTramitando, icon: ClipboardList, sub: "pendentes", gradient: "from-amber-500/10 to-amber-600/5", iconBg: "bg-amber-500/15 text-amber-600", ring: "ring-amber-500/10" },
    { label: "Lideranças", value: stats.liderancas, icon: Crown, sub: "na rede", gradient: "from-violet-500/10 to-violet-600/5", iconBg: "bg-violet-500/15 text-violet-600", ring: "ring-violet-500/10" },
    { label: "Eventos", value: stats.agendas, icon: CalendarDays, sub: "agendados", gradient: "from-emerald-500/10 to-emerald-600/5", iconBg: "bg-emerald-500/15 text-emerald-600", ring: "ring-emerald-500/10" },
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
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-[13px] text-muted-foreground capitalize">{dateStr}</p>
        </div>
        <Badge variant="outline" className="gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full px-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ao vivo
        </Badge>
      </div>

      {/* ── KPI Grid — 2x2 mobile, 4 desktop ── */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",
                kpi.gradient
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1", kpi.iconBg, kpi.ring)}>
                  <Icon className="h-[18px] w-[18px]" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl md:text-[28px] font-bold text-foreground leading-none tracking-tight">{kpi.value}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-muted-foreground">{kpi.label}</span>
                <span className="text-[10px] text-muted-foreground/60">· {kpi.sub}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Funil de Leads — Donut */}
        <div className="col-span-1 lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-3.5 w-3.5 text-blue-600" />
              </div>
              Funil de Leads
            </h2>
            <span className="text-[10px] text-muted-foreground font-medium bg-muted/60 px-2 py-0.5 rounded-full">
              Distribuição
            </span>
          </div>
          {funilChartData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={200} className="md:max-w-[50%]">
                <PieChart>
                  <Pie
                    data={funilChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {funilChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 flex-1 w-full">
                {funilChartData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs group/item hover:bg-muted/40 -mx-2 px-2 py-1 rounded-lg transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-1 ring-offset-background" style={{ backgroundColor: d.fill, ringColor: d.fill }} />
                      <span className="text-muted-foreground font-medium">{d.name}</span>
                    </div>
                    <span className="font-bold text-foreground tabular-nums">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-3">
                <UserPlus className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">Nenhum lead cadastrado</p>
              <p className="text-xs mt-0.5 text-muted-foreground/70">Comece adicionando contatos</p>
            </div>
          )}
        </div>

        {/* Projetos por Status — Vertical bar */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/10">
                <Scale className="h-3.5 w-3.5 text-violet-600" />
              </div>
              Legislativo
            </h2>
          </div>
          {projetosChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={projetosChartData} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                    {projetosChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-col gap-2">
                {projetosChartData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground font-medium">{d.name}</span>
                    </div>
                    <span className="font-bold text-foreground tabular-nums">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-3">
                <Scale className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">Nenhum projeto</p>
              <p className="text-xs mt-0.5 text-muted-foreground/70">Adicione projetos de lei</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row: Agenda + Recent Leads ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Agenda */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10">
                <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
              </div>
              Próximos Eventos
            </h2>
            <a href="#" className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Ver tudo <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {agenda.length > 0 ? (
            <div className="px-3 pb-3 flex flex-col gap-0.5">
              {agenda.map((event: any, idx: number) => (
                <div key={event.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted/50 transition-all active:scale-[0.99]">
                  <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-center shrink-0 shadow-sm">
                    <span className="text-[8px] font-bold text-blue-500 uppercase leading-none tracking-wider">
                      {new Date(event.dataEvento).toLocaleDateString("pt-BR", { month: "short" })}
                    </span>
                    <span className="text-base font-black text-blue-700 leading-none -mt-0.5">
                      {new Date(event.dataEvento).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">{event.titulo}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{event.local || "Local não definido"}</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold shrink-0 rounded-full px-2 py-0.5 border-border/40">
                    {AGENDA_TIPO_LABELS[event.tipo] || event.tipo}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground px-5 pb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-3">
                <CalendarDays className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">Nenhum evento</p>
              <p className="text-xs mt-0.5 text-muted-foreground/70">Adicione eventos na Agenda</p>
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              Leads Recentes
            </h2>
            <a href="#" className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Ver tudo <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          {recentLeads.length > 0 ? (
            <div className="px-3 pb-3 flex flex-col gap-0.5">
              {recentLeads.map((l: any) => (
                <div key={l.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted/50 transition-all active:scale-[0.99]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-[13px] font-bold text-emerald-700 uppercase shrink-0 shadow-sm">
                    {l.nome?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">{l.nome}</p>
                    <p className="text-[11px] text-muted-foreground">{l.telefone || l.email || "Sem contato"}</p>
                  </div>
                  <Badge
                    className="text-[9px] font-bold shrink-0 rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor: `${FUNIL_COLORS[l.funil] || "#94A3B8"}12`,
                      color: FUNIL_COLORS[l.funil] || "#94A3B8",
                      borderColor: `${FUNIL_COLORS[l.funil] || "#94A3B8"}25`
                    }}
                    variant="outline"
                  >
                    {FUNIL_LABELS[l.funil] || l.funil}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground px-5 pb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-3">
                <UserPlus className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-sm font-medium">Nenhum lead</p>
              <p className="text-xs mt-0.5 text-muted-foreground/70">Leads capturados pelo site</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
