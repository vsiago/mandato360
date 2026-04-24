"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { Scissors, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * PREVIEW COMPONENT
 */
function ServicesPreview({ config, device, themeColors }: PluginSectionProps) {
  const items = config.items || []
  return (
    <div className="py-12 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-stone-900">Nossos Serviços</h2>
        <div className={cn(
          "grid gap-6",
          device === "mobile" ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
        )}>
          {items.map((service: any, i: number) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="aspect-video overflow-hidden bg-stone-100 flex items-center justify-center">
                {service.image && service.image.trim() !== "" ? (
                  <img src={service.image} alt={service.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <Scissors className="h-8 w-8 text-stone-300" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-stone-900">{service.name}</h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{service.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: themeColors.primary }}>
                    R$ {service.price || "0,00"}
                  </span>
                  <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * SIDEBAR COMPONENT
 */
function ServicesSidebar({ config, onChange }: PluginSidebarProps) {
  const items = config.items || []
  
  const addItem = () => {
    onChange({ 
      ...config, 
      items: [...items, { name: "Novo Serviço", description: "Descrição...", price: 0, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800" }] 
    })
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    onChange({ ...config, items: newItems })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Serviços</h3>
        <button onClick={addItem} className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {items.map((item: any, i: number) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <input 
                className="bg-transparent border-none text-white text-xs font-bold w-full outline-none"
                value={item.name}
                onChange={(e) => {
                  const newItems = [...items]
                  newItems[i].name = e.target.value
                  onChange({ ...config, items: newItems })
                }}
              />
              <button onClick={() => removeItem(i)} className="text-white/30 hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea 
              className="bg-transparent border-none text-white/50 text-[10px] w-full outline-none resize-none"
              rows={2}
              value={item.description}
              onChange={(e) => {
                const newItems = [...items]
                newItems[i].description = e.target.value
                onChange({ ...config, items: newItems })
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export const servicesPlugin: EditorPlugin = {
  id: "services",
  label: "Serviços",
  icon: Scissors,
  previewComponent: ServicesPreview,
  sidebarComponent: ServicesSidebar,
  defaultConfig: {
    items: [],
    categories: []
  }
}
