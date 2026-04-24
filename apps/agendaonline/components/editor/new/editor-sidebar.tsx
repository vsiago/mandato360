"use client"

import React, { useState } from "react"
import { useEditor } from "@/lib/editor-context"
import { cn } from "@/lib/utils"
import { 
  Palette, Droplets, Image as ImageIcon, Type, 
  Settings2, Layers, Sparkles, ChevronRight,
  Info
} from "lucide-react"
import { PropertiesPanel } from "../properties-panel"
import { ContentEditorPanel } from "../content-editor-panel"
import { ThemeSelector } from "@/components/theme-selector"
import type { ThemeId } from "@/src/themes/types"

export function EditorSidebar() {
  const { selectedSection, data, updateField } = useEditor()
  const [activeTab, setActiveTab] = useState<"style" | "content">("style")

  if (!selectedSection) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-white/10 bg-[#0f0f12] lg:w-80">
        <div className="flex flex-col items-center justify-center h-full px-8 text-center space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
            <Layers className="h-7 w-7 text-white/20" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white/80">Nenhuma seção selecionada</h3>
            <p className="text-[10px] text-white/30 leading-relaxed">
              Selecione uma seção no navegador à esquerda ou clique diretamente no site para editar.
            </p>
          </div>
          <div className="pt-4 grid grid-cols-2 gap-2 w-full">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-left">
              <Settings2 className="h-3 w-3 text-amber-500 mb-1" />
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Estilo</p>
              <p className="text-[7px] text-white/20">Cores e fontes</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-left">
              <Type className="h-3 w-3 text-blue-500 mb-1" />
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Conteúdo</p>
              <p className="text-[7px] text-white/20">Textos e imagens</p>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  const isDesignSystem = (selectedSection as string) === 'design-system'

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-white/10 bg-[#0f0f12] lg:w-80 overflow-hidden relative">
      
      {/* Sidebar Header */}
      <div className="px-4 py-4 border-b border-white/10 shrink-0 bg-gradient-to-b from-white/5 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              {isDesignSystem ? <Palette className="h-4 w-4 text-amber-500" /> : <Settings2 className="h-4 w-4 text-amber-500" />}
            </div>
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-white">
                {isDesignSystem ? "Identidade Visual" : (selectedSection as string).replace(/([A-Z])/g, ' $1').trim()}
              </h2>
              <p className="text-[9px] text-white/30">
                {isDesignSystem ? "Configurações globais" : "Personalize esta seção"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector (only if not design-system) */}
        {!isDesignSystem && selectedSection !== 'hero' && (
          <div className="flex p-0.5 rounded-lg bg-white/5 border border-white/5">
            <button
              onClick={() => setActiveTab("style")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all",
                activeTab === "style" ? "bg-white/10 text-white shadow-sm" : "text-white/30 hover:text-white/50"
              )}
            >
              <Palette className="h-3 w-3" /> Estilo
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all",
                activeTab === "content" ? "bg-white/10 text-white shadow-sm" : "text-white/30 hover:text-white/50"
              )}
            >
              <Type className="h-3 w-3" /> Conteúdo
            </button>
          </div>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar py-2">
        <div className="editor-dark-override">
          {isDesignSystem ? (
            <div className="p-5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-white">Temas Premium</h3>
                </div>
                <ThemeSelector
                  value={(data.theme as ThemeId) || "neutro"}
                  onChange={(themeId) => updateField("theme" as any, themeId)}
                  variant="grid"
                />
              </div>
              
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-amber-500" />
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Dica</p>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  O tema altera tipografia, cores, bordas e animações do seu site sem afetar o conteúdo.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Hero is special, always shows style/properties */}
              {selectedSection === 'hero' ? (
                <PropertiesPanel />
              ) : (
                <>
                  {activeTab === "style" ? <PropertiesPanel /> : <ContentEditorPanel />}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Global Style Override for Dark Sidebar */}
      <style jsx global>{`
        .editor-dark-override .text-foreground { color: rgba(255, 255, 255, 0.8) !important; }
        .editor-dark-override .text-muted-foreground { color: rgba(255, 255, 255, 0.3) !important; }
        .editor-dark-override .bg-background { background-color: rgba(255, 255, 255, 0.03) !important; }
        .editor-dark-override .border-amber-200\/10 { border-color: rgba(255, 255, 255, 0.05) !important; }
        .editor-dark-override .bg-amber-500\/5 { background-color: rgba(255, 255, 255, 0.02) !important; }
        .editor-dark-override .bg-muted { background-color: rgba(255, 255, 255, 0.05) !important; }
        .editor-dark-override input, .editor-dark-override textarea, .editor-dark-override select { 
          background-color: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        .editor-dark-override .label, .editor-dark-override label {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </aside>
  )
}
