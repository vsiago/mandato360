"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { eleitores, demandas, bairros, crescimentoEleitores } from "@/lib/mock-data"
import type { Eleitor } from "@/lib/mock-data"
import { ChevronRight, Users, Heart, TrendingUp, AlertCircle, Phone, Mail, MapPin } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"

const statusColors = {
  'apoiador': '#22c55e',
  'simpatizante': '#eab308',
  'neutro': '#9ca3af',
  'problema': '#ef4444',
}

const statusLabels = {
  'apoiador': 'Apoiador',
  'simpatizante': 'Simpatizante',
  'neutro': 'Neutro',
  'problema': 'Problema',
}

export default function BaseEleitoralPage() {
  const [selectedBairro, setSelectedBairro] = useState<string | null>(null)
  const [selectedCitizen, setSelectedCitizen] = useState<Eleitor | null>(null)

  // Estatisticas por bairro
  const bairroStats = useMemo(() => {
    return bairros.map(bairro => {
      const bairroEleitores = eleitores.filter(e => e.bairro === bairro)
      const demandasAbertas = demandas.filter(d => 
        d.bairro === bairro && d.status !== 'resolvido'
      ).length

      return {
        bairro,
        total: bairroEleitores.length,
        apoiadores: bairroEleitores.filter(e => e.statusRelacionamento === 'apoiador').length,
        simpatizantes: bairroEleitores.filter(e => e.statusRelacionamento === 'simpatizante').length,
        neutros: bairroEleitores.filter(e => e.statusRelacionamento === 'neutro').length,
        problemas: bairroEleitores.filter(e => e.statusRelacionamento === 'problema').length,
        demandasAbertas,
      }
    })
  }, [])

  // Dados para grafico de distribuicao
  const distributionData = useMemo(() => {
    return bairros.map(bairro => ({
      bairro,
      apoiadores: eleitores.filter(e => e.bairro === bairro && e.statusRelacionamento === 'apoiador').length,
      simpatizantes: eleitores.filter(e => e.bairro === bairro && e.statusRelacionamento === 'simpatizante').length,
      outros: eleitores.filter(e => e.bairro === bairro && (e.statusRelacionamento === 'neutro' || e.statusRelacionamento === 'problema')).length,
    }))
  }, [])

  // Dados para grafico de pizza
  const pieData = useMemo(() => [
    { name: 'Apoiadores', value: eleitores.filter(e => e.statusRelacionamento === 'apoiador').length, fill: '#22c55e' },
    { name: 'Simpatizantes', value: eleitores.filter(e => e.statusRelacionamento === 'simpatizante').length, fill: '#eab308' },
    { name: 'Neutros', value: eleitores.filter(e => e.statusRelacionamento === 'neutro').length, fill: '#9ca3af' },
    { name: 'Problemas', value: eleitores.filter(e => e.statusRelacionamento === 'problema').length, fill: '#ef4444' },
  ], [])

  // Cidadaos do bairro selecionado
  const bairroCitizens = useMemo(() => {
    if (!selectedBairro) return []
    return eleitores.filter(e => e.bairro === selectedBairro)
  }, [selectedBairro])

  // Totais gerais
  const totals = useMemo(() => ({
    total: eleitores.length,
    apoiadores: eleitores.filter(e => e.statusRelacionamento === 'apoiador').length,
    simpatizantes: eleitores.filter(e => e.statusRelacionamento === 'simpatizante').length,
    demandasAbertas: demandas.filter(d => d.status !== 'resolvido').length,
  }), [])

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Base Eleitoral</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Analise a base politica por regiao da cidade
        </p>
      </div>

      {/* Estatisticas Gerais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totals.total}</p>
                <p className="text-xs text-muted-foreground">Total Cidadaos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totals.apoiadores}</p>
                <p className="text-xs text-muted-foreground">Apoiadores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totals.simpatizantes}</p>
                <p className="text-xs text-muted-foreground">Simpatizantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totals.demandasAbertas}</p>
                <p className="text-xs text-muted-foreground">Demandas Abertas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Bairros */}
      <Card className="border-0 shadow-sm mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg font-semibold">Bairros da Cidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bairro</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Apoiadores</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Simpatizantes</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Neutros</TableHead>
                  <TableHead className="text-center">Demandas</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bairroStats.map((stat) => (
                  <TableRow key={stat.bairro}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{stat.bairro}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{stat.total}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-emerald-600">{stat.apoiadores}</span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <span className="font-semibold text-amber-600">{stat.simpatizantes}</span>
                    </TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <span className="text-muted-foreground">{stat.neutros}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {stat.demandasAbertas > 0 ? (
                        <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{stat.demandasAbertas}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBairro(stat.bairro)}
                      >
                        Ver <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Graficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Grafico de Distribuicao por Bairro */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-semibold">Distribuicao por Bairro</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distributionData} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis dataKey="bairro" type="category" tick={{ fill: '#64748b', fontSize: 10 }} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="apoiadores" stackId="a" fill="#22c55e" name="Apoiadores" />
                <Bar dataKey="simpatizantes" stackId="a" fill="#eab308" name="Simpatizantes" />
                <Bar dataKey="outros" stackId="a" fill="#9ca3af" name="Outros" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grafico de Pizza - Composicao */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-semibold">Composicao da Base</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grafico de Crescimento */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-semibold">Crescimento da Base Eleitoral</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={crescimentoEleitores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="quantidade" 
                  stroke="#F74191" 
                  strokeWidth={2}
                  dot={{ fill: '#F74191', strokeWidth: 2 }}
                  name="Novos Cadastros"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Detalhes do Bairro */}
      <Dialog open={!!selectedBairro} onOpenChange={() => setSelectedBairro(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cidadaos do Bairro {selectedBairro}</DialogTitle>
            <DialogDescription>Lista completa de cidadaos cadastrados</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Demandas</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bairroCitizens.map((citizen) => (
                  <TableRow key={citizen.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{citizen.nome}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{citizen.telefone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{citizen.telefone}</TableCell>
                    <TableCell>
                      <Badge 
                        style={{ 
                          backgroundColor: `${statusColors[citizen.statusRelacionamento]}20`,
                          color: statusColors[citizen.statusRelacionamento]
                        }}
                      >
                        {statusLabels[citizen.statusRelacionamento]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{citizen.totalSolicitacoes}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCitizen(citizen)}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Detalhes do Cidadao */}
      <Dialog open={!!selectedCitizen} onOpenChange={() => setSelectedCitizen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Cidadao</DialogTitle>
            <DialogDescription>Informacoes completas</DialogDescription>
          </DialogHeader>
          {selectedCitizen && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: statusColors[selectedCitizen.statusRelacionamento] }}
                >
                  {selectedCitizen.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedCitizen.nome}</p>
                  <Badge 
                    style={{ 
                      backgroundColor: `${statusColors[selectedCitizen.statusRelacionamento]}20`,
                      color: statusColors[selectedCitizen.statusRelacionamento]
                    }}
                  >
                    {statusLabels[selectedCitizen.statusRelacionamento]}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCitizen.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCitizen.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCitizen.bairro}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCitizen.totalSolicitacoes} solicitacoes</span>
                </div>
              </div>

              {selectedCitizen.observacoes && (
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Observacoes</p>
                  <p className="text-sm text-foreground">{selectedCitizen.observacoes}</p>
                </div>
              )}

              <Button variant="outline" className="w-full" onClick={() => setSelectedCitizen(null)}>
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
