/**
 * Catálogo central de nichos e cidades para SEO programático.
 * Alimenta /para/[nicho], /agenda-online-em/[cidade] e sitemap.ts.
 */

export type Nicho = {
    slug: string
    nome: string
    nomePlural: string
    nomeArtigo: "o" | "a" | "os" | "as"
    h1: string
    metaTitle: string
    metaDescription: string
    dor: string
    promessa: string
    keywordPrincipal: string
    keywordsSecundarias: string[]
    servicosExemplo: string[]
    perguntas: { q: string; a: string }[]
    depoimento: { nome: string; cidade: string; texto: string }
    emoji: string
}

export const NICHOS: Record<string, Nicho> = {
    "salao-de-beleza": {
        slug: "salao-de-beleza",
        nome: "salão de beleza",
        nomePlural: "salões de beleza",
        nomeArtigo: "o",
        h1: "Site com agenda online para salão de beleza",
        metaTitle: "Site com Agenda Online para Salão de Beleza | 7 dias grátis",
        metaDescription:
            "Crie o site do seu salão de beleza com agenda 24h, lembrete no WhatsApp e portfólio antes/depois. Pronto em 3 minutos. 7 dias grátis.",
        dor: "Cansada de responder \"qual horário você tem?\" no WhatsApp de madrugada e ainda assim ver clientes faltarem?",
        promessa: "Tenha um site que mostra seu trabalho, agenda sozinho e manda lembrete pra cliente não esquecer.",
        keywordPrincipal: "site para salão de beleza",
        keywordsSecundarias: [
            "agenda online para salão",
            "sistema de agendamento para salão de beleza",
            "criar site para salão de beleza",
            "agenda online cabeleireiro",
            "como reduzir faltas no salão",
        ],
        servicosExemplo: [
            "Corte feminino",
            "Coloração e mechas",
            "Hidratação profunda",
            "Escova progressiva",
            "Penteado para festa",
            "Manicure e pedicure",
        ],
        perguntas: [
            {
                q: "Quanto custa criar um site para salão de beleza?",
                a: "No Agenda Online, o site profissional do seu salão custa R$ 79/mês no plano Profissional, com 7 dias grátis para testar. Não tem taxa de criação, taxa por agendamento ou multa de cancelamento.",
            },
            {
                q: "Preciso de programador para fazer o site?",
                a: "Não. Você adiciona seu logo, fotos, serviços e preços em 3 minutos. Se você sabe usar Instagram, sabe usar o Agenda Online.",
            },
            {
                q: "Como diminuir faltas de cliente no salão?",
                a: "O Agenda Online envia lembretes automáticos no WhatsApp da cliente 24h antes e 1h antes do horário. Salões que usam o sistema relatam queda de até 60% nas faltas.",
            },
            {
                q: "Posso ter mais de um profissional na agenda?",
                a: "Sim. Cada cabeleireiro, manicure ou esteticista pode ter sua própria agenda, horários e serviços, mas todos aparecem no mesmo site do salão.",
            },
            {
                q: "O cliente precisa baixar app?",
                a: "Não. O cliente abre o link do seu site no celular dele (mesmo iPhone antigo), escolhe o serviço e o horário, e pronto. Sem app, sem senha, sem cadastro.",
            },
        ],
        depoimento: {
            nome: "Cláudia S.",
            cidade: "Belo Horizonte",
            texto: "Minha agenda vive cheia e eu parei de perder tempo respondendo WhatsApp de madrugada.",
        },
        emoji: "💇‍♀️",
    },
    "barbearia": {
        slug: "barbearia",
        nome: "barbearia",
        nomePlural: "barbearias",
        nomeArtigo: "a",
        h1: "Site com agenda online para barbearia",
        metaTitle: "Agenda Online para Barbearia | Site profissional + agenda 24h",
        metaDescription:
            "Site da sua barbearia com agenda automática, lembrete WhatsApp e galeria de cortes. Cliente marca sozinho, sem precisar de app. 7 dias grátis.",
        dor: "Seu cliente espera a barbearia abrir só pra mandar mensagem perguntando se tem horário? Acabou.",
        promessa: "Site com identidade da sua barbearia, agenda 24h e lembrete automático. Cliente marca pelo celular em 15 segundos.",
        keywordPrincipal: "agenda online para barbearia",
        keywordsSecundarias: [
            "sistema para barbearia",
            "agendamento online barbearia",
            "site para barbearia",
            "app para barbearia",
            "como organizar agenda da barbearia",
        ],
        servicosExemplo: [
            "Corte degradê",
            "Barba completa",
            "Combo corte + barba",
            "Acabamento navalhado",
            "Pigmentação de barba",
            "Sobrancelha masculina",
        ],
        perguntas: [
            {
                q: "Qual o melhor sistema de agendamento para barbearia?",
                a: "O Agenda Online é o melhor para barbearias que querem se posicionar como marca, não só ter uma agenda. Você ganha um site profissional + agenda 24h + lembretes WhatsApp por R$ 79/mês, sem taxa por agendamento.",
            },
            {
                q: "Como cadastrar mais de um barbeiro?",
                a: "Cada barbeiro tem sua própria agenda, com horários e folgas independentes. O cliente escolhe com qual quer cortar e o sistema só mostra horários livres daquele profissional.",
            },
            {
                q: "Funciona pra cobrar sinal antecipado?",
                a: "Sim. Você pode exigir pagamento via Pix no momento do agendamento, eliminando o risco de bolo.",
            },
            {
                q: "Posso colocar o link na bio do Instagram?",
                a: "Sim. Você recebe um link curto (suabarbearia.agendaonline.app) que cabe na bio do Instagram, cartão de visita e Google Meu Negócio.",
            },
            {
                q: "Tem versão grátis?",
                a: "Você tem 7 dias grátis para testar todos os recursos do plano Profissional, sem cartão de crédito. Depois, R$ 79/mês.",
            },
        ],
        depoimento: {
            nome: "Rafael M.",
            cidade: "São Paulo",
            texto: "Antes eu perdia uma hora por dia respondendo WhatsApp. Agora o cliente entra no site e marca sozinho.",
        },
        emoji: "💈",
    },
    "clinica-estetica": {
        slug: "clinica-estetica",
        nome: "clínica de estética",
        nomePlural: "clínicas de estética",
        nomeArtigo: "a",
        h1: "Site com agenda online para clínica de estética",
        metaTitle: "Agenda Online para Clínica de Estética | Site + agenda 24h",
        metaDescription:
            "Site premium da sua clínica de estética com agendamento 24h, lembretes no WhatsApp e portfólio de tratamentos. 7 dias grátis, sem cartão.",
        dor: "Sua cliente decide fazer um procedimento e some 3 dias depois? Resgate-a com um site profissional que transmite confiança.",
        promessa: "Site com cara de clínica de alto padrão, agenda automática e portfólio antes/depois que vende sozinho.",
        keywordPrincipal: "sistema para clínica de estética",
        keywordsSecundarias: [
            "agenda online clínica de estética",
            "agendamento estética",
            "site para esteticista",
            "agenda para spa",
            "agenda para depilação a laser",
        ],
        servicosExemplo: [
            "Limpeza de pele profunda",
            "Drenagem linfática",
            "Massagem modeladora",
            "Depilação a laser",
            "Microagulhamento",
            "Peeling químico",
        ],
        perguntas: [
            {
                q: "É um sistema voltado para clínicas de estética?",
                a: "Sim. O Agenda Online tem funcionalidades específicas para estética: portfólio antes/depois, intervalo entre sessões, ficha por cliente e relatório de retorno de procedimentos.",
            },
            {
                q: "Posso registrar fotos de antes e depois?",
                a: "Sim, no plano Completo. As fotos podem ficar no portfólio público do site ou apenas no histórico privado da cliente, com consentimento.",
            },
            {
                q: "Como controlar pacotes de sessões?",
                a: "Você cadastra um pacote (ex.: 10 sessões de laser) e o sistema desconta automaticamente cada sessão concluída, mostrando saldo restante para a cliente.",
            },
            {
                q: "Atende a LGPD?",
                a: "Sim. Os dados das clientes são criptografados, e você tem ferramentas para exportar e excluir dados sob solicitação, conforme a LGPD.",
            },
            {
                q: "Tem ficha de anamnese digital?",
                a: "Sim. Você pode criar formulários de anamnese personalizados por procedimento, que a cliente preenche antes da primeira sessão.",
            },
        ],
        depoimento: {
            nome: "Patrícia L.",
            cidade: "Curitiba",
            texto: "Minhas clientes elogiam o site e dizem que parece de uma clínica de São Paulo. É vendido.",
        },
        emoji: "✨",
    },
    "estudio-tatuagem": {
        slug: "estudio-tatuagem",
        nome: "estúdio de tatuagem",
        nomePlural: "estúdios de tatuagem",
        nomeArtigo: "o",
        h1: "Site com agenda online para estúdio de tatuagem",
        metaTitle: "Agenda Online para Estúdio de Tatuagem | Site + agenda + portfólio",
        metaDescription:
            "Portfólio premium das suas tatuagens com agenda 24h, lembrete WhatsApp e sinal antecipado via Pix. Pare de perder cliente no DM. 7 dias grátis.",
        dor: "DM lotada de \"quanto custa uma tattoo desse tamanho\" sem fechar nenhuma? É hora de subir o nível.",
        promessa: "Site com portfólio profissional, agenda 24h e captação de sinal via Pix. Você só atende quem é sério.",
        keywordPrincipal: "agenda para estúdio de tatuagem",
        keywordsSecundarias: [
            "site para tatuador",
            "portfólio tatuagem online",
            "agendamento tatuagem",
            "como cobrar sinal de tatuagem",
            "site para estúdio de tattoo",
        ],
        servicosExemplo: [
            "Tatuagem pequena (até 10cm)",
            "Tatuagem média (10-20cm)",
            "Tatuagem grande (full sleeve)",
            "Cover-up",
            "Microrealismo",
            "Fineline",
        ],
        perguntas: [
            {
                q: "Posso mostrar meu portfólio de tatuagens no site?",
                a: "Sim. O plano Completo inclui galeria ilimitada de fotos com categorias (blackwork, realismo, fineline, etc.), perfeita para vender estilo antes do agendamento.",
            },
            {
                q: "Como cobrar sinal antecipado?",
                a: "Você integra seu Pix e o cliente paga o sinal no momento de marcar. Sem pagamento, sem horário reservado. Fim dos bolos.",
            },
            {
                q: "Tem ficha de avaliação prévia?",
                a: "Sim. Você cria um formulário com perguntas (alergia, primeira tatuagem, área do corpo, referências) que o cliente preenche antes de você confirmar o agendamento.",
            },
            {
                q: "Posso cobrar valores diferentes por tamanho?",
                a: "Sim. Cada serviço tem preço próprio. Você pode criar 'Tatuagem pequena', 'Média', 'Grande' como serviços separados, cada um com tempo e valor distintos.",
            },
            {
                q: "Funciona pra mais de um tatuador no estúdio?",
                a: "Sim. Cada tatuador tem seu portfólio, agenda e estilo próprios. O cliente escolhe pelo estilo e marca direto com o profissional certo.",
            },
        ],
        depoimento: {
            nome: "Lucas T.",
            cidade: "Rio de Janeiro",
            texto: "Antes eu perdia 20 horas por mês no DM. Hoje só falo com cliente que já pagou sinal.",
        },
        emoji: "🎨",
    },
    "petshop": {
        slug: "petshop",
        nome: "pet shop",
        nomePlural: "pet shops",
        nomeArtigo: "o",
        h1: "Site com agenda online para pet shop e banho e tosa",
        metaTitle: "Agenda Online para Pet Shop | Banho e tosa com agenda 24h",
        metaDescription:
            "Agenda online para pet shop com lembrete WhatsApp, cadastro do pet (raça, porte) e site profissional. Tutores marcam banho e tosa 24h por dia. 7 dias grátis.",
        dor: "Tutores ligando o dia inteiro pra marcar banho e você atendendo enquanto seca um shih-tzu?",
        promessa: "Site do seu pet shop com agenda 24h, cadastro do pet por raça/porte e lembrete automático no WhatsApp.",
        keywordPrincipal: "agendamento pet shop",
        keywordsSecundarias: [
            "agenda online pet shop",
            "sistema para banho e tosa",
            "site para pet shop",
            "agendamento banho e tosa",
            "como organizar agenda do pet shop",
        ],
        servicosExemplo: [
            "Banho (pequeno porte)",
            "Banho e tosa (médio porte)",
            "Tosa higiênica",
            "Tosa na máquina",
            "Hidratação canina",
            "Corte de unhas",
        ],
        perguntas: [
            {
                q: "Posso cadastrar o pet, não só o tutor?",
                a: "Sim. Cada cliente cadastra seus pets (nome, raça, porte, observações), e o sistema calcula o tempo do banho/tosa automaticamente com base no porte.",
            },
            {
                q: "Como cobro preços diferentes por porte do cachorro?",
                a: "Você cria serviços por porte: 'Banho - Pequeno', 'Banho - Médio', 'Banho - Grande'. O tutor seleciona o porte do pet dele e o preço aparece correto.",
            },
            {
                q: "Atende veterinária também?",
                a: "Sim. Você pode cadastrar consultas veterinárias, vacinas e procedimentos como serviços separados, com agendas independentes.",
            },
            {
                q: "Manda lembrete da próxima vacina?",
                a: "No plano Completo, sim. Você programa intervalos (ex.: vacina anual) e o sistema avisa o tutor automaticamente quando estiver próximo.",
            },
            {
                q: "Funciona pra leva e traz?",
                a: "Sim. Você adiciona 'Buscar em casa' como serviço opcional, com taxa e bairros atendidos. O tutor marca tudo junto.",
            },
        ],
        depoimento: {
            nome: "Mariana P.",
            cidade: "Porto Alegre",
            texto: "Os tutores adoram poder marcar banho de madrugada. Minha agenda fica cheia sozinha.",
        },
        emoji: "🐶",
    },
    "nutricionista": {
        slug: "nutricionista",
        nome: "nutricionista",
        nomePlural: "nutricionistas",
        nomeArtigo: "o",
        h1: "Site com agenda online para nutricionista",
        metaTitle: "Agenda Online para Nutricionista | Site + consultas 24h",
        metaDescription:
            "Site profissional do seu consultório com agenda online, consultas presenciais e online, lembrete WhatsApp e ficha de anamnese. 7 dias grátis.",
        dor: "Você passa mais tempo respondendo \"quando você atende?\" do que montando plano alimentar?",
        promessa: "Site com sua credencial, agenda 24h pra primeira consulta e retorno, e ficha de anamnese antes do paciente entrar.",
        keywordPrincipal: "agenda online nutricionista",
        keywordsSecundarias: [
            "site para nutricionista",
            "agendamento consulta nutricional",
            "sistema para consultório de nutrição",
            "como conseguir pacientes nutricionista",
            "agenda nutricionista online",
        ],
        servicosExemplo: [
            "Primeira consulta (60 min)",
            "Retorno (30 min)",
            "Consulta online via vídeo",
            "Avaliação de bioimpedância",
            "Plano alimentar esportivo",
            "Acompanhamento mensal",
        ],
        perguntas: [
            {
                q: "Posso atender online e presencial no mesmo sistema?",
                a: "Sim. Cada serviço pode ser marcado como 'Presencial' ou 'Online'. Na consulta online, o sistema envia automaticamente o link do Google Meet ou Zoom para o paciente.",
            },
            {
                q: "Tem ficha de anamnese para preencher antes?",
                a: "Sim. Você cria seu formulário personalizado (hábitos, restrições, objetivo) e o paciente preenche antes da consulta. Você economiza 15 minutos.",
            },
            {
                q: "Como cobrar plano de acompanhamento mensal?",
                a: "Você cria um pacote (ex.: 4 retornos por R$ X) e o sistema controla quantos já foram utilizados. Ideal para fidelizar.",
            },
            {
                q: "Funciona pra mais de um profissional no consultório?",
                a: "Sim. Plano Completo permite cadastrar outros nutricionistas, cada um com sua agenda, especialidade e valor de consulta.",
            },
            {
                q: "É compatível com CRN e LGPD?",
                a: "Sim. Você pode exibir seu CRN no site, e todos os dados dos pacientes são criptografados e exportáveis conforme exige a LGPD.",
            },
        ],
        depoimento: {
            nome: "Dra. Renata F.",
            cidade: "Florianópolis",
            texto: "Os pacientes chegam com a anamnese já preenchida. Minha consulta rende muito mais.",
        },
        emoji: "🥗",
    },
    "manicure": {
        slug: "manicure",
        nome: "manicure",
        nomePlural: "manicures",
        nomeArtigo: "a",
        h1: "Site com agenda online para manicure",
        metaTitle: "Agenda Online para Manicure | Site + agenda + portfólio",
        metaDescription:
            "Site profissional da sua manicure com agenda 24h, portfólio de nail arts e lembretes WhatsApp. Clientes marcam sozinhas. 7 dias grátis.",
        dor: "Sua agenda no caderno é uma bagunça e cliente esquece o horário?",
        promessa: "Site com seu portfólio de nail arts, agenda 24h e lembrete automático no WhatsApp. Cliente nunca mais esquece.",
        keywordPrincipal: "agenda para manicure",
        keywordsSecundarias: [
            "site para manicure",
            "agenda online manicure",
            "sistema para nail designer",
            "portfólio de unhas online",
            "como ter mais clientes manicure",
        ],
        servicosExemplo: [
            "Manicure + esmaltação comum",
            "Pedicure + esmaltação",
            "Esmaltação em gel",
            "Alongamento em fibra",
            "Banho de gel",
            "Nail art (decoração)",
        ],
        perguntas: [
            {
                q: "Posso mostrar fotos das minhas unhas no site?",
                a: "Sim. O portfólio do plano Completo permite postar fotos categorizadas (gel, francesinha, decoradas) que vendem o agendamento antes mesmo da cliente perguntar o preço.",
            },
            {
                q: "Atendo em casa, funciona?",
                a: "Sim. Você define se atende em domicílio, e pode cobrar taxa de deslocamento por bairro ou km, automaticamente.",
            },
            {
                q: "Como mando lembrete pra cliente não esquecer?",
                a: "O sistema envia WhatsApp 24h antes e 1h antes do horário, automaticamente. Reduz faltas em até 60%.",
            },
            {
                q: "Tem como cobrar antecipado via Pix?",
                a: "Sim. Você pode exigir sinal via Pix para confirmar o horário, evitando que a cliente desmarque em cima da hora.",
            },
            {
                q: "Funciona se eu também faço sobrancelha e cílios?",
                a: "Sim. Você cadastra todos os serviços (manicure, sobrancelha, cílios) em categorias separadas. Cliente pode marcar combo no mesmo horário.",
            },
        ],
        depoimento: {
            nome: "Bia R.",
            cidade: "Recife",
            texto: "Minhas clientes amam ver as fotos das minhas unhas no site antes de marcar. Vendo o serviço pelos olhos.",
        },
        emoji: "💅",
    },
}

