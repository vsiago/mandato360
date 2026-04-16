"use client"

import { useState, useEffect } from "react"
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { demandas as initialDemandas, tiposSolicitacao, bairros } from "@/lib/mock-data"
import type { Demanda } from "@/lib/mock-data"
import { MapPin, Calendar, Tag, User, Share2, Copy, CheckCircle2, ClipboardList, Plus, GripVertical } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"

type StatusType = 'novo' | 'analise' | 'encaminhado' | 'resolvido'

const columns: { id: StatusType; title: string; color: string; bgColor: string }[] = [
  { id: 'novo', title: 'Novo Pedido', color: 'bg-teal-500', bgColor: 'bg-teal-500/10' },
  { id: 'analise', title: 'Em Análise', color: 'bg-amber-500', bgColor: 'bg-amber-500/10' },
  { id: 'encaminhado', title: 'Encaminhado', color: 'bg-sky-500', bgColor: 'bg-sky-500/10' },
  { id: 'resolvido', title: 'Resolvido', color: 'bg-emerald-500', bgColor: 'bg-emerald-500/10' },
]

const statusBadgeConfig = {
  novo: { label: 'Novo', className: 'bg-teal-50 text-teal-700 border-teal-200' },
  analise: { label: 'Em Análise', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  encaminhado: { label: 'Encaminhado', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  resolvido: { label: 'Resolvido', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

export default function DemandasPage() {
  const [demandas, setDemandas] = useState<Demanda[]>(initialDemandas)
  const [selectedDemanda, setSelectedDemanda] = useState<Demanda | null>(null)
  
  // States for new demanda
  const [isNewDemandaOpen, setIsNewDemandaOpen] = useState(false)
  const [newDemandaStatus, setNewDemandaStatus] = useState<StatusType>('novo')
  const [newDemandaForm, setNewDemandaForm] = useState({
    nome: '',
    bairro: bairros[0] || '',
    tipo: tiposSolicitacao[0] || '',
    descricao: ''
  })

  // Share post states
  const [generatedPost, setGeneratedPost] = useState<string>("")
  const [showGenerator, setShowGenerator] = useState(false)
  const [copied, setCopied] = useState(false)

  // Drag and drop setup for CSR
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generates post for social media
  const generatePost = (demanda: Demanda) => {
    const post = `Hoje atendemos um pedido dos moradores do bairro ${demanda.bairro} sobre ${demanda.tipo.toLowerCase()}. Seguimos trabalhando para melhorar nossa cidade e conectando com a natureza ao nosso redor! 🌱 #MandatoAtivo #GestãoTransparente`
    setGeneratedPost(post)
    setShowGenerator(true)
  }

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

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const startColumn = getDemandasByStatus(source.droppableId as StatusType);
    const finishColumn = getDemandasByStatus(destination.droppableId as StatusType);
    
    const draggedItem = startColumn[source.index];

    if (source.droppableId === destination.droppableId) {
      const newColumnItems = Array.from(startColumn);
      newColumnItems.splice(source.index, 1);
      newColumnItems.splice(destination.index, 0, draggedItem);
      
      setDemandas(prev => {
        const otherDemandas = prev.filter(d => d.status !== source.droppableId);
        return [...otherDemandas, ...newColumnItems];
      });
    } else {
      const newStartItems = Array.from(startColumn);
      newStartItems.splice(source.index, 1);
      
      const newFinishItems = Array.from(finishColumn);
      const updatedItem = { ...draggedItem, status: destination.droppableId as StatusType };
      newFinishItems.splice(destination.index, 0, updatedItem);
      
      setDemandas(prev => {
        const otherDemandas = prev.filter(
          d => d.status !== source.droppableId && d.status !== destination.droppableId
        );
        return [...otherDemandas, ...newStartItems, ...newFinishItems];
      });
      
      if (selectedDemanda && selectedDemanda.id === draggableId) {
        setSelectedDemanda(updatedItem);
      }
    }
  };

  const handleCreateDemanda = (e: React.FormEvent) => {
    e.preventDefault();
    const novaDemanda: Demanda = {
      id: Math.random().toString(36).substr(2, 9),
      eleitorId: 'novo_' + Math.random().toString(36).substr(2, 5),
      eleitorNome: newDemandaForm.nome,
      bairro: newDemandaForm.bairro,
      tipo: newDemandaForm.tipo,
      descricao: newDemandaForm.descricao,
      data: new Date().toISOString(),
      status: newDemandaStatus
    };
    
    setDemandas(prev => [...prev, novaDemanda]);
    setIsNewDemandaOpen(false);
    setNewDemandaForm({ ...newDemandaForm, nome: '', descricao: '' });
  };

  if (!isMounted) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando quadro de demandas...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-[#FAFAFA] min-h-[calc(100vh-4rem)] rounded-tl-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-stone-800 tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            Demandas da População
          </h1>
          <p className="text-sm text-stone-500 mt-1 ml-13">
            Acompanhe e gerencie as solicitações com o fluxo natural do nosso quadro.
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 hide-scrollbar">
          {columns.map((column) => {
            const columnDemandas = getDemandasByStatus(column.id);
            return (
              <div key={column.id} className="flex min-w-[300px] flex-col md:min-w-0 bg-stone-50 rounded-3xl border border-stone-200/60 p-4 shadow-sm shadow-stone-200/20">
                <div className="mb-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 shrink-0 rounded-full ${column.color} shadow-sm`} />
                    <h3 className="whitespace-nowrap text-base font-semibold text-stone-700">{column.title}</h3>
                  </div>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${column.bgColor} text-xs font-bold text-stone-600`}>
                    {columnDemandas.length}
                  </span>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 min-h-[150px] space-y-3 rounded-2xl transition-colors duration-300 ${
                        snapshot.isDraggingOver ? 'bg-stone-100/80 ring-1 ring-stone-200' : ''
                      }`}
                    >
                      {columnDemandas.map((demanda, index) => (
                        <Draggable key={demanda.id} draggableId={demanda.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.9 : 1
                              }}
                            >
                              <Card
                                className={`rounded-[20px] border-stone-200/80 shadow-sm transition-all duration-200 ${
                                  snapshot.isDragging ? 'shadow-xl scale-[1.02] rotate-1 ring-1 ring-stone-300' : 'hover:shadow-md hover:border-stone-300'
                                }`}
                                onClick={() => setSelectedDemanda(demanda)}
                              >
                                <CardContent className="p-4 relative group">
                                  <div className="mb-3 flex items-start justify-between">
                                    <Badge variant="outline" className={`rounded-xl px-2.5 py-0.5 border ${statusBadgeConfig[demanda.status].className}`}>
                                      {demanda.tipo}
                                    </Badge>
                                    <GripVertical className="h-4 w-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <p className="mb-1.5 font-semibold text-stone-800 text-sm leading-tight">{demanda.eleitorNome}</p>
                                  <p className="mb-4 text-[13px] text-stone-500 line-clamp-2 leading-relaxed">
                                    {demanda.descricao}
                                  </p>
                                  <div className="flex items-center justify-between text-[11px] font-medium text-stone-400">
                                    <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-lg">
                                      <MapPin className="h-3 w-3" />
                                      {demanda.bairro}
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-lg">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(demanda.data).toLocaleDateString('pt-BR')}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {columnDemandas.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50">
                          <p className="text-sm font-medium text-stone-400">Arraste para cá</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>

                {/* Addition Button customized for Nature style */}
                <div className="mt-4 pt-2 border-t border-stone-200/60">
                   <Button 
                    variant="ghost" 
                    className="w-full justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 rounded-xl"
                    onClick={() => {
                      setNewDemandaStatus(column.id)
                      setIsNewDemandaOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Demanda
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* New Demanda Drawer */}
      <Drawer open={isNewDemandaOpen} onOpenChange={setIsNewDemandaOpen}>
        <DrawerContent className="bg-stone-50 border-t border-stone-200">
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-xl font-bold text-stone-800">Nova Demanda</DrawerTitle>
              <DrawerDescription className="text-stone-500">
                Esta demanda será adicionada na coluna: 
                <span className="font-semibold text-stone-700 ml-1">
                  {columns.find(c => c.id === newDemandaStatus)?.title}
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <form onSubmit={handleCreateDemanda} className="space-y-4 px-4 pb-8">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-stone-700">Nome do Cidadão</Label>
                <Input 
                  id="nome" 
                  required 
                  className="rounded-xl border-stone-200 bg-white"
                  value={newDemandaForm.nome}
                  onChange={e => setNewDemandaForm({...newDemandaForm, nome: e.target.value})}
                  placeholder="Ex: Maria Joaquina"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro" className="text-stone-700">Bairro</Label>
                  <Select 
                    value={newDemandaForm.bairro}
                    onValueChange={v => setNewDemandaForm({...newDemandaForm, bairro: v})}
                  >
                    <SelectTrigger id="bairro" className="rounded-xl border-stone-200 bg-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {bairros.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-stone-700">Categoria</Label>
                  <Select 
                    value={newDemandaForm.tipo}
                    onValueChange={v => setNewDemandaForm({...newDemandaForm, tipo: v})}
                  >
                    <SelectTrigger id="tipo" className="rounded-xl border-stone-200 bg-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {tiposSolicitacao.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-stone-700">Descrição do Problema</Label>
                <Textarea 
                  id="descricao" 
                  required 
                  rows={3}
                  className="rounded-xl border-stone-200 bg-white resize-none"
                  value={newDemandaForm.descricao}
                  onChange={e => setNewDemandaForm({...newDemandaForm, descricao: e.target.value})}
                  placeholder="Detalhes para facilitar o atendimento..."
                />
              </div>

              <DrawerFooter className="px-0 pt-4 flex-row justify-end gap-3">
                <DrawerClose asChild>
                  <Button type="button" variant="ghost" className="rounded-xl sm:w-auto">
                    Cancelar
                  </Button>
                </DrawerClose>
                <Button type="submit" className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white sm:w-auto">
                  Salvar Demanda
                </Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Demanda Details Dialog */}
      <Dialog open={!!selectedDemanda} onOpenChange={(open) => !open && setSelectedDemanda(null)}>
        <DialogContent className="max-w-lg rounded-[24px] p-0 overflow-hidden border-stone-200/60 shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 bg-stone-50 border-b border-stone-200/40">
            <DialogTitle className="text-xl font-bold text-stone-800">Detalhes da Demanda</DialogTitle>
            <DialogDescription className="text-stone-500">
              Visualize dados e movimente a atuação
            </DialogDescription>
          </DialogHeader>
          
          {selectedDemanda && (
            <div className="space-y-5 p-6 bg-white">
              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-100">
                <p className="mb-3 text-sm font-semibold text-stone-600 uppercase tracking-wider">Progresso Atual</p>
                <div className="flex flex-wrap items-center gap-2">
                  {columns.map((col) => (
                    <Button
                      key={col.id}
                      variant={selectedDemanda.status === col.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(selectedDemanda.id, col.id)}
                      className={`rounded-xl transition-all ${
                        selectedDemanda.status === col.id 
                        ? `${col.color} text-white border-transparent hover:${col.color}/90 shadow-md` 
                        : "border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {selectedDemanda.status !== col.id && <div className={`mr-2 h-2 w-2 rounded-full ${col.color}`} />}
                      {col.title}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-stone-100 rounded-xl">
                    <User className="h-5 w-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase">Cidadão Demandante</p>
                    <p className="text-base font-medium text-stone-800">{selectedDemanda.eleitorNome}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-stone-100 rounded-xl">
                      <MapPin className="h-5 w-5 text-stone-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-500 uppercase">Bairro</p>
                      <p className="text-sm font-medium text-stone-800">{selectedDemanda.bairro}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-stone-100 rounded-xl">
                      <Tag className="h-5 w-5 text-stone-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-500 uppercase">Categoria</p>
                      <p className="text-sm font-medium text-stone-800">{selectedDemanda.tipo}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-stone-100 rounded-xl">
                    <Calendar className="h-5 w-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase">Data de Registro</p>
                    <p className="text-sm font-medium text-stone-800">
                      {new Date(selectedDemanda.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="mb-2 text-sm font-semibold text-stone-600 uppercase tracking-wider px-2">Relato do Problema</p>
                <div className="rounded-2xl bg-stone-50/50 border border-stone-200/60 p-4 shadow-inner">
                  <p className="text-stone-700 text-sm leading-relaxed">{selectedDemanda.descricao}</p>
                </div>
              </div>

              {selectedDemanda.status === 'resolvido' && (
                <div className="border-t border-stone-100 pt-5 mt-2">
                  {!showGenerator ? (
                    <Button 
                      className="w-full rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 font-medium" 
                      variant="outline"
                      onClick={() => generatePost(selectedDemanda)}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Anunciar Conquista nas Redes
                    </Button>
                  ) : (
                    <div className="space-y-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Texto Sugerido
                        </p>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setShowGenerator(false)}
                          className="h-8 rounded-lg text-emerald-600 hover:bg-emerald-100"
                        >
                          Esconder
                        </Button>
                      </div>
                      <Textarea
                        value={generatedPost}
                        onChange={(e) => setGeneratedPost(e.target.value)}
                        rows={4}
                        className="resize-none rounded-xl border-emerald-200 bg-white shadow-sm focus-visible:ring-emerald-500"
                      />
                      <Button 
                        className={`w-full rounded-xl shadow-sm transition-all ${
                          copied ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        }`}
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Copiado com Sucesso!
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
