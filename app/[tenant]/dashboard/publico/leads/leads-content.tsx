"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Search, Filter, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FUNIL_LABELS: Record<string, string> = {
  novo: "Novo", contato: "Em Contato", engajado: "Engajado", apoiador: "Apoiador", lideranca: "Liderança", inativo: "Inativo",
}
const FUNIL_COLORS: Record<string, string> = {
  novo: "#3B82F6", contato: "#8B5CF6", engajado: "#F59E0B", apoiador: "#10B981", lideranca: "#0D9F6E", inativo: "#94A3B8",
}

export function LeadsPageContent({ tenantId, initialData }: { tenantId: string; initialData: any[] }) {
  const [items] = useState(initialData)
  const [search, setSearch] = useState("")
  const [funilFilter, setFunilFilter] = useState("all")

  const filtered = items.filter(i => {
    const matchSearch = i.nome.toLowerCase().includes(search.toLowerCase()) || (i.email || "").toLowerCase().includes(search.toLowerCase()) || (i.telefone || "").includes(search)
    const matchFunil = funilFilter === "all" || i.funil === funilFilter
    return matchSearch && matchFunil
  })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            Leads / Contatos
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Contatos capturados da landing page e CTAs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, email ou telefone..." className="pl-10 rounded-xl" />
        </div>
        <Select value={funilFilter} onValueChange={setFunilFilter}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Funil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(FUNIL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {Object.entries(FUNIL_LABELS).map(([key, label]) => {
          const count = items.filter(i => i.funil === key).length
          return (
            <button key={key} onClick={() => setFunilFilter(key === funilFilter ? "all" : key)}
              className={`p-3 rounded-xl border text-center transition-all ${funilFilter === key ? "border-primary bg-primary/5" : "border-transparent bg-card shadow-sm"}`}
            >
              <p className="text-lg font-bold" style={{ color: FUNIL_COLORS[key] }}>{count}</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">{label}</p>
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <UserPlus className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhum lead encontrado</p>
              <p className="text-sm">Leads serão capturados automaticamente do site</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold uppercase shrink-0"
                style={{ backgroundColor: `${FUNIL_COLORS[item.funil] || "#94A3B8"}15`, color: FUNIL_COLORS[item.funil] || "#94A3B8" }}
              >
                {item.nome?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.nome}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  {item.telefone && <span>{item.telefone}</span>}
                  {item.email && <span>{item.email}</span>}
                  {item.bairroNome && <span className="flex items-center gap-1"><span>📍</span>{item.bairroNome}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.origem && <Badge variant="secondary" className="text-[10px]">{item.origem}</Badge>}
                <Badge variant="outline" className="text-[10px] font-bold"
                  style={{ backgroundColor: `${FUNIL_COLORS[item.funil]}15`, color: FUNIL_COLORS[item.funil], borderColor: `${FUNIL_COLORS[item.funil]}30` }}
                >
                  {FUNIL_LABELS[item.funil] || item.funil}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
