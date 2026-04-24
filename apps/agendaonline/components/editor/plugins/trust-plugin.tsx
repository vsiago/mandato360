"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { Award, Plus, Trash2 } from "lucide-react"

function TrustPreview({ config, themeColors }: PluginSectionProps) {
  const badges = config.badges || []
  return (
    <div className="py-6 border-y border-stone-100 bg-stone-50/50">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {badges.map((badge: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-stone-400 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrustSidebar({ config, onChange }: PluginSidebarProps) {
  const badges = config.badges || []
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-bold text-white">Destaques</h3>
      <div className="space-y-2">
        {badges.map((badge: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] outline-none"
              value={badge.text}
              onChange={(e) => {
                const newBadges = [...badges]
                newBadges[i].text = e.target.value
                onChange({ ...config, badges: newBadges })
              }}
            />
            <button onClick={() => {
              const newBadges = [...badges]
              newBadges.splice(i, 1)
              onChange({ ...config, badges: newBadges })
            }} className="text-white/30 hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button 
          onClick={() => onChange({ ...config, badges: [...badges, { text: "NOVO DESTAQUE" }] })}
          className="w-full py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-[10px] hover:text-white hover:border-white/20 transition-all"
        >
          + Adicionar Destaque
        </button>
      </div>
    </div>
  )
}

export const trustPlugin: EditorPlugin = {
  id: "trust",
  label: "Destaques",
  icon: Award,
  previewComponent: TrustPreview,
  sidebarComponent: TrustSidebar,
  defaultConfig: { badges: [] }
}
