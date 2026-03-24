"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Newspaper, Calendar, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { publicacoes as initialPublicacoes } from "@/lib/mock-data"
import type { Publicacao } from "@/lib/mock-data"

export default function PublicacoesPage() {
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>(initialPublicacoes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [previewPublicacao, setPreviewPublicacao] = useState<Publicacao | null>(null)
  const [newPublicacao, setNewPublicacao] = useState({
    titulo: '',
    imagem: '/placeholder.svg',
    conteudo: '',
  })

  const handleAddPublicacao = () => {
    const publicacao: Publicacao = {
      id: String(publicacoes.length + 1),
      ...newPublicacao,
      data: new Date().toISOString().split('T')[0],
    }
    setPublicacoes([publicacao, ...publicacoes])
    setNewPublicacao({ titulo: '', imagem: '/placeholder.svg', conteudo: '' })
    setIsAddDialogOpen(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Publicacoes do Mandato</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie as publicacoes que aparecerao na landing page
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Publicacao
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Publicacao</DialogTitle>
              <DialogDescription>Preencha as informacoes da publicacao</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddPublicacao()
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground">Titulo</label>
                <Input
                  value={newPublicacao.titulo}
                  onChange={(e) => setNewPublicacao({ ...newPublicacao, titulo: e.target.value })}
                  placeholder="Titulo da publicacao"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">URL da Imagem</label>
                <Input
                  value={newPublicacao.imagem}
                  onChange={(e) => setNewPublicacao({ ...newPublicacao, imagem: e.target.value })}
                  placeholder="URL da imagem"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Conteudo</label>
                <Textarea
                  value={newPublicacao.conteudo}
                  onChange={(e) => setNewPublicacao({ ...newPublicacao, conteudo: e.target.value })}
                  placeholder="Conteudo da publicacao"
                  className="mt-1"
                  rows={6}
                  required
                />
              </div>

              {/* Preview */}
              {newPublicacao.titulo && (
                <div className="rounded-lg border border-border p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Preview</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">{newPublicacao.titulo}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{newPublicacao.conteudo}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Publicar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Publicacoes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publicacoes.map((publicacao) => (
          <Card key={publicacao.id} className="overflow-hidden transition-shadow hover:shadow-md">
            <div className="relative aspect-video bg-muted">
              <Image
                src={publicacao.imagem}
                alt={publicacao.titulo}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(publicacao.data).toLocaleDateString('pt-BR')}
              </div>
              <h3 className="mb-2 font-semibold text-foreground line-clamp-2">
                {publicacao.titulo}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                {publicacao.conteudo}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setPreviewPublicacao(publicacao)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Preview
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {publicacoes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Newspaper className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma publicacao ainda</p>
            <p className="text-sm text-muted-foreground">
              Clique em "Nova Publicacao" para comecar
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Preview */}
      <Dialog open={!!previewPublicacao} onOpenChange={() => setPreviewPublicacao(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview da Publicacao</DialogTitle>
            <DialogDescription>Visualizacao da publicacao</DialogDescription>
          </DialogHeader>
          {previewPublicacao && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                <Image
                  src={previewPublicacao.imagem}
                  alt={previewPublicacao.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(previewPublicacao.data).toLocaleDateString('pt-BR')}
              </div>
              <h3 className="text-xl font-bold text-foreground">{previewPublicacao.titulo}</h3>
              <p className="text-muted-foreground leading-relaxed">{previewPublicacao.conteudo}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
