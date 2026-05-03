"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { HelpCircle, Plus, Trash2, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

function FAQPreview({ config, themeColors }: PluginSectionProps) {
  if (config.enabled === false) return null
  
  const items = config.items || []
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const title = config.title || "Perguntas *Frequentes*"
  const subtitle = config.subtitle || "Tire suas dúvidas sobre nossos serviços."

  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-900">
             {title.includes("*") ? (
                <>
                    {title.split("*")[0]}
                    <span className="italic" style={{ color: themeColors?.primary || '#0f172a' }}>{title.split("*")[1]}</span>
                    {title.split("*")[2] || ""}
                </>
            ) : title}
          </h2>
          {subtitle && <p className="text-stone-400 mt-2">{subtitle}</p>}
        </div>
        
        <div className="space-y-3">
          {items.map((faq: any, i: number) => (
            <div key={i} className="border border-stone-100 rounded-2xl overflow-hidden bg-stone-50/30">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-stone-50"
              >
                <span className="font-bold text-stone-800 text-sm">{faq.question}</span>
                <ChevronDown className={cn("h-4 w-4 text-stone-300 transition-transform", openIndex === i && "rotate-180")} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 pt-0 text-sm text-stone-500 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FAQSidebar({ config, onChange, accentColor = "#10b981" }: PluginSidebarProps) {
  const items = config.items || []
  const [isCabecalhoOpen, setIsCabecalhoOpen] = useState(false)
  const [isConteudoOpen, setIsConteudoOpen] = useState(true)
  
  return (
    <div className="space-y-1">
      {/* Visibility Toggle */}
      <div className="px-4 py-3 bg-white/5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.enabled !== false ? accentColor : '#525252' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Visibilidade</span>
        </div>
        <Switch
          checked={config.enabled !== false}
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
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/80">Cabeçalho</span>
          </div>
          {isCabecalhoOpen ? <ChevronDown className="h-3 w-3 rotate-180 transition-transform" /> : <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform" />}
        </button>
        
        {isCabecalhoOpen && (
          <div className="px-4 pb-5 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">Título da Seção</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-tenant-primary transition-colors"
                value={config.title || "Perguntas *Frequentes*"}
                onChange={(e) => onChange({ ...config, title: e.target.value })}
              />
              <p className="text-[9px] text-white/30 px-1">Use *texto* para itálico colorido</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">Subtítulo</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-tenant-primary transition-colors"
                value={config.subtitle || "Tire suas dúvidas sobre nossos serviços."}
                onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Perguntas */}
      <div className="border-b border-white/5">
        <button 
          onClick={() => setIsConteudoOpen(!isConteudoOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/80">Perguntas</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground font-mono">{items.length}</span>
          </div>
          {isConteudoOpen ? <ChevronDown className="h-3 w-3 rotate-180 transition-transform" /> : <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform" />}
        </button>

        {isConteudoOpen && (
          <div className="px-4 pb-5 space-y-4 mt-2">
            <div className="space-y-3">
              {items.map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 relative group/item">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Pergunta {i + 1}</span>
                    <button onClick={() => {
                      const newItems = [...items]
                      newItems.splice(i, 1)
                      onChange({ ...config, items: newItems })
                    }} className="text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <input 
                    className="w-full bg-transparent border-none text-white text-xs font-bold outline-none p-0 focus-visible:ring-0"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[i].question = e.target.value
                      onChange({ ...config, items: newItems })
                    }}
                  />
                  <textarea 
                    className="w-full bg-transparent border-none text-white/50 text-[10px] outline-none resize-none p-0 focus-visible:ring-0"
                    rows={2}
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[i].answer = e.target.value
                      onChange({ ...config, items: newItems })
                    }}
                  />
                </div>
              ))}
              
              <button 
                onClick={() => onChange({ ...config, items: [...items, { question: "Nova Pergunta?", answer: "Resposta..." }] })}
                className="w-full h-12 border-2 border-dashed border-white/5 hover:border-white/10 hover:bg-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all"
              >
                <Plus className="h-3 w-3" /> Adicionar Pergunta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const faqPlugin: EditorPlugin = {
  id: "faq",
  label: "FAQ",
  icon: HelpCircle,
  previewComponent: FAQPreview,
  sidebarComponent: FAQSidebar,
  defaultConfig: { 
    enabled: true,
    items: [],
    title: "Perguntas *Frequentes*",
    subtitle: "Tire suas dúvidas sobre nossos serviços."
  }
}
