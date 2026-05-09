"use client"

import { useState } from "react"
import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { MapPin, Phone, MessageCircle, Instagram, ChevronDown, Type } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

function ContactSidebar({ config, onChange, accentColor = "#10b981" }: PluginSidebarProps) {
  const info = config.info || {}
  const [isConteudoOpen, setIsConteudoOpen] = useState(false)

  return (
    <div className="flex-1">
      {/* Conteúdo Accordion */}
      <div className="border-b border-border">
        <button
          onClick={() => setIsConteudoOpen(!isConteudoOpen)}
          className={cn(
            "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
            isConteudoOpen && "bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Type className={cn(
              "h-4 w-4 transition-colors duration-200",
              isConteudoOpen ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
            )} style={isConteudoOpen ? { color: accentColor } : undefined} />
            <span className={cn(
              "text-sm font-medium transition-colors duration-200",
              isConteudoOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}>Conteúdo</span>
          </div>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
              isConteudoOpen && "rotate-180 text-muted-foreground"
            )}
          />
        </button>
        {isConteudoOpen && (
          <div className="space-y-4 px-4 pb-4 pt-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground/70">Endereço</Label>
                <textarea 
                  className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-[11px] text-foreground outline-none resize-none min-h-[80px]"
                  value={info.address}
                  onChange={(e) => onChange({ ...config, info: { ...info, address: e.target.value } })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground/70">WhatsApp</Label>
                <Input 
                  className="h-8 text-[11px] border-border/50 bg-background"
                  value={info.whatsapp}
                  onChange={(e) => onChange({ ...config, info: { ...info, whatsapp: e.target.value } })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground/70">Instagram (handle)</Label>
                <Input 
                  className="h-8 text-[11px] border-border/50 bg-background"
                  value={info.instagram}
                  onChange={(e) => onChange({ ...config, info: { ...info, instagram: e.target.value } })}
                />
              </div>
            </div>
          </div>
        )}
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
