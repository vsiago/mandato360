"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { demandas as initialDemandas } from "@/lib/mock-data"
import type { Demanda } from "@/lib/mock-data"
import { MapPin, Calendar, Tag, User, ArrowRight, Share2, Copy, CheckCircle2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type StatusType = 'novo' | 'analise' | 'encaminhado' | 'resolvido'

const columns: { id: StatusType; title: string; color: string }[] = [
  { id: 'novo', title: 'Novo Pedido', color: 'bg-primary' },
  { id: 'analise', title: 'Em Analise', color: 'bg-amber-500' },
  { id: 'encaminhado', title: 'Encaminhado', color: 'bg-accent' },
  { id: 'resolvido', title: 'Resolvido', color: 'bg-emerald-500' },
]

const statusBadgeConfig = {
  novo: { label: 'Novo', className: 'bg-primary/10 text-primary' },
  analise: { label: 'Em Analise', className: 'bg-amber-50 text-amber-700' },
  encaminhado: { label: 'Encaminhado', className: 'bg-accent/10 text-accent' },
  resolvido: { label: 'Resolvido', className: 'bg-emerald-50 text-emerald-700' },
}

export default function DemandasPage() {
  const [demandas, setDemandas] = useState<Demanda[]>(initialDemandas)
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null)
  const [generatedPost, setGeneratedPost] = useState<string>("")
  const [showGenerator, setShowGenerator] = useState(false)
  const [copied, setCopied] = useState(false)

  // Gera post para redes sociais
  const generatePost = (demanda: Demanda) => {
    const post = `Hoje atendemos um pedido dos moradores do bairro ${demanda.bairro} sobre ${demanda.tipo.toLowerCase()}. Seguimos trabalhando para melhorar nossa cidade! #MandatoAtivo #TrabalhandoPelaPopulacao`
    setGeneratedPost(post)
    setShowGenerator(true)
  }

  // Copia post para clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getDemandasByStatus = (status: StatusType) => {
    return demandas.filter((d) => d.status === status)
  }

  const handleStatusChange = (demandaId: string, newStatus: StatusType) => {
    setDemandas(demandas.map(d => 
      d.id === demandaId ? { ...d, status: newStatus } : d
    ))
    if (selectedDemanda && selectedDemanda.id === demandaId) {
      setSelectedDemanda({ ...selectedDemanda, status: newStatus })
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Demandas da Populacao</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Acompanhe e gerencie as solicitacoes dos cidadaos
        </p>
      </div>

      {/* Kanban Board - horizontal scroll on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
        {columns.map((column) => (
          <div key={column.id} className="flex min-w-[280px] flex-col md:min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <div className={`h-3 w-3 shrink-0 rounded-full ${column.color}`} />
              <h3 className="whitespace-nowrap text-sm md:text-base font-semibold text-foreground">{column.title}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {getDemandasByStatus(column.id).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 rounded-xl bg-muted/30 p-2 md:p-3">
              {getDemandasByStatus(column.id).map((demanda) => (
                <Card
                  key={demanda.id}
                  className="cursor-pointer border-0 shadow-sm transition-all hover:shadow-md"
                  onClick={() => setSelectedDemanda(demanda)}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <Badge className={statusBadgeConfig[demanda.status].className}>
                        {demanda.tipo}
                      </Badge>
                    </div>
                    <p className="mb-2 font-medium text-foreground">{demanda.eleitorNome}</p>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {demanda.descricao}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {demanda.bairro}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(demanda.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {getDemandasByStatus(column.id).length === 0 && (
                <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border">
                  <p className="text-sm text-muted-foreground">Nenhuma demanda</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedDemanda} onOpenChange={() => setSelectedDemanda(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Demanda</DialogTitle>
            <DialogDescription>
              Visualize e altere o status da solicitacao
            </DialogDescription>
          </DialogHeader>
          {selectedDemanda && (
            <div className="space-y-4">
              {/* Status Change */}
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="mb-2 text-sm font-medium text-muted-foreground">Alterar Status</p>
                <div className="flex flex-wrap items-center gap-2">
                  {columns.map((col) => (
                    <Button
                      key={col.id}
                      variant={selectedDemanda.status === col.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(selectedDemanda.id, col.id)}
                      className={selectedDemanda.status === col.id ? "" : "hover:bg-muted"}
                    >
                      <div className={`mr-2 h-2 w-2 rounded-full ${col.color}`} />
                      {col.title}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cidadão</p>
                    <p className="text-foreground">{selectedDemanda.eleitorNome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                    <p className="text-foreground">{selectedDemanda.bairro}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Solicitação</p>
                    <p className="text-foreground">{selectedDemanda.tipo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data</p>
                    <p className="text-foreground">
                      {new Date(selectedDemanda.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">Descricao</p>
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-foreground">{selectedDemanda.descricao}</p>
                </div>
              </div>

              {/* Gerador de Conteudo - apenas para demandas resolvidas */}
              {selectedDemanda.status === 'resolvido' && (
                <div className="border-t pt-4">
                  {!showGenerator ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => generatePost(selectedDemanda)}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Gerar Post para Redes Sociais
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Post Gerado
                        </p>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setShowGenerator(false)}
                        >
                          Fechar
                        </Button>
                      </div>
                      <Textarea
                        value={generatedPost}
                        onChange={(e) => setGeneratedPost(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <Button 
                        className="w-full" 
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar para Clipboard
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
