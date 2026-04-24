"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cancelSubscription, resumeSubscription, createPortalSession } from "@/lib/stripe/actions"
import { toast } from "sonner"
import { Loader2, ExternalLink } from "lucide-react"

export function SubscriptionActions({
    isCanceled,
    status
}: {
    isCanceled: boolean,
    status: string
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [isPortalLoading, setIsPortalLoading] = useState(false)

    const handleAction = async () => {
        setIsLoading(true)
        try {
            if (isCanceled) {
                await resumeSubscription()
                toast.success("Assinatura reativada com sucesso!")
            } else {
                if (confirm("Tem certeza que deseja cancelar sua assinatura? Você ainda terá acesso até o fim do período atual.")) {
                    await cancelSubscription()
                    toast.success("Assinatura cancelada. O acesso continuará até o fim do ciclo.")
                }
            }
            window.location.reload()
        } catch (error: any) {
            toast.error("Erro ao processar ação: " + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePortal = async () => {
        setIsPortalLoading(true)
        try {
            const { url } = await createPortalSession()
            if (url) window.location.href = url
        } catch (error: any) {
            toast.error("Erro ao abrir portal: " + error.message)
        } finally {
            setIsPortalLoading(false)
        }
    }

    if (status === "canceled") return null

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                onClick={handlePortal}
                disabled={isPortalLoading}
                className="text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
                {isPortalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Gerenciar Pagamentos
            </Button>

            <Button
                variant={isCanceled ? "default" : "outline"}
                onClick={handleAction}
                disabled={isLoading}
                className={isCanceled ? "bg-amber-500 hover:bg-amber-600" : "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-950/20"}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isCanceled ? "Reativar Assinatura" : "Cancelar Assinatura"}
            </Button>
        </div>
    )
}
