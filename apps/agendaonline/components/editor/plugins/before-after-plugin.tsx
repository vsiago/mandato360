"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { ArrowLeftRight, Plus, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Type, Layers, Upload, Loader2, X, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

import { DraggableCarousel } from "@/components/draggable-carousel"

/* ═══════════════════════════════════════════
   PREVIEW — Layout idêntico ao /[slug] (tenant-client.tsx)
   ═══════════════════════════════════════════ */
function BeforeAfterPreview({ config, device, themeColors }: PluginSectionProps) {
  if (!config.enabled) return null
  
  const items = config.items || []
  const title = config.title || "Nossos Resultados"
  const subtitle = config.subtitle || "Confira as transformações reais de nossos clientes."

  if (items.length === 0) return (
    <div className="py-20 px-6 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-full bg-white border border-slate-200">
        <ArrowLeftRight className="h-8 w-8 text-slate-300" />
      </div>
      <p className="text-sm text-slate-400 font-medium tracking-tight">Seção de Resultados vazia.<br/>Adicione fotos na sidebar para visualizar.</p>
    </div>
  )

  return (
    <div className="py-20 px-6 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2
            className="text-2xl font-bold tracking-tight text-slate-900 mb-4"
            style={{
              fontSize: device === "desktop" ? "2.5rem" : device === "tablet" ? "1.75rem" : "1.5rem",
              fontFamily: "var(--font-serif, serif)",
            }}
            dangerouslySetInnerHTML={{ 
              __html: title.replace(/\*(.*?)\*/g, `<span class="italic" style="color: ${themeColors.primary}">$1</span>`) 
            }}
          />
          <p className="text-sm text-slate-600 leading-relaxed" style={{ fontSize: device === "desktop" ? "1rem" : "0.85rem" }}>
            {subtitle}
          </p>
        </div>

        <div className="mt-8 mb-4 w-full">
            <DraggableCarousel items={items} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SIDEBAR — Edição completa com accordeons
   ═══════════════════════════════════════════ */
function BeforeAfterSidebar({ config, onChange, accentColor = "#10b981", onImageUpload }: PluginSidebarProps) {
  const items = config.items || []
  const [isCabecalhoOpen, setIsCabecalhoOpen] = useState(false)
  const [isConteudoOpen, setIsConteudoOpen] = useState(false)
  const [isUploading, setIsUploading] = useState<{index: number, type: 'before'|'after'} | null>(null)

  // Welcome Screen if disabled and empty
  if (!config.enabled && items.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <ArrowLeftRight className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Seção de Resultados</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Ative esta seção para mostrar transformações e provas sociais de seus resultados para seus clientes.
        </p>
        <Button 
          onClick={() => onChange({ ...config, enabled: true })}
          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
        >
          Ativar Seção
        </Button>
      </div>
    )
  }

  const handleImageUpload = async (index: number, type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageUpload) return
    
    try {
      setIsUploading({ index, type })
      const url = await onImageUpload(file)
      const newItems = [...items]
      newItems[index] = { ...newItems[index], [type]: url }
      onChange({ ...config, items: newItems })
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(null)
    }
  }

  return (
    <div className="space-y-1">
      {/* Visibility Toggle */}
      <div className="px-4 py-3 bg-white/5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.enabled ? accentColor : '#525252' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Visibilidade</span>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => onChange({ ...config, enabled })}
        />
      </div>

      {/* Accordion 1: Cabeçalho */}
      <div className="border-b border-white/5">
        <button 
          onClick={() => setIsCabecalhoOpen(!isCabecalhoOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <Type className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/80">Cabeçalho</span>
          </div>
          {isCabecalhoOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </button>
        
        {isCabecalhoOpen && (
          <div className="px-4 pb-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground/60">Título da Seção</Label>
                <span className="text-[8px] opacity-30 italic text-white">Use *ponto* para itálico</span>
              </div>
              <Input
                value={config.title}
                onChange={(e) => onChange({ ...config, title: e.target.value })}
                placeholder="Ex: Nossos *Resultados*"
                className="h-9 border-white/10 bg-white/5 text-xs text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">Subtítulo</Label>
              <textarea
                value={config.subtitle}
                onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
                placeholder="Descrição breve..."
                className="w-full min-h-[80px] rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Conteúdo */}
      <div className="border-b border-white/5">
        <button 
          onClick={() => setIsConteudoOpen(!isConteudoOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <Layers className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/80">Conteúdo</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground font-mono">{items.length}</span>
          </div>
          {isConteudoOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </button>

        {isConteudoOpen && (
          <div className="px-4 pb-5 space-y-4 mt-2">
            <div className="space-y-3">
              {items.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-4 relative group/item">
                  <div className="flex items-center justify-between gap-3">
                    <Input 
                      className="h-8 border-none bg-transparent text-white text-xs font-bold outline-none p-0 focus-visible:ring-0"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...items]
                        newItems[i].title = e.target.value
                        onChange({ ...config, items: newItems })
                      }}
                      placeholder="Título do Resultado"
                    />
                    <button onClick={() => {
                      const newItems = items.filter((_: any, idx: number) => idx !== i)
                      onChange({ ...config, items: newItems })
                    }} className="text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(['before', 'after'] as const).map((type) => (
                      <div key={type} className="space-y-2">
                        <Label className="text-[9px] font-bold text-white/30 uppercase tracking-widest block text-center">{type === 'before' ? 'Antes' : 'Depois'}</Label>
                        <div className="relative aspect-square rounded-xl bg-black/20 border border-white/5 overflow-hidden flex items-center justify-center group/img">
                          {item[type] ? (
                            <>
                              <img src={item[type]} className="w-full h-full object-cover" alt={type} />
                              <button 
                                onClick={() => {
                                  const newItems = [...items]
                                  newItems[i][type] = ""
                                  onChange({ ...config, items: newItems })
                                }}
                                className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3 text-white" />
                              </button>
                            </>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-1.5 p-4 hover:bg-white/5 transition-all w-full h-full justify-center">
                              {isUploading?.index === i && isUploading?.type === type ? (
                                <Loader2 className="h-4 w-4 animate-spin text-white/20" />
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 text-white/20" />
                                  <span className="text-[8px] font-bold text-white/20">UPLOAD</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleImageUpload(i, type, e)}
                                disabled={!!isUploading}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button 
                onClick={() => onChange({ ...config, items: [...items, { title: "Novo Resultado", before: "", after: "" }] })}
                variant="ghost"
                className="w-full h-12 border-2 border-dashed border-white/5 hover:border-white/10 hover:bg-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Plus className="h-3 w-3" /> Adicionar Resultado
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const beforeAfterPlugin: EditorPlugin = {
  id: "beforeAfter",
  label: "Resultados",
  icon: ArrowLeftRight,
  previewComponent: BeforeAfterPreview,
  sidebarComponent: BeforeAfterSidebar,
  defaultConfig: { 
    enabled: false, 
    title: "Nossos *Resultados*", 
    subtitle: "Confira as transformações reais de nossos clientes.",
    items: [] 
  }
}
