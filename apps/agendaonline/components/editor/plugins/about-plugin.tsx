"use client"

import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

function AboutPreview({ config, device, themeColors }: PluginSectionProps) {
  const founder = config.founder || {}
  return (
    <div className="py-20 px-6 bg-stone-50">
      <div className={cn(
        "max-w-5xl mx-auto flex gap-12 items-center",
        device === "mobile" ? "flex-col text-center" : "flex-row"
      )}>
        <div className="w-64 h-64 shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 flex items-center justify-center">
          {founder.imageUrl && founder.imageUrl.trim() !== "" ? (
            <img src={founder.imageUrl} alt={founder.name} className="h-full w-full object-cover" />
          ) : (
            <User className="h-12 w-12 text-stone-300" />
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: `${themeColors.primary}15`, color: themeColors.primary }}>
            {founder.role || "Especialista"}
          </div>
          <h2 className="text-3xl font-bold text-stone-900">{founder.name}</h2>
          <p className="text-stone-500 leading-relaxed italic">"{founder.bio}"</p>
        </div>
      </div>
    </div>
  )
}

function AboutSidebar({ config, onChange }: PluginSidebarProps) {
  const founder = config.founder || {}
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-bold text-white">Sobre</h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Nome</label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] outline-none"
            value={founder.name}
            onChange={(e) => onChange({ ...config, founder: { ...founder, name: e.target.value } })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Bio</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[10px] outline-none resize-none"
            rows={4}
            value={founder.bio}
            onChange={(e) => onChange({ ...config, founder: { ...founder, bio: e.target.value } })}
          />
        </div>
      </div>
    </div>
  )
}

export const aboutPlugin: EditorPlugin = {
  id: "about",
  label: "Sobre",
  icon: User,
  previewComponent: AboutPreview,
  sidebarComponent: AboutSidebar,
  defaultConfig: { founder: {} }
}
