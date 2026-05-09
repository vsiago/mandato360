"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ArrowUp, ArrowDown, Trash2, GripVertical } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

interface SectionToolbarProps {
  sectionId: string
  label?: string
  targetRect: DOMRect | null
  isVisible: boolean
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDelete: (id: string) => void
  isFirst?: boolean
  isLast?: boolean
}

export function SectionToolbar({ 
  sectionId, 
  label = "Seção",
  targetRect, 
  isVisible, 
  onMoveUp, 
  onMoveDown, 
  onDelete,
  isFirst,
  isLast
}: SectionToolbarProps) {
// ...
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && targetRect && toolbarRef.current) {
      const toolbarHeight = toolbarRef.current.offsetHeight
      
      // Position inside the section, top right
      let top = targetRect.top + 12
      let left = targetRect.right - toolbarRef.current.offsetWidth - 12
      
      // Keep within viewport if section is off-screen
      if (top < 80) top = 80 // Don't overlap header
      
      // Adjust for scroll
      top += window.scrollY
      left += window.scrollX

      setPosition({ top, left })
    }
  }, [isVisible, targetRect])

  if (!isVisible || !targetRect) return null

  // Don't show toolbar for header and footer reordering/deletion usually
  if (sectionId === 'header' || sectionId === 'footer') return null

  return (
    <div
      id="section-toolbar"
      ref={toolbarRef}
      className={cn(
        "fixed z-[150] flex items-center gap-1 rounded-xl border border-white/20 bg-zinc-900/80 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-2",
        !isVisible && "opacity-0 pointer-events-none"
      )}
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-center gap-0.5 px-2 border-r border-white/10 mr-1">
        <GripVertical className="h-3.5 w-3.5 text-white/30" />
        <span className="text-[10px] font-black text-white uppercase tracking-wider ml-1 whitespace-nowrap">{label}</span>
      </div>

      <ToolbarButton 
        onClick={() => onMoveUp(sectionId)} 
        disabled={isFirst}
        tooltip="Mover para Cima"
      >
        <ArrowUp className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton 
        onClick={() => onMoveDown(sectionId)} 
        disabled={isLast}
        tooltip="Mover para Baixo"
      >
        <ArrowDown className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-white/10" />

      <ToolbarButton 
        onClick={() => onDelete(sectionId)} 
        className="text-red-400 hover:bg-red-400/20 hover:text-red-300"
        tooltip="Excluir Seção"
      >
        <Trash2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}

function ToolbarButton({ 
  children, 
  onClick, 
  disabled,
  tooltip,
  className
}: { 
  children: React.ReactNode, 
  onClick: () => void, 
  disabled?: boolean,
  tooltip?: string,
  className?: string
}) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) onClick()
      }}
      disabled={disabled}
      title={tooltip}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
        disabled 
          ? "opacity-20 cursor-not-allowed" 
          : "text-white/80 hover:bg-white/10 hover:text-white active:scale-90",
        className
      )}
    >
      {children}
    </button>
  )
}
