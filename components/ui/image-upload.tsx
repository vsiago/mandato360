"use client"

import { useState, useRef } from "react"
import { ImagePlus, Loader2, X, Upload, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { uploadImageAction } from "@/lib/actions/upload"

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    className?: string;
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            onChange(res.url!)
            toast.success("Imagem enviada com sucesso!")
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Falha ao enviar a imagem.")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <div className={cn(
            "relative group w-full rounded-xl border-2 border-dashed transition-all overflow-hidden",
            value 
                ? "border-stone-200 dark:border-stone-700"
                : "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30",
            isUploading && "pointer-events-none opacity-70",
            className
        )}
        style={{ minHeight: value ? undefined : '8rem' }}
        >
            {value ? (
                <>
                    <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
                    {/* Hover overlay with replace and remove options */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={(e) => { 
                                e.stopPropagation()
                                if (!isUploading) fileInputRef.current?.click()
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-white text-stone-700 rounded-lg text-[10px] font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                            disabled={disabled || isUploading}
                        >
                            {isUploading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <RefreshCw className="h-3.5 w-3.5" />
                            )}
                            {isUploading ? "Enviando..." : "Trocar"}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onChange(""); }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                            disabled={disabled || isUploading}
                        >
                            <X className="h-3.5 w-3.5" />
                            Remover
                        </button>
                    </div>
                </>
            ) : (
                <div
                    className="flex flex-col items-center justify-center text-emerald-700/60 dark:text-emerald-400/60 p-4 text-center cursor-pointer w-full h-full"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    ) : (
                        <ImagePlus className="h-6 w-6 mb-2" />
                    )}
                    <span className="text-xs font-medium">
                        {isUploading ? "Enviando..." : "Clique para upload"}
                    </span>
                    <span className="text-[10px] opacity-70 mt-1">PNG, JPG até 5MB</span>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={onUpload}
                accept="image/*"
                className="hidden"
                disabled={disabled || isUploading}
            />
        </div>
    )
}
