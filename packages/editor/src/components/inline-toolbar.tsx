"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Bold, Italic, Type, Settings, ChevronRight, Pencil } from 'lucide-react'
import { cn } from '../lib/utils'

interface InlineToolbarProps {
  targetRect: DOMRect | null
  isVisible: boolean
  onAction: (action: 'bold' | 'italic' | 'size-sm' | 'size-md' | 'size-lg' | 'advanced' | 'edit') => void
  activeFormats?: {
    bold?: boolean
    italic?: boolean
    size?: 'sm' | 'md' | 'lg'
  }
}

export function InlineToolbar({ targetRect, isVisible, onAction, activeFormats }: InlineToolbarProps) {
// ... (omitting position logic for brevity in replace_file_content if possible, but I'll include it to be safe)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && targetRect && toolbarRef.current) {
      const toolbarHeight = toolbarRef.current.offsetHeight
      const toolbarWidth = toolbarRef.current.offsetWidth
      
      // Position above target if possible, else below
      let top = targetRect.top - toolbarHeight - 12
      if (top < 10) {
        top = targetRect.bottom + 12
      }
      
      let left = targetRect.left + (targetRect.width / 2) - (toolbarWidth / 2)
      
      // Keep within viewport
      left = Math.max(10, Math.min(left, window.innerWidth - toolbarWidth - 10))
      
      // Adjust for scroll
      top += window.scrollY
      left += window.scrollX

      setPosition({ top, left })
    }
  }, [isVisible, targetRect])

  if (!isVisible || !targetRect) return null

  return (
    <div
      id="inline-toolbar"
      ref={toolbarRef}
      className={cn(
        "fixed z-[200] flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/90 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in-95",
        !isVisible && "scale-95 opacity-0 pointer-events-none"
      )}
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => {
        // Prevent default focus loss
        e.preventDefault()
        // Stop both React and Native event propagation to prevent document-level 'click outside' listeners from firing
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }}
    >
      <ToolbarButton 
        onClick={() => onAction('edit')} 
        className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 w-auto px-3 gap-1.5 mr-1"
        tooltip="Editar Texto"
      >
        <Pencil className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-tight">Editar</span>
      </ToolbarButton>

      <div className="mx-0.5 h-4 w-px bg-white/10" />

      <ToolbarButton 
        onClick={() => onAction('bold')} 
        active={activeFormats?.bold}
        tooltip="Negrito (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      
      <ToolbarButton 
        onClick={() => onAction('italic')} 
        active={activeFormats?.italic}
        tooltip="Itálico (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-white/10" />

      <ToolbarButton onClick={() => onAction('size-sm')} active={activeFormats?.size === 'sm'}>
        <span className="text-[10px] font-bold">S</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('size-md')} active={activeFormats?.size === 'md'}>
        <span className="text-xs font-bold">M</span>
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('size-lg')} active={activeFormats?.size === 'lg'}>
        <span className="text-sm font-bold">L</span>
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-white/10" />

      <button
        onClick={() => onAction('advanced')}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Settings className="h-3 w-3" />
        Configurações
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  )
}

function ToolbarButton({ 
  children, 
  onClick, 
  active, 
  tooltip,
  className
}: { 
  children: React.ReactNode, 
  onClick: () => void, 
  active?: boolean,
  tooltip?: string,
  className?: string
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      title={tooltip}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-full transition-all",
        active 
          ? "bg-white text-zinc-900 shadow-sm" 
          : "text-white/70 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {children}
    </button>
  )
}
