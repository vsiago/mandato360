"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, CheckCircle2, TrendingUp } from "lucide-react"
import {
  demandasPorBairro,
  demandasPorCategoria,
  crescimentoEleitores,
  demandas,
  eleitores,
} from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

// Brand colors: #F74191 (primary pink), #AA2E65 (dark magenta)
const COLORS = ['#F74191', '#AA2E65', '#E85A9C', '#C44878', '#F9A8C9', '#FFD6E8', '#FFF0F5']

export default function RelatoriosPage() {
  const demandasResolvidas = demandas.filter((d) => d.status === 'resolvido').length
  const totalDemandas = demandas.length
  const taxaResolucao = ((demandasResolvidas / totalDemandas) * 100).toFixed(1)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Relatorios</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Visualize estatisticas e metricas do mandato
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="mb-6 md:mb-8 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{eleitores.length}</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">Eleitores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-accent/10">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{totalDemandas}</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">Demandas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{demandasResolvidas}</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">Resolvidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-amber-50">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{taxaResolucao}%</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">Resolucao</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graficos */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Demandas por Bairro */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg font-semibold">Demandas por Bairro</CardTitle>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <div className="h-56 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandasPorBairro} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis
                    dataKey="bairro"
                    type="category"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="quantidade" fill="#F74191" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Demandas por Categoria */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg font-semibold">Demandas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demandasPorCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="quantidade"
                    nameKey="categoria"
                  >
                    {demandasPorCategoria.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm text-muted-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Crescimento de Eleitores */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg font-semibold">Crescimento de Eleitores Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={crescimentoEleitores}>
                  <defs>
                    <linearGradient id="colorQuantidade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F74191" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F74191" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="quantidade"
                    stroke="#F74191"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorQuantidade)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
