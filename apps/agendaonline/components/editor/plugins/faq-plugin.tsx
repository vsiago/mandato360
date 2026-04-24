"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { HelpCircle, Plus, Trash2, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

function FAQPreview({ config }: PluginSectionProps) {
  const items = config.items || []
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-900">Perguntas Frequentes</h2>
          <p className="text-stone-400 mt-2">Tire suas dúvidas sobre nossos serviços.</p>
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

function FAQSidebar({ config, onChange }: PluginSidebarProps) {
  const items = config.items || []
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-bold text-white">FAQ</h3>
      <div className="space-y-4">
        {items.map((item: any, i: number) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40">Pergunta {i + 1}</span>
              <button onClick={() => {
                const newItems = [...items]
                newItems.splice(i, 1)
                onChange({ ...config, items: newItems })
              }} className="text-white/30 hover:text-red-400">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <input 
              className="w-full bg-transparent border-none text-white text-xs font-bold outline-none"
              value={item.question}
              onChange={(e) => {
                const newItems = [...items]
                newItems[i].question = e.target.value
                onChange({ ...config, items: newItems })
              }}
            />
            <textarea 
              className="w-full bg-transparent border-none text-white/50 text-[10px] outline-none resize-none"
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
          className="w-full py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-[10px] hover:text-white hover:border-white/20 transition-all"
        >
          + Adicionar Pergunta
        </button>
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
  defaultConfig: { items: [] }
}
