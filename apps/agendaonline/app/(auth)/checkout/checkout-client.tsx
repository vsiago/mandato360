"use client"

import { useCallback, useState } from "react"
import { CheckCircle2, ShieldCheck, Clock, ArrowLeft, Loader2, Star, CreditCard } from "lucide-react"
import Link from "next/link"

interface PlanData {
    name: string
    description: string
    amount: number
    displayPrice: string
    features: readonly string[]
    popular?: boolean
}

export default function CheckoutClient({
    plan,
    planData,
}: {
    plan: string
    planData: PlanData
}) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleCheckout = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/asaas/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Erro ao iniciar checkout")
                setIsLoading(false)
                return
            }

            // If we have an invoice URL, redirect to Asaas payment page
            if (data.invoiceUrl) {
                window.location.href = data.invoiceUrl
            } else {
                // No invoice URL (trial with no upfront payment) — go to success
                window.location.href = data.successUrl
            }
        } catch (err: any) {
            setError(err.message || "Erro ao conectar com o gateway de pagamento")
            setIsLoading(false)
        }
    }, [plan])

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Back link */}
            <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-8"
            >
                <ArrowLeft className="h-4 w-4" />
                Voltar aos planos
            </Link>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
                {/* ── Left: Plan Summary ── */}
                <div className="space-y-6 lg:sticky lg:top-24">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl lg:text-3xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Plano {planData.name}
                            </h1>
                            {planData.popular && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                                    <Star className="h-2.5 w-2.5 fill-white" />Popular
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            {planData.description}
                        </p>
                    </div>

                    {/* Price Card */}
                    <div className="rounded-2xl border border-amber-200/30 dark:border-amber-500/15 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm p-6">
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-stone-900 dark:text-stone-50" style={{ fontFamily: 'var(--font-playfair)' }}>
                                {planData.displayPrice}
                            </span>
                            <span className="text-sm text-stone-400 dark:text-stone-500">/mês</span>
                        </div>

                        <div className="space-y-3 mb-6">
                            {planData.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${i === 0 && planData.features[0].includes('+') ? 'text-amber-500' : 'text-emerald-500'}`} />
                                    <span className={`text-[13px] leading-snug ${i === 0 && planData.features[0].includes('+') ? 'font-bold text-stone-900 dark:text-stone-100' : 'text-stone-600 dark:text-stone-400'}`}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-5 border-t border-stone-100 dark:border-stone-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">Total hoje</span>
                                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">R$ 0,00</span>
                            </div>
                            <p className="text-[11px] text-stone-400 dark:text-stone-500 leading-relaxed">
                                Seu teste grátis de 7 dias começa agora. A primeira cobrança de {planData.displayPrice} será feita somente após o período de teste.
                            </p>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>Pagamento 100% seguro via Asaas</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                            <span>Cancele a qualquer momento nos primeiros 7 dias — reembolso total</span>
                        </div>
                    </div>
                </div>

                {/* ── Right: Payment Action ── */}
                <div className="min-h-100">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                            Confirmar assinatura
                        </h2>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                            Clique abaixo para prosseguir ao pagamento seguro
                        </p>
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-red-200/50 dark:border-red-800/30 bg-red-50/50 dark:bg-red-950/20 p-6 text-center">
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
                            <button
                                onClick={() => { setError(null) }}
                                className="btn-gold-solid rounded-full px-6 py-2 text-sm"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-stone-200/50 dark:border-stone-800/50 bg-white dark:bg-stone-900 overflow-hidden p-8 space-y-8">
                            {/* Payment info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-700/50">
                                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <CreditCard className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                            Pagamento flexível
                                        </p>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">
                                            Pague via Pix, cartão de crédito ou boleto
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Plano {planData.name}</span>
                                        <span className="text-stone-700 dark:text-stone-300 font-medium">{planData.displayPrice}/mês</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Período de teste</span>
                                        <span className="text-emerald-500 font-medium">7 dias grátis</span>
                                    </div>
                                    <div className="h-px bg-stone-100 dark:bg-stone-800" />
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-stone-700 dark:text-stone-300">Total agora</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 text-lg">R$ 0,00</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full h-14 bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Criando assinatura...
                                    </>
                                ) : (
                                    `Iniciar 7 Dias Grátis no Plano ${planData.name}`
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 dark:text-stone-500">
                                <ShieldCheck className="h-3 w-3" />
                                <span>Pagamento processado de forma segura pelo Asaas</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
