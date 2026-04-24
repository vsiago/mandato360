"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { MapPin, Phone, MessageCircle, Instagram } from "lucide-react"

function ContactPreview({ config, device, themeColors }: PluginSectionProps) {
  const info = config.info || {}
  return (
    <div className="py-20 px-6 bg-white border-t border-stone-100">
      <div className={cn(
        "max-w-5xl mx-auto flex gap-12",
        device === "mobile" ? "flex-col" : "flex-row"
      )}>
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Onde nos Encontrar</h2>
            <p className="text-stone-400 mt-2">Venha nos visitar ou entre em contato agora.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-800">Endereço</h4>
                <p className="text-sm text-stone-500">{info.address}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-800">WhatsApp</h4>
                <p className="text-sm text-stone-500">{info.whatsapp}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 h-64 md:h-auto min-h-[300px] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200">
           {/* Map Placeholder */}
           <div className="w-full h-full flex items-center justify-center text-stone-300 flex-col gap-2">
             <MapPin className="h-8 w-8" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Mapa Interativo</span>
           </div>
        </div>
      </div>
    </div>
  )
}

function ContactSidebar({ config, onChange }: PluginSidebarProps) {
  const info = config.info || {}
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-bold text-white">Contato</h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Endereço</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] outline-none resize-none"
            rows={3}
            value={info.address}
            onChange={(e) => onChange({ ...config, info: { ...info, address: e.target.value } })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">WhatsApp</label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] outline-none"
            value={info.whatsapp}
            onChange={(e) => onChange({ ...config, info: { ...info, whatsapp: e.target.value } })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Instagram (handle)</label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] outline-none"
            value={info.instagram}
            onChange={(e) => onChange({ ...config, info: { ...info, instagram: e.target.value } })}
          />
        </div>
      </div>
    </div>
  )
}

export const contactPlugin: EditorPlugin = {
  id: "contact",
  label: "Contato",
  icon: MapPin,
  previewComponent: ContactPreview,
  sidebarComponent: ContactSidebar,
  defaultConfig: { info: {} }
}

import { cn } from "@/lib/utils"
