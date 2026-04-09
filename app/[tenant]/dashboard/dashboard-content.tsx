"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, Crown, FileCheck, Scale, MapPin, UserCog, CalendarDays, ClipboardList,
  TrendingUp, ArrowUpRight, Clock, Users
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

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
  engajado: "#F59E0B",
  apoiador: "#10B981",
  lideranca: "#0D9F6E",
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
  pendente: "#F59E0B",
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
    { label: "Total de Leads", value: stats.leads, icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Lideranças", value: stats.liderancas, icon: Crown, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Indicações Leg.", value: stats.indicacoesLeg, icon: FileCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Projetos Tramitando", value: stats.projetosTramitando, icon: Scale, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Bairros", value: stats.bairros, icon: MapPin, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Assessores", value: stats.assessores, icon: UserCog, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Eventos Agenda", value: stats.agendas, icon: CalendarDays, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Pesquisas", value: stats.pesquisas, icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-50" },
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

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Visão geral do mandato — {tenantName}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col gap-3">
                  <div className={`flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl ${kpi.bg}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">{kpi.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Funil de Leads */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Funil de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {funilChartData.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={funilChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {funilChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2">
                  {funilChartData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="font-bold text-foreground ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <UserPlus className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm font-medium">Nenhum lead cadastrado</p>
                <p className="text-xs">Comece adicionando contatos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projetos por Status */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <Scale className="h-4 w-4 text-violet-600" />
              Projetos Legislativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projetosChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projetosChartData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {projetosChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Scale className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm font-medium">Nenhum projeto cadastrado</p>
                <p className="text-xs">Adicione projetos de lei e indicações</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Agenda + Recent Leads */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Agenda */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-orange-600" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agenda.length > 0 ? (
              <div className="space-y-3">
                {agenda.map((event: any) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-orange-50 text-center shrink-0">
                      <span className="text-[10px] font-bold text-orange-600 uppercase">
                        {new Date(event.dataEvento).toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                      <span className="text-lg font-black text-orange-700 leading-none">
                        {new Date(event.dataEvento).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{event.titulo}</p>
                      <p className="text-xs text-muted-foreground">{event.local || "Local não definido"}</p>
                      <Badge variant="outline" className="mt-1 text-[10px] font-bold">
                        {AGENDA_TIPO_LABELS[event.tipo] || event.tipo}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
                <CalendarDays className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm font-medium">Nenhum evento agendado</p>
                <p className="text-xs">Adicione eventos na Agenda Pública</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Leads Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((l: any) => (
                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 uppercase shrink-0">
                      {l.nome?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{l.nome}</p>
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
              <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
                <UserPlus className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm font-medium">Nenhum lead recente</p>
                <p className="text-xs">Leads aparecerão aqui quando capturados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
