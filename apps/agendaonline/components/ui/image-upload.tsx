"use client"

import { useState, useRef } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            
            if (!res.ok) {
                throw new Error(data.message || data.error || "Erro no upload")
            }

            if (!data.url) {
                throw new Error("URL da imagem não retornada pelo servidor")
            }
            
            onChange(data.url)
            toast.success("Imagem enviada com sucesso!")
        } catch (error: any) {
            console.error(error)
            const errorMsg = error?.message || "Falha ao enviar a imagem."
            toast.error(errorMsg)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <div className={cn("relative group w-full h-32 rounded-xl border-2 border-dashed border-amber-200/50 dark:border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex flex-col items-center justify-center overflow-hidden", className)}>
            {value ? (
                <>
                    <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onChange(""); }}
                            className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors"
                            disabled={disabled || isUploading}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </>
            ) : (
                <div
                    className="flex flex-col items-center justify-center text-amber-700/60 dark:text-amber-400/60 p-4 text-center cursor-pointer w-full h-full"
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
