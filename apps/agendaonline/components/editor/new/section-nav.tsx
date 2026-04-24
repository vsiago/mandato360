"use client"

import { cn } from "@/lib/utils"
import { 
  PanelTop, Globe, Award, Layers, User, 
  ArrowLeftRight, HelpCircle, MapPin, Palette, Sparkles 
} from "lucide-react"
import type { EditorSectionId } from "@/lib/tenant-types"

interface SectionNavProps {
  activeSection: EditorSectionId | "design-system"
  onSectionChange: (section: any) => void
}

const sections = [
  { id: "header" as EditorSectionId, icon: PanelTop, label: "Header" },
  { id: "hero" as EditorSectionId, icon: Globe, label: "Hero" },
  { id: "trust" as EditorSectionId, icon: Award, label: "Destaques" },
  { id: "services" as EditorSectionId, icon: Layers, label: "Serviços" },
  { id: "about" as EditorSectionId, icon: User, label: "Sobre" },
  { id: "beforeAfter" as EditorSectionId, icon: ArrowLeftRight, label: "Resultados" },
  { id: "faq" as EditorSectionId, icon: HelpCircle, label: "FAQ" },
  { id: "contact" as EditorSectionId, icon: MapPin, label: "Contato" },
  { id: "footer" as EditorSectionId, icon: Globe, label: "Rodapé" },
  { id: "design-system" as any, icon: Palette, label: "Tema" },
]

export function SectionNav({ activeSection, onSectionChange }: SectionNavProps) {
  return (
    <nav className="flex w-16 flex-col items-center gap-1 border-r border-white/10 bg-[#0f0f12] py-4 shrink-0">
      <div className="flex flex-1 flex-col gap-1 w-full overflow-y-auto custom-scrollbar no-scrollbar">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          
          return (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id)
                // Scroll to section in preview
                const el = document.querySelector(`[data-section-id="${section.id}"]`)
                el?.scrollIntoView({ behavior: "smooth", block: "center" })
              }}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-md px-1 py-3 transition-all duration-200 shrink-0",
                isActive
                  ? "text-amber-500 bg-white/5"
                  : "text-white/20 hover:text-white/50"
              )}
              title={section.label}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-amber-500 rounded-r-full" />
              )}
              <Icon className={cn(
                "h-4 w-4 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className="text-[7px] font-bold uppercase tracking-wider text-center px-1">
                {section.label.split(" ")[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Bottom indicator */}
      <div className="mt-auto flex flex-col items-center gap-2 pt-4">
        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <Sparkles className="h-4 w-4 text-amber-500" />
        </div>
      </div>
    </nav>
  )
}
