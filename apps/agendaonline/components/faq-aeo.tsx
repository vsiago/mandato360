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
        answer: "O Agenda Online é uma plataforma brasileira que cria um site profissional com agenda 24h integrada para salões de beleza, barbearias, clínicas de estética, estúdios de tatuagem, pet shops e profissionais autônomos. Diferente de sistemas de agenda tradicionais, você ganha o site da sua marca, não só um link de calendário.",
    },
    {
        question: "Como funciona o agendamento via Agenda Online?",
        answer: "O cliente abre o link do seu site (seunome.agendaonline.app), escolhe o serviço, vê os horários disponíveis e confirma. Você recebe a notificação automaticamente e o cliente recebe lembrete por WhatsApp 24h e 1h antes do horário.",
    },
    {
        question: "Quanto custa criar um site para salão de beleza?",
        answer: "No Agenda Online, o site profissional com agenda 24h custa R$ 79/mês no plano Profissional, com 7 dias grátis sem cartão. Não há taxa de criação nem de agendamento. Em comparação, agências cobram entre R$ 4.000 e R$ 15.000 só pelo site, sem a agenda.",
    },
    {
        question: "Qual o melhor sistema de agendamento online para barbearia?",
        answer: "O melhor sistema é o que combina site profissional próprio + agenda 24h + lembrete WhatsApp + zero taxa por agendamento. O Agenda Online entrega tudo isso por R$ 79/mês, sem precisar que o cliente baixe app.",
    },
    {
        question: "Como diminuir faltas de clientes no salão?",
        answer: "Combine três coisas: lembrete automático no WhatsApp 24h e 1h antes do horário, sinal antecipado via Pix e política clara de no-show. O Agenda Online faz isso automaticamente e clientes da plataforma relatam redução de até 60% nas faltas.",
    },
    {
        question: "Posso usar o Agenda Online sem ter site próprio?",
        answer: "Você não precisa de site próprio anterior. O Agenda Online cria o site pra você. Em 3 minutos, sua página fica no ar em seunome.agendaonline.app, pronta pra colocar na bio do Instagram.",
    },
    {
        question: "O Agenda Online substitui o Trinks ou Booksy?",
        answer: "Sim, na maioria dos casos. A diferença: Trinks e Booksy são marketplaces que cobram taxa por agendamento e colocam você ao lado de 50 concorrentes. O Agenda Online entrega site próprio com sua marca, sem taxa, sem dividir tela com concorrente.",
    },
    {
        question: "Quanto tempo leva para colocar o site no ar?",
        answer: "Em média 3 minutos. Você adiciona logo, escolhe cores, cadastra serviços e fotos. Pronto. Não precisa de programador, designer ou agência.",
    },
    {
        question: "Preciso de CNPJ para usar o Agenda Online?",
        answer: "Não. Profissionais autônomos sem CNPJ podem usar normalmente. Você só precisa de CPF e WhatsApp ativo.",
    },
    {
        question: "Funciona em iPhone e Android?",
        answer: "Sim, em qualquer celular ou computador moderno. Você e seus clientes acessam pelo navegador, sem precisar instalar app.",
    },
    {
        question: "Vocês cobram taxa por agendamento como o iFood ou Booksy?",
        answer: "Não. Você paga só a mensalidade (R$ 79 ou R$ 119) e fica com 100% do valor cobrado dos clientes. Não há taxa por agendamento, por confirmação ou por cancelamento.",
    },
    {
        question: "Como divulgar minha agenda no Instagram?",
        answer: "Coloque o link seunome.agendaonline.app na bio do Instagram. Quando alguém clicar, vai direto pro seu site com a agenda aberta. Você também pode usar o link em stories, posts e em respostas automáticas do Direct.",
    },
    {
        question: "Preciso baixar algum aplicativo?",
        answer: "Não. Plataforma 100% web. Funciona em qualquer navegador, em qualquer dispositivo, sem ocupar espaço na memória.",
    },
    {
        question: "Posso personalizar a minha página?",
        answer: "Sim. Logo, cores, fotos, banner, descrição e ordem dos serviços são todos personalizáveis. No plano Completo você também tem portfólio antes/depois e personalização avançada de tipografia.",
    },
    {
        question: "Meus dados e os dos meus clientes estão seguros?",
        answer: "Sim. Utilizamos criptografia em trânsito e em repouso, conformidade com LGPD, backups diários e infraestrutura em servidores brasileiros. Você pode exportar ou excluir dados de clientes a qualquer momento.",
    },
    {
        question: "Como funciona a gestão de múltiplos profissionais?",
        answer: "Cada profissional do seu salão tem agenda, horários, folgas e serviços próprios. O cliente escolhe com quem quer agendar e o sistema só mostra os horários livres daquele profissional.",
    },
    {
        question: "Os clientes recebem lembrete dos horários?",
        answer: "Sim, automaticamente. Lembrete WhatsApp 24h antes e 1h antes do horário, com opção de confirmar ou reagendar com 1 clique.",
    },
    {
        question: "Posso cobrar sinal antecipado via Pix?",
        answer: "Sim. Você integra seu Pix e o sistema cobra automaticamente o sinal (porcentagem ou valor fixo) no momento do agendamento. Sem pagamento, o horário não é confirmado.",
    },
    {
        question: "O sistema serve para clínica de estética e tatuagem?",
        answer: "Sim. Recursos como ficha de anamnese, portfólio antes/depois, intervalo entre sessões e pacotes pré-pagos atendem clínicas de estética, estúdios de tatuagem, consultórios de nutrição e qualquer profissional que faz atendimento agendado.",
    },
    {
        question: "Como cancelar a assinatura?",
        answer: "A qualquer momento, em 1 clique, dentro do próprio painel. Sem multa, sem fidelidade, sem ligação pra atendente. Se cancelar antes dos 7 dias grátis, nada é cobrado.",
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
