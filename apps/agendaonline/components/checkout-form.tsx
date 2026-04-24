"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function CheckoutForm({ planName }: { planName: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setIsLoading(true)
        setErrorMessage(null)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard/assinatura?success=true`,
            },
        })

        if (error) {
            setErrorMessage(error.message ?? "Ocorreu um erro no pagamento.")
            toast.error(error.message ?? "Erro no pagamento")
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
                <PaymentElement
                    options={{
                        layout: "accordion",
                        business: { name: "Agenda Online" },
                    }}
                />
            </div>

            {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-4">
                <Button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="w-full h-12 bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processando...
                        </>
                    ) : (
                        `Iniciar 7 Dias Grátis no Plano ${planName}`
                    )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 dark:text-stone-500">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Pagamento processado de forma segura pelo Stripe</span>
                </div>
            </div>
        </form>
    )
}
