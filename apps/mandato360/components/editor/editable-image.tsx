"use client"

import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useEditor } from "@/lib/editor/context"
import { EditorSectionId } from "@/lib/editor/types"
import { ImageIcon, Upload, Loader2 } from "lucide-react"
import { uploadImageAction } from "@/lib/actions/upload"
import { toast } from "sonner"

interface EditableImageProps {
    fieldPath: string
    elementId: string
    sectionId: EditorSectionId
    className?: string
    style?: React.CSSProperties
    aspectRatio?: string
    children: React.ReactNode
}

export function EditableImage({
    fieldPath,
    elementId,
    sectionId,
    className,
    style,
    children
}: EditableImageProps) {
    const { selectedElement, selectElement, selectSection, updateField } = useEditor()
    const isSelected = selectedElement === elementId
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.includes("image")) {
            toast.error("Por favor, selecione uma imagem válida.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("A imagem deve ter no máximo 5MB.")
            return
        }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append("file", file)

            const res = await uploadImageAction(formData)

            if (!res.success) throw new Error(res.error || "Erro no upload")

            // Update the field in the editor state
            updateField(fieldPath as any, res.url!)
            toast.success("Imagem atualizada com sucesso!")
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Falha ao enviar a imagem.")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <div
            className={cn(
                "relative transition-all cursor-pointer overflow-hidden group",
                isSelected ? "ring-4 ring-emerald-500 z-20" : "hover:ring-2 hover:ring-emerald-500/30",
                className
            )}
            style={style}
            onClick={(e) => {
                e.stopPropagation()
                selectSection(sectionId)
                selectElement(elementId)
            }}
        >
            {children}
            
            {/* Upload overlay */}
            <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
                <button 
                    className="relative z-10 flex items-center gap-2 bg-white/95 hover:bg-white text-stone-700 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (!isUploading) {
                            fileInputRef.current?.click()
                        }
                    }}
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                            <span>Enviando...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4 text-emerald-500" />
                            <span>Alterar Imagem</span>
                        </>
                    )}
                </button>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
            />
        </div>
    )
}
