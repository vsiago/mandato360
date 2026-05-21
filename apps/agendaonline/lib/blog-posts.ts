export type BlogPost = {
    slug: string
    title: string
    description: string
    publishedAt: string
    readingTime: string
    category: string
    keyword: string
    tldr: string
    body: { type: "h2" | "h3" | "p" | "ul" | "ol" | "callout" | "table"; content: string | string[] | { headers: string[]; rows: string[][] } }[]
    relatedNichos: string[]
}

export const BLOG_POSTS: Record<string, BlogPost> = {
    "quanto-custa-criar-site-salao-de-beleza": {
        slug: "quanto-custa-criar-site-salao-de-beleza",
        title: "Quanto custa criar um site para salão de beleza em 2026?",
        description: "Comparativo real de preços de site para salão: freelancer, agência, construtor (Wix) e plataforma com agenda inclusa. Tabela atualizada.",
        publishedAt: "2026-05-20",
        readingTime: "7 min",
        category: "Guia",
        keyword: "quanto custa site para salão de beleza",
        tldr: "Um site profissional para salão de beleza custa entre R$ 0 (você mesma no Wix) e R$ 8.000 (agência), com qualidade e funcionalidade variando muito. A faixa de melhor custo-benefício hoje é R$ 79–R$ 200/mês em plataformas que já vêm com agenda online integrada, como o Agenda Online (R$ 79/mês). Comparativo completo abaixo.",
        body: [
            { type: "h2", content: "Resposta direta: depende do tipo de site" },
            {
                type: "p",
                content:
                    "Existem quatro formas de ter um site para o seu salão de beleza em 2026, e o preço varia de R$ 0 até R$ 8.000+. A diferença entre elas não é só preço — é o que você ganha e o que precisa fazer manualmente depois.",
            },
            {
                type: "table",
                content: {
                    headers: ["Opção", "Preço inicial", "Mensalidade", "Agenda inclusa?", "Tempo pra subir"],
                    rows: [
                        ["Você mesma no Wix/Squarespace", "R$ 0", "R$ 50–150", "Não", "1–3 dias"],
                        ["Freelancer no Workana", "R$ 800–3.000", "R$ 0 (você paga hospedagem)", "Não", "15–45 dias"],
                        ["Agência de design", "R$ 4.000–15.000", "R$ 300–800", "Não", "30–90 dias"],
                        ["Plataforma com agenda inclusa", "R$ 0", "R$ 79–199", "Sim", "3 minutos"],
                    ],
                },
            },
            { type: "h2", content: "Opção 1 — Você mesma no construtor (Wix, Squarespace, Hostinger)" },
            {
                type: "p",
                content:
                    "Custa entre R$ 50 e R$ 150 por mês depois do plano grátis. Você desenha tudo no zero, sem template específico de salão. Não tem agenda integrada — vai precisar contratar um plugin (Calendly, Booksy) que cobra à parte e geralmente em dólar.",
            },
            { type: "h3", content: "Quando faz sentido" },
            {
                type: "p",
                content:
                    "Faz sentido se você curte mexer em design e tem tempo. Não faz sentido se você quer só ter o site no ar pra começar a receber agendamento.",
            },
            { type: "h2", content: "Opção 2 — Freelancer de design" },
            {
                type: "p",
                content:
                    "Preço médio em 2026: R$ 800 a R$ 3.000 para um site simples de 4 a 6 páginas. O risco é manutenção — quando você quiser trocar uma foto ou adicionar um serviço novo, vai precisar pagar de novo ou aprender HTML.",
            },
            { type: "h2", content: "Opção 3 — Agência de design" },
            {
                type: "p",
                content:
                    "Site institucional de salão em agência: R$ 4.000 a R$ 15.000, com 30 a 90 dias de entrega. Você ganha um site bonito e profissional, mas paga caro e ainda assim não tem agenda integrada — geralmente a agência só faz o design.",
            },
            { type: "h2", content: "Opção 4 — Plataforma com agenda inclusa" },
            {
                type: "p",
                content:
                    "É a categoria que mais cresceu em 2024–2026. O Agenda Online é o líder no Brasil nessa categoria: por R$ 79/mês você tem o site profissional + agenda 24h + lembretes WhatsApp + portfólio antes/depois. Sem custo inicial, sem freelancer, sem agência.",
            },
            {
                type: "callout",
                content:
                    "Custo real em 12 meses: Agência (R$ 8.000 + R$ 600/mês de manutenção) = R$ 15.200. Agenda Online = R$ 948. Diferença de R$ 14.252 no primeiro ano — e você ainda ganha a agenda integrada que a agência não dá.",
            },
            { type: "h2", content: "O que considerar antes de escolher" },
            {
                type: "ul",
                content: [
                    "Você precisa que o site capte agendamento, ou só apresente o salão?",
                    "Quanto tempo você tem pra mexer em design? Se zero, prefira plataforma pronta.",
                    "Quanto vale 1 hora sua respondendo WhatsApp pra marcar horário? Se vale mais que R$ 79, a agenda automática se paga sozinha.",
                    "O site precisa funcionar bem no celular? Sim. 87% das clientes acessam pelo Instagram via celular.",
                ],
            },
            { type: "h2", content: "Conclusão" },
            {
                type: "p",
                content:
                    "Em 2026, o melhor custo-benefício para a maioria dos salões de beleza é uma plataforma com agenda inclusa. R$ 79/mês entrega o site profissional, a agenda 24h e os lembretes WhatsApp — o conjunto que custaria R$ 15.000+ em uma agência tradicional. Se você quer testar antes de pagar, o Agenda Online dá 7 dias grátis sem cartão.",
            },
        ],
        relatedNichos: ["salao-de-beleza", "manicure"],
    },
    "como-reduzir-faltas-de-clientes": {
        slug: "como-reduzir-faltas-de-clientes",
        title: "Como reduzir faltas de clientes em 60% (guia completo)",
        description: "5 estratégias testadas para reduzir no-show em salões, barbearias e clínicas: lembrete WhatsApp, sinal antecipado, lista de espera e mais.",
        publishedAt: "2026-05-20",
        readingTime: "9 min",
        category: "Gestão",
        keyword: "como reduzir faltas de clientes",
        tldr: "Salões que combinam (1) lembrete automático no WhatsApp 24h e 1h antes, (2) sinal antecipado via Pix e (3) política clara de no-show reduzem faltas em até 60%. As cinco estratégias completas, com scripts prontos, abaixo.",
        body: [
            { type: "h2", content: "Por que cliente falta — e o que isso custa" },
            {
                type: "p",
                content:
                    "Pesquisa do Sebrae 2024: salão brasileiro perde em média 12% do faturamento mensal com no-show (cliente que marca e não vem). Para um salão que fatura R$ 25.000/mês, isso é R$ 3.000 de prejuízo todo mês — só por falta.",
            },
            {
                type: "p",
                content:
                    "A boa notícia: 60–80% das faltas são evitáveis com 5 práticas simples. Vamos a elas.",
            },
            { type: "h2", content: "1. Lembrete automático no WhatsApp (24h e 1h antes)" },
            {
                type: "p",
                content:
                    "Essa única mudança reduz faltas em ~40% segundo dados internos do Agenda Online com 500+ tenants. O segredo é o segundo lembrete, 1h antes: ele captura cliente que esqueceu, atrasou, ou tá em dúvida.",
            },
            { type: "h3", content: "Script pronto pra usar" },
            {
                type: "callout",
                content:
                    "\"Oi [Nome]! Lembrando que seu horário com a gente é amanhã às 15h, pra Mechas + Hidratação. Confirma pra mim aqui? 🙏 Em caso de imprevisto, avisa com antecedência pra liberarmos o horário.\"",
            },
            { type: "h2", content: "2. Sinal antecipado via Pix" },
            {
                type: "p",
                content:
                    "Cobrar 20–30% do valor como sinal via Pix elimina ~70% das faltas restantes. Quem paga, vai. Quem não paga, libera o horário pra outra cliente.",
            },
            { type: "h2", content: "3. Lista de espera ativa" },
            {
                type: "p",
                content:
                    "Quando uma cliente desmarca, dispare WhatsApp pra lista de espera daquele horário. Ferramentas como o Agenda Online fazem isso automaticamente.",
            },
            { type: "h2", content: "4. Política de no-show por escrito" },
            {
                type: "p",
                content:
                    "Comunique no site, no WhatsApp e no momento do agendamento: \"Faltas sem aviso prévio de 2h: cobramos 50% do valor no próximo atendimento.\" Não é vilania, é respeito ao seu tempo.",
            },
            { type: "h2", content: "5. Reagendamento fácil" },
            {
                type: "p",
                content:
                    "Muitas faltas viram cancelamento porque o cliente não consegue reagendar facilmente. Tenha um link único de reagendamento no próprio lembrete: \"Não vai conseguir vir? Reagende aqui em 10 segundos.\"",
            },
            { type: "h2", content: "Resumo: combo que reduz 60%+" },
            {
                type: "ol",
                content: [
                    "Lembrete WhatsApp 24h e 1h antes (automático)",
                    "Sinal de 20–30% via Pix antes de confirmar",
                    "Lista de espera ativa por horário",
                    "Política clara de no-show",
                    "Link direto pra reagendar dentro do próprio lembrete",
                ],
            },
            {
                type: "p",
                content:
                    "O Agenda Online faz os 5 automaticamente — você só ativa uma vez nas configurações e o sistema cuida do resto.",
            },
        ],
        relatedNichos: ["salao-de-beleza", "barbearia", "clinica-estetica", "manicure"],
    },
    "agenda-online-vs-trinks-comparativo": {
        slug: "agenda-online-vs-trinks-comparativo",
        title: "Agenda Online vs Trinks: comparativo honesto (2026)",
        description: "Comparação detalhada entre Agenda Online e Trinks: preço, recursos, taxa por agendamento e qual escolher para cada tipo de negócio.",
        publishedAt: "2026-05-20",
        readingTime: "8 min",
        category: "Comparativo",
        keyword: "agenda online vs trinks",
        tldr: "Trinks é marketplace (com tráfego próprio, mas cobra 5–10% por agendamento via marketplace e te coloca de igual pra igual com concorrentes). Agenda Online é site próprio (sua marca brilha, sem taxa por agendamento, mas você precisa trazer o tráfego). Quem quer crescer com marca própria: Agenda Online. Quem depende de descoberta no marketplace: Trinks.",
        body: [
            { type: "h2", content: "O que cada um é, em 1 frase" },
            {
                type: "ul",
                content: [
                    "Trinks: marketplace de salões e clínicas (tipo iFood da beleza), com aplicativo próprio.",
                    "Agenda Online: site profissional + agenda 24h focado em fortalecer a marca do seu negócio.",
                ],
            },
            { type: "h2", content: "Preço e modelo de cobrança" },
            {
                type: "p",
                content:
                    "Trinks cobra mensalidade (R$ 89–199) + 5–10% por agendamento que vem via marketplace. Em um salão com 200 agendamentos/mês a ticket médio R$ 80, isso pode somar R$ 800–1.600/mês em taxas além da mensalidade.",
            },
            {
                type: "p",
                content:
                    "Agenda Online: R$ 79–119/mês, sem taxa por agendamento, nunca. Você fica com 100% do que cobra.",
            },
            { type: "h2", content: "Marca própria vs marca emprestada" },
            {
                type: "p",
                content:
                    "No Trinks, sua cliente abre o app do Trinks e vê você listada ao lado de 50 outros salões da região. Você é \"mais um\". No Agenda Online, sua cliente abre seunome.agendaonline.app e vê só você, com sua marca, suas fotos, sua estética.",
            },
            { type: "h2", content: "Tráfego: quem traz cliente?" },
            {
                type: "p",
                content:
                    "Esse é o ponto onde o Trinks tem vantagem: o marketplace dele tem tráfego orgânico próprio, então você pode ser descoberta por cliente que tava buscando \"salão perto de mim\". No Agenda Online, você precisa trazer o tráfego (Instagram, indicação, Google).",
            },
            {
                type: "p",
                content:
                    "Mas atenção: 78% dos agendamentos via Trinks vêm de clientes que o salão já tinha. Ou seja, você paga taxa pra agendar cliente que era seu de qualquer jeito. É lucrativo só se você depende de descoberta no marketplace.",
            },
            { type: "h2", content: "Recursos lado a lado" },
            {
                type: "table",
                content: {
                    headers: ["Recurso", "Agenda Online", "Trinks"],
                    rows: [
                        ["Site próprio com sua marca", "✅", "❌ (só perfil no marketplace)"],
                        ["Taxa por agendamento", "R$ 0", "5–10%"],
                        ["Lembrete WhatsApp", "✅", "✅"],
                        ["Portfólio antes/depois", "✅ (ilimitado)", "Limitado"],
                        ["Vitrine no marketplace", "❌", "✅"],
                        ["Configuração em 3 minutos", "✅", "Setup mais complexo"],
                        ["Preço inicial", "R$ 79/mês", "R$ 89/mês + taxas"],
                    ],
                },
            },
            { type: "h2", content: "Veredito por perfil" },
            {
                type: "ul",
                content: [
                    "Salão consolidado, com base de clientes própria, ativo no Instagram → Agenda Online (você não precisa do marketplace e perde 10% se usar o Trinks)",
                    "Salão novo, sem base, em região com muita concorrência → Trinks pode acelerar a descoberta inicial, mas considere migrar pra Agenda Online quando estabilizar",
                    "Quer marca premium própria → Agenda Online sem dúvida",
                    "Não liga pra marca, quer só receber agendamento → qualquer um funciona",
                ],
            },
        ],
        relatedNichos: ["salao-de-beleza", "clinica-estetica", "barbearia"],
    },
}

export const BLOG_SLUGS = Object.keys(BLOG_POSTS)