export const NICHO_SLUGS = Object.keys(NICHOS)

/**
 * Cidades-alvo para SEO local programático.
 * Lista das 50 maiores cidades do Brasil + capitais.
 */
export type Cidade = {
    slug: string
    nome: string
    uf: string
    populacao: number
    artigo: "em" | "no" | "na"
}

export const CIDADES: Cidade[] = [
    { slug: "sao-paulo", nome: "São Paulo", uf: "SP", populacao: 11451245, artigo: "em" },
    { slug: "rio-de-janeiro", nome: "Rio de Janeiro", uf: "RJ", populacao: 6211423, artigo: "no" },
    { slug: "brasilia", nome: "Brasília", uf: "DF", populacao: 2817381, artigo: "em" },
    { slug: "salvador", nome: "Salvador", uf: "BA", populacao: 2417678, artigo: "em" },
    { slug: "fortaleza", nome: "Fortaleza", uf: "CE", populacao: 2428708, artigo: "em" },
    { slug: "belo-horizonte", nome: "Belo Horizonte", uf: "MG", populacao: 2315560, artigo: "em" },
    { slug: "manaus", nome: "Manaus", uf: "AM", populacao: 2063689, artigo: "em" },
    { slug: "curitiba", nome: "Curitiba", uf: "PR", populacao: 1773733, artigo: "em" },
    { slug: "recife", nome: "Recife", uf: "PE", populacao: 1488920, artigo: "em" },
    { slug: "porto-alegre", nome: "Porto Alegre", uf: "RS", populacao: 1332570, artigo: "em" },
    { slug: "goiania", nome: "Goiânia", uf: "GO", populacao: 1437366, artigo: "em" },
    { slug: "belem", nome: "Belém", uf: "PA", populacao: 1303403, artigo: "em" },
    { slug: "guarulhos", nome: "Guarulhos", uf: "SP", populacao: 1404694, artigo: "em" },
    { slug: "campinas", nome: "Campinas", uf: "SP", populacao: 1138309, artigo: "em" },
    { slug: "sao-luis", nome: "São Luís", uf: "MA", populacao: 1037775, artigo: "em" },
    { slug: "sao-goncalo", nome: "São Gonçalo", uf: "RJ", populacao: 1018064, artigo: "em" },
    { slug: "maceio", nome: "Maceió", uf: "AL", populacao: 957916, artigo: "em" },
    { slug: "duque-de-caxias", nome: "Duque de Caxias", uf: "RJ", populacao: 800966, artigo: "em" },
    { slug: "campo-grande", nome: "Campo Grande", uf: "MS", populacao: 906092, artigo: "em" },
    { slug: "natal", nome: "Natal", uf: "RN", populacao: 751300, artigo: "em" },
    { slug: "teresina", nome: "Teresina", uf: "PI", populacao: 866300, artigo: "em" },
    { slug: "sao-bernardo-do-campo", nome: "São Bernardo do Campo", uf: "SP", populacao: 815100, artigo: "em" },
    { slug: "nova-iguacu", nome: "Nova Iguaçu", uf: "RJ", populacao: 797211, artigo: "em" },
    { slug: "joao-pessoa", nome: "João Pessoa", uf: "PB", populacao: 833932, artigo: "em" },
    { slug: "santo-andre", nome: "Santo André", uf: "SP", populacao: 720966, artigo: "em" },
    { slug: "osasco", nome: "Osasco", uf: "SP", populacao: 699944, artigo: "em" },
    { slug: "jaboatao-dos-guararapes", nome: "Jaboatão dos Guararapes", uf: "PE", populacao: 706867, artigo: "em" },
    { slug: "ribeirao-preto", nome: "Ribeirão Preto", uf: "SP", populacao: 720116, artigo: "em" },
    { slug: "uberlandia", nome: "Uberlândia", uf: "MG", populacao: 713224, artigo: "em" },
    { slug: "contagem", nome: "Contagem", uf: "MG", populacao: 668949, artigo: "em" },
    { slug: "sorocaba", nome: "Sorocaba", uf: "SP", populacao: 723634, artigo: "em" },
    { slug: "aracaju", nome: "Aracaju", uf: "SE", populacao: 664908, artigo: "em" },
    { slug: "feira-de-santana", nome: "Feira de Santana", uf: "BA", populacao: 619609, artigo: "em" },
    { slug: "cuiaba", nome: "Cuiabá", uf: "MT", populacao: 650912, artigo: "em" },
    { slug: "joinville", nome: "Joinville", uf: "SC", populacao: 597658, artigo: "em" },
    { slug: "juiz-de-fora", nome: "Juiz de Fora", uf: "MG", populacao: 540756, artigo: "em" },
    { slug: "londrina", nome: "Londrina", uf: "PR", populacao: 575377, artigo: "em" },
    { slug: "aparecida-de-goiania", nome: "Aparecida de Goiânia", uf: "GO", populacao: 590146, artigo: "em" },
    { slug: "niteroi", nome: "Niterói", uf: "RJ", populacao: 515317, artigo: "em" },
    { slug: "ananindeua", nome: "Ananindeua", uf: "PA", populacao: 525566, artigo: "em" },
    { slug: "porto-velho", nome: "Porto Velho", uf: "RO", populacao: 460434, artigo: "em" },
    { slug: "serra", nome: "Serra", uf: "ES", populacao: 520653, artigo: "na" },
    { slug: "caxias-do-sul", nome: "Caxias do Sul", uf: "RS", populacao: 517451, artigo: "em" },
    { slug: "campos-dos-goytacazes", nome: "Campos dos Goytacazes", uf: "RJ", populacao: 491288, artigo: "em" },
    { slug: "florianopolis", nome: "Florianópolis", uf: "SC", populacao: 508826, artigo: "em" },
    { slug: "macapa", nome: "Macapá", uf: "AP", populacao: 503327, artigo: "em" },
    { slug: "vila-velha", nome: "Vila Velha", uf: "ES", populacao: 467579, artigo: "em" },
    { slug: "mauá", nome: "Mauá", uf: "SP", populacao: 427580, artigo: "em" },
    { slug: "sao-jose-do-rio-preto", nome: "São José do Rio Preto", uf: "SP", populacao: 480124, artigo: "em" },
    { slug: "santos", nome: "Santos", uf: "SP", populacao: 432516, artigo: "em" },
    { slug: "vitoria", nome: "Vitória", uf: "ES", populacao: 322869, artigo: "em" },
]

