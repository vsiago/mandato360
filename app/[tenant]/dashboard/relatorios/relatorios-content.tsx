"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Crown, Scale, MapPin, UserCog, CalendarDays, ClipboardList, CheckCircle2, TrendingUp } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"

const FUNIL_LABELS: Record<string, string> = {
  novo: "Novos", contato: "Em Contato", engajado: "Engajados", apoiador: "Apoiadores", lideranca: "Lideranças", inativo: "Inativos",
}
const FUNIL_COLORS: Record<string, string> = {
  novo: "#3B82F6", contato: "#8B5CF6", engajado: "#F59E0B", apoiador: "#10B981", lideranca: "#0D9F6E", inativo: "#94A3B8",
}
const STATUS_LABELS: Record<string, string> = {
  tramitando: "Tramitando", aprovado: "Aprovado", rejeitado: "Rejeitado", arquivado: "Arquivado", pendente: "Pendente", concluido: "Concluído",
}
const STATUS_COLORS: Record<string, string> = {
  tramitando: "#3B82F6", aprovado: "#10B981", rejeitado: "#EF4444", arquivado: "#94A3B8", pendente: "#F59E0B", concluido: "#0D9F6E",
}

interface RelatoriosContentProps {
  tenantName: string
  stats: {
    leads: number; liderancas: number; indicacoesLeg: number; projetosTramitando: number;
    bairros: number; assessores: number; agendas: number; pesquisas: number;
  }
  funilData: { funil: string; count: number }[]
  projetosChart: { status: string; count: number }[]
}

export function RelatoriosContent({ tenantName, stats, funilData, projetosChart }: RelatoriosContentProps) {
  const totalLeads = stats.leads
  const totalLiderancas = stats.liderancas
  const totalProjetos = stats.indicacoesLeg + stats.projetosTramitando

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

  const kpis = [
    { label: "Total de Leads", value: stats.leads, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Lideranças", value: stats.liderancas, icon: Crown, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Projetos de Lei", value: totalProjetos, icon: Scale, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Bairros Ativos", value: stats.bairros, icon: MapPin, color: "text-rose-600", bg: "bg-rose-50" },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          Relatórios
        </h1>
        <p className="text-sm text-muted-foreground font-medium">Visualize métricas do mandato — {tenantName}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Funil */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Distribuição do Funil de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {funilChartData.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="55%" height={250}>
                  <PieChart>
                    <Pie data={funilChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                      {funilChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2.5">
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
              <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                <Users className="h-12 w-12 mb-3 opacity-20" />
                <p className="font-medium">Sem dados para exibir</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projetos */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scale className="h-4 w-4 text-violet-600" />
              Projetos Legislativos por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projetosChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={projetosChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {projetosChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                <Scale className="h-12 w-12 mb-3 opacity-20" />
                <p className="font-medium">Sem dados para exibir</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="border-0 shadow-sm rounded-xl mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Resumo Geral do Mandato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Assessores", value: stats.assessores, icon: UserCog, color: "text-cyan-600", bg: "bg-cyan-50" },
              { label: "Agenda Pública", value: stats.agendas, icon: CalendarDays, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Pesquisas", value: stats.pesquisas, icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Indicações", value: stats.indicacoesLeg, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
