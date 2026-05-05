"use client"

import { cn } from "../lib/utils"
import { LayoutGrid, Square, Rows3, GripVertical, Plus } from "lucide-react"
import type { EditorPlugin } from "../types"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { ComponentType } from "react"

interface SectionNavProps {
  activeSection: string
  sectionOrder: string[]
  plugins: EditorPlugin[]
  accentColor?: string
  onSectionChange: (section: string) => void
  onReorder: (newOrder: string[]) => void
  onAddSectionClick?: () => void
}

const coreSectionMeta: Record<string, { icon: ComponentType<{ className?: string }>; label: string }> = {
  header: { icon: Rows3, label: "Header" },
  hero: { icon: LayoutGrid, label: "Hero" },
  footer: { icon: Square, label: "Footer" },
}

interface SortableSectionItemProps {
  id: string
  isActive: boolean
  icon: ComponentType<{ className?: string }>
  label: string
  accentColor?: string
  isDraggable: boolean
  onClick: () => void
}

function SortableSectionItem({ id, isActive, icon: Icon, label, accentColor, isDraggable, onClick }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDraggable })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative w-full">
      <button
        onClick={onClick}
        className={cn(
          "group relative flex w-full flex-col items-center gap-1.5 rounded-md px-2 py-4 transition-all duration-200",
          isActive
            ? "text-foreground"
            : "text-muted-foreground/60 hover:text-foreground"
        )}
      >
        {/* Active indicator line */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r-full"
            style={{ backgroundColor: accentColor || "#10b981" }}
          />
        )}

        {/* Drag handle */}
        {isDraggable && (
          <div
            {...attributes}
            {...listeners}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground transition-colors"
          >
            <GripVertical className="h-3 w-3" />
          </div>
        )}

        <Icon className={cn(
          "h-5 w-5 transition-transform duration-200",
          isActive && "scale-105"
        )} />
        <span className="text-[9px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </button>
    </div>
  )
}

export function SectionNav({
  activeSection,
  sectionOrder,
  plugins,
  accentColor,
  onSectionChange,
  onReorder,
  onAddSectionClick,
}: SectionNavProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Build items from section order
  const pluginMap = new Map(plugins.map((p) => [p.id, p]))
  const items = sectionOrder.map((id) => {
    const core = coreSectionMeta[id]
    if (core) return { id, ...core, isDraggable: id !== "header" && id !== "footer" }
    const plugin = pluginMap.get(id)
    if (plugin) return { id, icon: plugin.icon, label: plugin.label, isDraggable: true }
    return null
  }).filter(Boolean) as Array<{ id: string; icon: ComponentType<{ className?: string }>; label: string; isDraggable: boolean }>

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sectionOrder.indexOf(active.id as string)
    const newIndex = sectionOrder.indexOf(over.id as string)

    if (oldIndex === -1 || newIndex === -1) return

    // Don't allow header to move from top or footer from bottom
    const newOrder = arrayMove(sectionOrder, oldIndex, newIndex)
    if (newOrder[0] !== "header" || newOrder[newOrder.length - 1] !== "footer") return

    onReorder(newOrder)
  }

  return (
    <nav className="flex w-16 h-full flex-col items-center gap-1 border-r border-border bg-card py-4 lg:w-20 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="flex flex-1 flex-col gap-0.5 w-full overflow-y-auto no-scrollbar pb-10">
            {items.map((item) => (
              <SortableSectionItem
                key={item.id}
                id={item.id}
                isActive={activeSection === item.id}
                icon={item.icon}
                label={item.label}
                accentColor={accentColor}
                isDraggable={item.isDraggable}
                onClick={() => onSectionChange(item.id)}
              />
            ))}

            {/* Add Section Button */}
            {onAddSectionClick && (
                <button
                    onClick={onAddSectionClick}
                    className="mt-2 flex w-full flex-col items-center gap-1.5 rounded-md px-2 py-4 text-muted-foreground/40 hover:text-foreground hover:bg-muted/10 transition-all group"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-dashed border-border group-hover:border-solid group-hover:scale-110 transition-all">
                        <Plus className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">
                        Adicionar<br/>Seção
                    </span>
                </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Bottom indicator */}
      <div className="mt-auto flex flex-col items-center gap-2 opacity-30">
        <div className="h-1 w-5 rounded-full bg-border" />
      </div>
    </nav>
  )
}