export const CIDADE_SLUGS = CIDADES.map((c) => c.slug)

/**
 * Concorrentes para páginas de comparação.
 */
export type Concorrente = {
    slug: string
    nome: string
    descricaoCurta: string
    pontoForte: string
    pontoFraco: string
    precoMedio: string
    taxaPorAgendamento: string
}

export const CONCORRENTES: Record<string, Concorrente> = {
    "trinks": {
        slug: "trinks",
        nome: "Trinks",
        descricaoCurta: "Marketplace de salões e clínicas de estética, focado em conectar consumidores a profissionais.",
        pontoForte: "Possui vitrine pública (marketplace) com tráfego próprio.",
        pontoFraco: "Cobra taxa por agendamento via marketplace; salão fica sem marca própria.",
        precoMedio: "R$ 89 – R$ 199/mês",
        taxaPorAgendamento: "5% – 10% por agendamento via marketplace",
    },
    "booksy": {
        slug: "booksy",
        nome: "Booksy",
        descricaoCurta: "App internacional de agendamento, popular entre barbearias e salões.",
        pontoForte: "App próprio para clientes (com 10M+ downloads globais).",
        pontoFraco: "Cliente precisa baixar app; sem site próprio com marca do salão; suporte focado em outros mercados.",
        precoMedio: "R$ 99 – R$ 249/mês",
        taxaPorAgendamento: "Sem taxa no básico; taxa em recursos premium",
    },
    "belezix": {
        slug: "belezix",
        nome: "Belezix",
        descricaoCurta: "Sistema brasileiro de gestão para salões e clínicas.",
        pontoForte: "Foco em gestão financeira completa.",
        pontoFraco: "Interface complexa; foco em gestão, não em aquisição de clientes; sem site profissional incluso.",
        precoMedio: "R$ 99 – R$ 299/mês",
        taxaPorAgendamento: "Sem taxa",
    },
}

export const CONCORRENTE_SLUGS = Object.keys(CONCORRENTES)
