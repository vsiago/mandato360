"use client"

import React from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
    {
        question: "O que é o Agenda Online?",
        answer: "O Agenda Online é um Micro SaaS de agendamento focado em simplificar a vida de profissionais da beleza e estética. Ele permite que seus clientes agendem horários diretamente pelo WhatsApp através de uma página profissional.",
    },
    {
        question: "Como funciona o agendamento via WhatsApp?",
        answer: "O cliente acessa sua página, escolhe o serviço e o horário disponível, e ao confirmar, os dados são enviados formatados diretamente para o seu WhatsApp, facilitando a finalização do agendamento.",
    },
    {
        question: "Quais são os benefícios para o meu salão?",
        answer: "Redução de tempo gasto respondendo mensagens básicas, profissionalismo com uma página moderna, maior taxa de conversão de clientes e organização total da sua disponibilidade.",
    },
    {
        question: "Preciso baixar algum aplicativo?",
        answer: "Não! O Agenda Online é totalmente web. Você e seus clientes podem acessar de qualquer navegador no celular ou computador sem ocupar espaço na memória.",
    },
    {
        question: "Posso personalizar a minha página?",
        answer: "Sim! No plano Profissional e Premium você pode personalizar cores, fotos dos serviços e informações do seu negócio para manter a identidade da sua marca.",
    },
    {
        question: "O Agenda Online serve para outros nichos além de salões?",
        answer: "Sim! O sistema é perfeito para clínicas de estética, estúdios de tatuagem, pet shops, nutricionistas, consultórios e qualquer profissional que precise organizar sua agenda e automatizar o atendimento pelo WhatsApp.",
    },
    {
        question: "Meus dados e os dos meus clientes estão seguros?",
        answer: "Sim, utilizamos criptografia e as melhores práticas de segurança de dados para garantir que todas as informações de agendamentos e leads estejam protegidas.",
    },
    {
        question: "Como funciona a gestão de múltiplos profissionais?",
        answer: "Nos planos Profissional e Completo, você pode cadastrar vários profissionais, cada um com sua própria agenda e horários, facilitando a gestão do seu salão ou clínica.",
    },
    {
        question: "Existe alguma taxa por agendamento?",
        answer: "Não! Cobramos apenas a mensalidade do plano escolhido. Você pode receber quantos agendamentos sua agenda permitir sem custos adicionais.",
    },
    {
        question: "Os clientes recebem algum lembrete dos horários?",
        answer: "Sim! O sistema pode ser configurado para enviar lembretes automáticos pelo WhatsApp, reduzindo significativamente o número de faltas e esquecimentos.",
    },
]

export function FAQAEO() {
    // JSON-LD for Answer Engine Optimization
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        })),
    }

    return (
        <section id="faq" className="py-24 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-playfair">
                            Perguntas Frequentes
                        </h2>
                        <p className="max-w-225 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Tudo o que você precisa saber sobre o Agenda Online para transformar seu atendimento.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-primary/10">
                                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Structured Data for SEO/AEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </div>
        </section>
    )
}
