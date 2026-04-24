"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

function BeforeAfterPreview({ config, device }: PluginSectionProps) {
  const items = config.items || []
  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 text-center text-stone-900">Resultados</h2>
        <div className={cn(
          "grid gap-8",
          device === "mobile" ? "grid-cols-1" : "grid-cols-2"
        )}>
          {items.map((item: any, i: number) => (
            <div key={i} className="space-y-4">
              <div className="flex gap-2 aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-stone-50">
                <div className="flex-1 overflow-hidden relative group bg-stone-100 flex items-center justify-center">
                  {item.before && item.before.trim() !== "" ? (
                    <img src={item.before} alt="Antes" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="text-[8px] font-bold text-stone-300 uppercase">Sem foto</div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[8px] font-bold text-white uppercase tracking-widest">Antes</div>
                </div>
                <div className="flex-1 overflow-hidden relative group bg-stone-100 flex items-center justify-center">
                  {item.after && item.after.trim() !== "" ? (
                    <img src={item.after} alt="Depois" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="text-[8px] font-bold text-stone-300 uppercase">Sem foto</div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500/80 backdrop-blur-md rounded text-[8px] font-bold text-white uppercase tracking-widest">Depois</div>
                </div>
              </div>
              <h3 className="text-center font-bold text-stone-700 text-sm">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BeforeAfterSidebar({ config, onChange }: PluginSidebarProps) {
  const items = config.items || []
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-bold text-white">Antes/Depois</h3>
      <div className="space-y-4">
        {items.map((item: any, i: number) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <input 
                className="bg-transparent border-none text-white text-xs font-bold outline-none"
                value={item.title}
                onChange={(e) => {
                  const newItems = [...items]
                  newItems[i].title = e.target.value
                  onChange({ ...config, items: newItems })
                }}
              />
              <button onClick={() => {
                const newItems = [...items]
                newItems.splice(i, 1)
                onChange({ ...config, items: newItems })
              }} className="text-white/30 hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-white/30 uppercase">URL Antes</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-[8px] outline-none"
                  value={item.before}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[i].before = e.target.value
                    onChange({ ...config, items: newItems })
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-white/30 uppercase">URL Depois</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-[8px] outline-none"
                  value={item.after}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[i].after = e.target.value
                    onChange({ ...config, items: newItems })
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <button 
          onClick={() => onChange({ ...config, items: [...items, { title: "Novo Resultado", before: "", after: "" }] })}
          className="w-full py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-[10px] hover:text-white hover:border-white/20 transition-all"
        >
          + Adicionar Foto
        </button>
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
  defaultConfig: { items: [] }
}
