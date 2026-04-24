/**
 * Seed Global Taxonomy
 * Populates: business_types, global_categories, global_services, global_placeholders
 *
 * Run: npx tsx scripts/seed-taxonomy.ts
 */

import postgres from "postgres"
import "dotenv/config"

const DATABASE_URL = process.env.DATABASE_URL!
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1) }

const sql = postgres(DATABASE_URL)

/* ─── Helpers ─── */

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

function deterministicId(prefix: string, name: string): string {
    const slug = slugify(name)
    return `${prefix}-${slug}`
}

/* ─── Data ─── */

interface BusinessTypeSeed {
    name: string
    icon: string
    description: string
    sortOrder: number
    categories: CategorySeed[]
}

interface CategorySeed {
    name: string
    sortOrder: number
    services: ServiceSeed[]
}

interface ServiceSeed {
    name: string
    defaultDuration: number
    defaultPrice: number
    defaultDescription: string
    sortOrder: number
    placeholder: string
    image: string
}

const TAXONOMY: BusinessTypeSeed[] = [
    {
        name: "Salão de Beleza",
        icon: "💇‍♀️",
        description: "Realce sua beleza natural com serviços exclusivos de corte, coloração e tratamentos capilares.",
        sortOrder: 0,
        categories: [
            {
                name: "Cabelo",
                sortOrder: 0,
                services: [
                    { name: "Corte Feminino", defaultDuration: 60, defaultPrice: 80, defaultDescription: "Corte personalizado com lavagem e finalização.", sortOrder: 0, placeholder: "Corte feminino personalizado com lavagem, finalização e secagem profissional.", image: "/images/global-services/corte-feminino.png" },
                    { name: "Escova Modeladora", defaultDuration: 45, defaultPrice: 60, defaultDescription: "Escova com volume e movimento para acabamento impecável.", sortOrder: 1, placeholder: "Escova modeladora com volume e movimento para um acabamento impecável.", image: "/images/global-services/escova-modeladora.png" },
                    { name: "Corte Masculino", defaultDuration: 40, defaultPrice: 50, defaultDescription: "Corte moderno com acabamento na máquina e tesoura.", sortOrder: 2, placeholder: "Corte masculino moderno com acabamento na máquina e tesoura.", image: "/images/global-services/corte-masculino-salao.png" },
                ]
            },
            {
                name: "Coloração & Tratamentos",
                sortOrder: 1,
                services: [
                    { name: "Coloração Completa", defaultDuration: 120, defaultPrice: 180, defaultDescription: "Transformação de cor com produtos premium.", sortOrder: 0, placeholder: "Transformação de cor com produtos premium e proteção capilar.", image: "/images/global-services/coloracao-completa.png" },
                    { name: "Mechas e Luzes", defaultDuration: 150, defaultPrice: 250, defaultDescription: "Mechas iluminadas para realçar o tom natural.", sortOrder: 1, placeholder: "Mechas iluminadas para realçar o tom natural dos fios.", image: "/images/global-services/mechas-e-luzes.png" },
                    { name: "Hidratação Profunda", defaultDuration: 45, defaultPrice: 90, defaultDescription: "Tratamento intensivo para recuperar brilho e maciez.", sortOrder: 2, placeholder: "Tratamento intensivo para recuperar brilho e maciez dos fios.", image: "/images/global-services/hidratacao-profunda.png" },
                ]
            },
            {
                name: "Mãos & Pés",
                sortOrder: 2,
                services: [
                    { name: "Manicure", defaultDuration: 45, defaultPrice: 40, defaultDescription: "Cuidado completo das unhas das mãos.", sortOrder: 0, placeholder: "Cuticulagem e esmaltação cuidadosa para mãos impecáveis.", image: "/images/global-services/manicure-salao.png" },
                    { name: "Pedicure", defaultDuration: 60, defaultPrice: 50, defaultDescription: "Cuidado completo das unhas e pés.", sortOrder: 1, placeholder: "Tratamento dos pés com cuticulagem e esmaltação.", image: "/images/global-services/pedicure-salao.png" },
                    { name: "Spa dos Pés", defaultDuration: 30, defaultPrice: 60, defaultDescription: "Tratamento relaxante e hidratante para os pés.", sortOrder: 2, placeholder: "Esfoliação e massagem para pés renovados e macios.", image: "/images/global-services/spa-dos-pes.png" },
                ]
            }
        ]
    },
    {
        name: "Barbearia",
        icon: "💈",
        description: "Cortes clássicos e modernos, barba impecável e experiência premium.",
        sortOrder: 1,
        categories: [
            {
                name: "Cortes",
                sortOrder: 0,
                services: [
                    { name: "Corte Masculino", defaultDuration: 40, defaultPrice: 50, defaultDescription: "Corte personalizado com acabamento e finalização.", sortOrder: 0, placeholder: "Corte masculino personalizado, incluindo acabamento e finalização.", image: "/images/global-services/corte-masculino-barbearia.png" },
                    { name: "Corte Degradê", defaultDuration: 45, defaultPrice: 55, defaultDescription: "Corte degradê (fade) com transição perfeita.", sortOrder: 1, placeholder: "Corte degradê (fade) com transição perfeita e acabamento preciso.", image: "/images/global-services/corte-degrade.png" },
                    { name: "Corte Masculino + Sobrancelha", defaultDuration: 50, defaultPrice: 65, defaultDescription: "Corte completo com design de sobrancelha na navalha.", sortOrder: 2, placeholder: "Corte completo com design de sobrancelha na navalha ou pinça.", image: "/images/global-services/corte-sobrancelha.png" },
                ]
            },
            {
                name: "Barba & Combos",
                sortOrder: 1,
                services: [
                    { name: "Barba Completa", defaultDuration: 30, defaultPrice: 40, defaultDescription: "Aparar, modelar e hidratar a barba com toalha quente.", sortOrder: 0, placeholder: "Aparar, modelar e hidratar a barba com toalha quente.", image: "/images/global-services/barba-completa.png" },
                    { name: "Barba com Navalha", defaultDuration: 40, defaultPrice: 50, defaultDescription: "Barbearia tradicional com navalha para acabamento perfeito.", sortOrder: 1, placeholder: "Barbearia tradicional com navalha para um acabamento perfeito.", image: "/images/global-services/barba-navalha.png" },
                    { name: "Combo Corte + Barba", defaultDuration: 60, defaultPrice: 75, defaultDescription: "Corte completo + barba modelada com desconto.", sortOrder: 2, placeholder: "Corte completo mais barba modelada com desconto especial.", image: "/images/global-services/combo-corte-barba.png" },
                ]
            },
            {
                name: "Tratamentos Masculinos",
                sortOrder: 2,
                services: [
                    { name: "Limpeza de Pele Express", defaultDuration: 30, defaultPrice: 60, defaultDescription: "Limpeza rápida e refrescante para a pele masculina.", sortOrder: 0, placeholder: "Remoção de impurezas e hidratação rápida da pele.", image: "/images/global-services/limpeza-pele-masculina.png" },
                    { name: "Depilação Nariz/Orelha", defaultDuration: 15, defaultPrice: 20, defaultDescription: "Remoção de pelos indesejados no nariz e orelhas.", sortOrder: 1, placeholder: "Remoção técnica e rápida para um visual mais limpo.", image: "/images/global-services/depilacao-nariz-orelha.png" },
                    { name: "Camuflagem de Cabelos Brancos", defaultDuration: 30, defaultPrice: 70, defaultDescription: "Técnica discreta para suavizar fios brancos.", sortOrder: 2, placeholder: "Aplicação natural para reduzir o contraste dos fios brancos.", image: "/images/global-services/camuflagem-brancos.png" },
                ]
            }
        ]
    },
    {
        name: "Studio de Estética",
        icon: "✨",
        description: "Tratamentos estéticos avançados para realçar sua beleza com tecnologia de ponta.",
        sortOrder: 2,
        categories: [
            {
                name: "Facial",
                sortOrder: 0,
                services: [
                    { name: "Limpeza de Pele", defaultDuration: 60, defaultPrice: 120, defaultDescription: "Limpeza profunda com extração e máscara revitalizante.", sortOrder: 0, placeholder: "Limpeza profunda com extração e máscara revitalizante.", image: "/images/global-services/limpeza-pele.png" },
                    { name: "Peeling Químico", defaultDuration: 45, defaultPrice: 150, defaultDescription: "Renovação celular para uniformizar tom e textura.", sortOrder: 1, placeholder: "Renovação celular para uniformizar o tom e textura da pele.", image: "/images/global-services/peeling-quimico.png" },
                    { name: "Radiofrequência Facial", defaultDuration: 45, defaultPrice: 180, defaultDescription: "Tecnologia para estimular colágeno e firmar a pele.", sortOrder: 2, placeholder: "Tecnologia para estimular colágeno e firmar a pele do rosto.", image: "/images/global-services/radiofrequencia-facial.png" },
                ]
            },
            {
                name: "Corporal",
                sortOrder: 1,
                services: [
                    { name: "Drenagem Linfática", defaultDuration: 60, defaultPrice: 130, defaultDescription: "Massagem manual para reduzir inchaços e toxinas.", sortOrder: 0, placeholder: "Massagem manual para reduzir inchaços e eliminar toxinas do corpo.", image: "/images/global-services/drenagem-linfatica.png" },
                    { name: "Massagem Modeladora", defaultDuration: 60, defaultPrice: 140, defaultDescription: "Técnica firme para contorno corporal.", sortOrder: 1, placeholder: "Técnica firme para contorno corporal e redução de medidas.", image: "/images/global-services/massagem-modeladora.png" },
                    { name: "Depilação a Laser", defaultDuration: 30, defaultPrice: 150, defaultDescription: "Depilação definitiva com tecnologia laser.", sortOrder: 2, placeholder: "Depilação definitiva com tecnologia laser de última geração.", image: "/images/global-services/depilacao-laser.png" },
                ]
            },
            {
                name: "Depilação & Sobrancelhas",
                sortOrder: 2,
                services: [
                    { name: "Depilação com Cera", defaultDuration: 45, defaultPrice: 80, defaultDescription: "Remoção de pelos com cera morna e técnica suave.", sortOrder: 0, placeholder: "Depilação eficaz em diversas áreas do corpo.", image: "/images/global-services/depilacao-cera.png" },
                    { name: "Design de Sobrancelha", defaultDuration: 30, defaultPrice: 45, defaultDescription: "Modelagem de sobrancelha para harmonização facial.", sortOrder: 1, placeholder: "Design personalizado com pinça ou linha.", image: "/images/global-services/design-sobrancelha-estetica.png" },
                    { name: "Henna Sobrancelhas", defaultDuration: 30, defaultPrice: 40, defaultDescription: "Delineamento natural com coloração temporária.", sortOrder: 2, placeholder: "Preenchimento e definição com henna de alta qualidade.", image: "/images/global-services/henna-estetica.png" },
                ]
            }
        ]
    },
    {
        name: "Clínica de Estética",
        icon: "🏥",
        description: "Procedimentos estéticos seguros e eficazes com profissionais qualificados.",
        sortOrder: 3,
        categories: [
            {
                name: "Procedimentos Faciais",
                sortOrder: 0,
                services: [
                    { name: "Limpeza de Pele Avançada", defaultDuration: 75, defaultPrice: 180, defaultDescription: "Protocolo clínico com extração e LED.", sortOrder: 0, placeholder: "Protocolo clínico com extração e LED para resultados duradouros.", image: "/images/global-services/limpeza-pele-avancada.png" },
                    { name: "Botox", defaultDuration: 30, defaultPrice: 600, defaultDescription: "Toxina botulínica para suavizar linhas de expressão.", sortOrder: 1, placeholder: "Toxina botulínica para suavizar linhas de expressão.", image: "/images/global-services/botox.png" },
                    { name: "Preenchimento Facial", defaultDuration: 45, defaultPrice: 700, defaultDescription: "Ácido hialurônico para volume e contorno facial.", sortOrder: 2, placeholder: "Ácido hialurônico para volume e contorno facial natural.", image: "/images/global-services/preenchimento-facial.png" },
                ]
            },
            {
                name: "Procedimentos Corporais",
                sortOrder: 1,
                services: [
                    { name: "Criolipólise", defaultDuration: 60, defaultPrice: 350, defaultDescription: "Eliminação de gordura localizada por resfriamento.", sortOrder: 0, placeholder: "Eliminação de gordura localizada por resfriamento controlado.", image: "/images/global-services/criolipolise.png" },
                    { name: "Lipocavitação", defaultDuration: 45, defaultPrice: 200, defaultDescription: "Ultrassom focado para quebra de células de gordura.", sortOrder: 1, placeholder: "Ultrassom focado para quebra de células de gordura localizada.", image: "/images/global-services/lipocavitacao.png" },
                    { name: "Intradermoterapia", defaultDuration: 45, defaultPrice: 250, defaultDescription: "Aplicação de enzimas para queima de gordura e celulite.", sortOrder: 2, placeholder: "Aplicação localizada de enzimas que aceleram o metabolismo da gordura.", image: "/images/global-services/intradermoterapia.png" },
                ]
            },
            {
                name: "Injetáveis & Rejuvenescimento",
                sortOrder: 2,
                services: [
                    { name: "Bioestimulador de Colágeno", defaultDuration: 60, defaultPrice: 1500, defaultDescription: "Tratamento para flacidez e estimulação de colágeno.", sortOrder: 0, placeholder: "Aplicação de Sculptra ou Radiesse para firmeza da pele.", image: "/images/global-services/bioestimulador-colageno.png" },
                    { name: "Fios de Sustentação", defaultDuration: 90, defaultPrice: 1200, defaultDescription: "Lifting facial não cirúrgico com fios de PDO.", sortOrder: 1, placeholder: "Reposicionamento de tecidos faciais com fios absorvíveis.", image: "/images/global-services/fios-sustentacao.png" },
                    { name: "Mesoterapia Facial", defaultDuration: 45, defaultPrice: 300, defaultDescription: "Aplicação de vitaminas e ativos para rejuvenescimento.", sortOrder: 2, placeholder: "Nutrição profunda e revitalização da pele do rosto.", image: "/images/global-services/mesoterapia-facial.png" },
                ]
            }
        ]
    },
    {
        name: "Nail Designer",
        icon: "💅",
        description: "Design de unhas exclusivo e personalizado com técnicas modernas.",
        sortOrder: 4,
        categories: [
            {
                name: "Mãos",
                sortOrder: 0,
                services: [
                    { name: "Alongamento em Fibra", defaultDuration: 90, defaultPrice: 150, defaultDescription: "Extensão com fibra de vidro para formato perfeito.", sortOrder: 0, placeholder: "Extensão de unhas com fibra de vidro para formato perfeito.\nDuração média de 90 minutos.\nResultado natural e resistente para unhas dos sonhos.", image: "/images/global-services/alongamento-fibra.png" },
                    { name: "Esmaltação em Gel", defaultDuration: 60, defaultPrice: 80, defaultDescription: "Unha em gel com acabamento espelhado e alta durabilidade.", sortOrder: 1, placeholder: "Unha em gel com acabamento espelhado e alta durabilidade.\nDuração média de 60 minutos.\nDuração de até 21 dias sem lascar ou descolar.", image: "/images/global-services/esmaltacao-gel.png" },
                    { name: "Manicure Completa", defaultDuration: 45, defaultPrice: 50, defaultDescription: "Cuticulagem, lixamento e esmaltação premium.", sortOrder: 2, placeholder: "Cuticulagem, lixamento e esmaltação com cuidado premium.\nDuração média de 45 minutos.\nInclui hidratação das mãos e cutículas.", image: "/images/global-services/manicure-nail.png" },
                ]
            },
            {
                name: "Pés & Nail Art",
                sortOrder: 1,
                services: [
                    { name: "Pedicure Spa", defaultDuration: 60, defaultPrice: 65, defaultDescription: "Pedicure completa com spa dos pés e hidratação.", sortOrder: 0, placeholder: "Pedicure completa com spa dos pés e hidratação profunda.\nDuração média de 60 minutos.\nExperiência relaxante com esfoliação e massagem.", image: "/images/global-services/pedicure-spa.png" },
                    { name: "Plástica dos Pés", defaultDuration: 60, defaultPrice: 90, defaultDescription: "Tratamento profundo para calosidades e ressecamento.", sortOrder: 1, placeholder: "Remoção indolor de calosidades e células mortas.\nDuração média de 60 minutos.\nResultado de pés macios e renovados sem o uso de lâminas.", image: "/images/global-services/plastica-pes.png" },
                    { name: "Nail Art Simples", defaultDuration: 30, defaultPrice: 30, defaultDescription: "Decoração artística com até 2 unhas decoradas.", sortOrder: 2, placeholder: "Decoração artística com até 2 unhas decoradas por mão.\nDuração média de 30 minutos.\nDesenhos delicados que complementam sua esmaltação.", image: "/images/global-services/nail-art.png" },
                ]
            },
            {
                name: "Tratamentos e SPA",
                sortOrder: 2,
                services: [
                    { name: "Blindagem de Unhas", defaultDuration: 45, defaultPrice: 70, defaultDescription: "Camada protetora para fortalecer unhas naturais.", sortOrder: 0, placeholder: "Proteção extra para evitar quebras e descamações.", image: "/images/global-services/blindagem-unhas.png" },
                    { name: "Banho de Gel", defaultDuration: 60, defaultPrice: 90, defaultDescription: "Cobertura em gel para brilho e resistência duradoura.", sortOrder: 1, placeholder: "Fortalecimento com acabamento impecável em gel.", image: "/images/global-services/banho-gel.png" },
                    { name: "SPA Profundo de Mãos", defaultDuration: 30, defaultPrice: 45, defaultDescription: "Esfoliação, hidratação e massagem relaxante.", sortOrder: 2, placeholder: "Cuidado intensivo para mãos macias e rejuvenescidas.", image: "/images/global-services/spa-maos.png" },
                ]
            }
        ]
    },
    {
        name: "Studio de Sobrancelhas",
        icon: "👁️",
        description: "Sobrancelhas perfeitas com técnicas exclusivas de design e micropigmentação.",
        sortOrder: 5,
        categories: [
            {
                name: "Design & Lamination",
                sortOrder: 0,
                services: [
                    { name: "Design de Sobrancelhas", defaultDuration: 30, defaultPrice: 45, defaultDescription: "Modelagem com pinça e linha para formato ideal.", sortOrder: 0, placeholder: "Modelagem com pinça e linha para o formato ideal do seu rosto.", image: "/images/global-services/design-sobrancelhas.png" },
                    { name: "Brow Lamination", defaultDuration: 45, defaultPrice: 90, defaultDescription: "Alisamento e fixação para sobrancelhas volumosas.", sortOrder: 1, placeholder: "Alisamento e fixação dos fios para sobrancelhas volumosas e alinhadas.", image: "/images/global-services/brow-lamination.png" },
                    { name: "Henna de Sobrancelhas", defaultDuration: 30, defaultPrice: 40, defaultDescription: "Coloração temporária para definir e preencher.", sortOrder: 2, placeholder: "Coloração temporária com henna para definir e preencher as sobrancelhas.", image: "/images/global-services/henna-sobrancelhas.png" },
                ]
            },
            {
                name: "Micropigmentação & Cílios",
                sortOrder: 1,
                services: [
                    { name: "Micropigmentação Fio a Fio", defaultDuration: 120, defaultPrice: 450, defaultDescription: "Técnica hiperrealista que simula fios naturais.", sortOrder: 0, placeholder: "Técnica hiperrealista que simula fios naturais na sobrancelha.", image: "/images/global-services/micropigmentacao-fio-a-fio.png" },
                    { name: "Micropigmentação Shadow", defaultDuration: 120, defaultPrice: 400, defaultDescription: "Efeito sombreado para sobrancelhas definidas.", sortOrder: 1, placeholder: "Efeito sombreado para sobrancelhas mais definidas e preenchidas.", image: "/images/global-services/micropigmentacao-shadow.png" },
                    { name: "Lifting de Cílios", defaultDuration: 60, defaultPrice: 120, defaultDescription: "Curvatura natural e duradoura para os cílios.", sortOrder: 2, placeholder: "Curvatura natural e duradoura para os cílios sem necessidade de curvex.", image: "/images/global-services/lifting-cilios.png" },
                ]
            },
            {
                name: "Tebori & Microblading",
                sortOrder: 2,
                services: [
                    { name: "Microblading Flow", defaultDuration: 90, defaultPrice: 500, defaultDescription: "Técnica ultra-natural de preenchimento fio a fio.", sortOrder: 0, placeholder: "Fios desenhados com precisão para um olhar renovado.", image: "/images/global-services/microblading-flow.png" },
                    { name: "Retoque Micropigmentação", defaultDuration: 60, defaultPrice: 200, defaultDescription: "Manutenção da cor e formato da micropigmentação.", sortOrder: 1, placeholder: "Ajuste de cor e preenchimento para manter a perfeição.", image: "/images/global-services/retoque-micropigmentacao.png" },
                    { name: "Despigmentação Química", defaultDuration: 45, defaultPrice: 150, defaultDescription: "Remoção gradual de pigmentos indesejados.", sortOrder: 2, placeholder: "Tratamento para clarear tatuagens antigas em sobrancelhas.", image: "/images/global-services/despigmentacao-quimica.png" },
                ]
            }
        ]
    },
    // ─── NEW: 8 business types not previously seeded ───────────────
    {
        name: "Tatuagem e Piercing",
        icon: "🎨",
        description: "Arte na pele com segurança e estilo. Tatuagens exclusivas e piercings profissionais.",
        sortOrder: 6,
        categories: [
            {
                name: "Tatuagens",
                sortOrder: 0,
                services: [
                    { name: "Tattoo Pequena", defaultDuration: 60, defaultPrice: 200, defaultDescription: "Tatuagem autoral de pequeno porte (até 5cm).", sortOrder: 0, placeholder: "Tatuagem autoral ou comercial de pequeno porte (até 5cm).", image: "/images/global-services/tattoo-pequena.png" },
                    { name: "Tattoo Média", defaultDuration: 180, defaultPrice: 500, defaultDescription: "Tatuagem personalizada de médio porte (até 15cm).", sortOrder: 1, placeholder: "Tatuagem personalizada de médio porte (até 15cm).", image: "/images/global-services/tattoo-media.png" },
                    { name: "Tattoo Grande", defaultDuration: 300, defaultPrice: 1000, defaultDescription: "Tatuagem de grande porte ou cobertura.", sortOrder: 2, placeholder: "Tatuagem de grande porte, cobertura ou extensão de trabalho.", image: "/images/global-services/tattoo-grande.png" },
                ]
            },
            {
                name: "Piercings & Cuidados",
                sortOrder: 1,
                services: [
                    { name: "Piercing Orelha", defaultDuration: 30, defaultPrice: 80, defaultDescription: "Aplicação de piercing na orelha com joia inclusa.", sortOrder: 0, placeholder: "Aplicação de piercing na orelha com joia básica inclusa.", image: "/images/global-services/piercing-orelha.png" },
                    { name: "Piercing Nariz/Septo", defaultDuration: 30, defaultPrice: 100, defaultDescription: "Aplicação de piercing nasal ou no septo.", sortOrder: 1, placeholder: "Aplicação de piercing no nariz ou septo com biossegurança total.", image: "/images/global-services/piercing-nariz.png" },
                    { name: "Piercing Corporal", defaultDuration: 30, defaultPrice: 120, defaultDescription: "Aplicação de piercing em outras regiões do corpo.", sortOrder: 2, placeholder: "Aplicação de piercing em diversas regiões do corpo.", image: "/images/global-services/piercing-corporal.png" },
                ]
            },
            {
                name: "Remoção & Cobertura",
                sortOrder: 2,
                services: [
                    { name: "Remoção de Tattoo", defaultDuration: 45, defaultPrice: 150, defaultDescription: "Sessão de remoção de tatuagem a laser.", sortOrder: 0, placeholder: "Tecnologia laser para clareamento e remoção de pigmentos.", image: "/images/global-services/remocao-tattoo.png" },
                    { name: "Cobertura de Cicatrizes", defaultDuration: 120, defaultPrice: 400, defaultDescription: "Tatuagem estética para camuflagem de cicatrizes.", sortOrder: 1, placeholder: "Transforme marcas em arte com técnicas de cobertura.", image: "/images/global-services/cobertura-cicatrizes.png" },
                    { name: "Consultoria de Arte", defaultDuration: 30, defaultPrice: 50, defaultDescription: "Sessão para criação e ajuste de design personalizado.", sortOrder: 2, placeholder: "Defina seu projeto com um tatuador profissional.", image: "/images/global-services/consultoria-arte.png" },
                ]
            }
        ]
    },
    {
        name: "Massagem e SPA",
        icon: "💆‍♂️",
        description: "Recupere suas energias com terapias de relaxamento e bem-estar.",
        sortOrder: 7,
        categories: [
            {
                name: "Relaxantes",
                sortOrder: 0,
                services: [
                    { name: "Massagem Relaxante", defaultDuration: 60, defaultPrice: 120, defaultDescription: "Movimentos suaves para alívio de tensões.", sortOrder: 0, placeholder: "Movimentos suaves e ritmados para alívio de tensões e estresse.", image: "/images/global-services/massagem-relaxante.png" },
                    { name: "Massagem Pedras Quentes", defaultDuration: 75, defaultPrice: 180, defaultDescription: "Terapia com pedras vulcânicas aquecidas.", sortOrder: 1, placeholder: "Terapia relaxante profunda com pedras vulcânicas aquecidas.", image: "/images/global-services/massagem-pedras-quentes.png" },
                    { name: "Massagem Aromática", defaultDuration: 60, defaultPrice: 140, defaultDescription: "Combinação de óleos essenciais e técnicas relaxantes.", sortOrder: 2, placeholder: "Combinação de óleos essenciais selecionados com técnicas relaxantes.", image: "/images/global-services/massagem-aromatica.png" },
                ]
            },
            {
                name: "Terapêuticas",
                sortOrder: 1,
                services: [
                    { name: "Massagem Desportiva", defaultDuration: 60, defaultPrice: 150, defaultDescription: "Recuperação muscular para praticantes de esportes.", sortOrder: 0, placeholder: "Focada na recuperação muscular para praticantes de esportes.", image: "/images/global-services/massagem-desportiva.png" },
                    { name: "Shiatsu", defaultDuration: 60, defaultPrice: 130, defaultDescription: "Técnica japonesa de pressão em pontos energéticos.", sortOrder: 1, placeholder: "Técnica japonesa de pressão em pontos energéticos do corpo.", image: "/images/global-services/shiatsu.png" },
                    { name: "Reflexologia Podal", defaultDuration: 45, defaultPrice: 100, defaultDescription: "Massagem nos pés que estimula órgãos e sistemas.", sortOrder: 2, placeholder: "Massagem terapêutica nos pés que estimula órgãos e sistemas do corpo.", image: "/images/global-services/reflexologia-podal.png" },
                ]
            },
            {
                name: "Estéticas & Revitalizantes",
                sortOrder: 2,
                services: [
                    { name: "Banho de Ofurô", defaultDuration: 45, defaultPrice: 200, defaultDescription: "Imersão relaxante em água aquecida com ervas.", sortOrder: 0, placeholder: "Experiência de relaxamento profundo e purificação.", image: "/images/global-services/banho-ofuro.png" },
                    { name: "Máscara de Ouro", defaultDuration: 45, defaultPrice: 120, defaultDescription: "Tratamento facial luxuoso para brilho e firmeza.", sortOrder: 1, placeholder: "Revitalização facial com partículas de ouro.", image: "/images/global-services/mascara-ouro.png" },
                    { name: "Argiloterapia Corporal", defaultDuration: 60, defaultPrice: 150, defaultDescription: "Aplicação de argila para desintoxicação da pele.", sortOrder: 2, placeholder: "Tratamento natural para equilíbrio e saúde da pele.", image: "/images/global-services/argiloterapia.png" },
                ]
            }
        ]
    },
    {
        name: "Pet Shop",
        icon: "🐾",
        description: "O melhor para o seu melhor amigo. Banho, tosa e cuidados estéticos para pets.",
        sortOrder: 8,
        categories: [
            {
                name: "Banho & Tosa",
                sortOrder: 0,
                services: [
                    { name: "Banho e Tosa Higiênica", defaultDuration: 90, defaultPrice: 80, defaultDescription: "Banho completo com corte de unhas e limpeza de ouvidos.", sortOrder: 0, placeholder: "Banho completo com corte de unhas e limpeza de ouvidos.", image: "/images/global-services/banho-tosa-higienica.png" },
                    { name: "Tosa da Raça", defaultDuration: 120, defaultPrice: 120, defaultDescription: "Corte específico seguindo o padrão da raça.", sortOrder: 1, placeholder: "Corte específico seguindo o padrão da raça do seu pet.", image: "/images/global-services/tosa-raca.png" },
                    { name: "Banho Terapêutico", defaultDuration: 60, defaultPrice: 100, defaultDescription: "Banho com produtos específicos para problemas de pele.", sortOrder: 2, placeholder: "Banho com produtos específicos para o tratamento da pele do pet.", image: "/images/global-services/banho-terapeutico.png" },
                ]
            },
            {
                name: "Estética & Saúde",
                sortOrder: 1,
                services: [
                    { name: "Hidratação de Pelagem", defaultDuration: 30, defaultPrice: 40, defaultDescription: "Tratamento para brilho e maciez dos pelos.", sortOrder: 0, placeholder: "Tratamento para brilho e maciez exuberante dos pelos.", image: "/images/global-services/hidratacao-pelagem.png" },
                    { name: "Escovação de Dentes", defaultDuration: 15, defaultPrice: 20, defaultDescription: "Higiene bucal preventiva para pets.", sortOrder: 1, placeholder: "Higiene bucal preventiva para manter o hálito fresco.", image: "/images/global-services/escovacao-dentes-pet.png" },
                    { name: "Desembolamento", defaultDuration: 60, defaultPrice: 60, defaultDescription: "Remoção cuidadosa de nós na pelagem.", sortOrder: 2, placeholder: "Remoção cuidadosa de nós sem machucar o animal.", image: "/images/global-services/desembolamento-pet.png" },
                ]
            },
            {
                name: "Hospedagem & Creche",
                sortOrder: 2,
                services: [
                    { name: "Dia de Creche", defaultDuration: 480, defaultPrice: 50, defaultDescription: "Período de diversão e socialização durante o dia.", sortOrder: 0, placeholder: "Um dia inteiro de atividades e supervisão para seu pet.", image: "/images/global-services/creche-pet.png" },
                    { name: "Hospedagem Noturna", defaultDuration: 720, defaultPrice: 90, defaultDescription: "Pernoite com todo conforto e segurança.", sortOrder: 1, placeholder: "Hospedagem segura com monitoramento e carinho.", image: "/images/global-services/hospedagem-pet.png" },
                    { name: "Treinamento Básico", defaultDuration: 60, defaultPrice: 150, defaultDescription: "Sessão de adestramento para comandos essenciais.", sortOrder: 2, placeholder: "Comandos de senta, fica e junto para melhor convivência.", image: "/images/global-services/treinamento-pet.png" },
                ]
            }
        ]
    },
    {
        name: "Health & Fitness",
        icon: "💪",
        description: "Treinos personalizados e acompanhamento focado nos seus objetivos de saúde.",
        sortOrder: 9,
        categories: [
            {
                name: "Treinos",
                sortOrder: 0,
                services: [
                    { name: "Consultoria Fitness", defaultDuration: 60, defaultPrice: 150, defaultDescription: "Avaliação física e montagem de treino personalizado.", sortOrder: 0, placeholder: "Avaliação física completa e montagem de plano de treino.", image: "/images/global-services/consultoria-fitness.png" },
                    { name: "Personal Trainer", defaultDuration: 60, defaultPrice: 100, defaultDescription: "Acompanhamento individual em sessão de treino.", sortOrder: 1, placeholder: "Acompanhamento individualizado para máxima performance.", image: "/images/global-services/personal-trainer.png" },
                    { name: "Avaliação Nutricional", defaultDuration: 45, defaultPrice: 120, defaultDescription: "Planejamento alimentar focado em seus objetivos.", sortOrder: 2, placeholder: "Plano alimentar personalizado por nutricionista esportivo.", image: "/images/global-services/avaliacao-nutricional.png" },
                ]
            },
            {
                name: "Avaliações",
                sortOrder: 1,
                services: [
                    { name: "Bioimpedância", defaultDuration: 15, defaultPrice: 50, defaultDescription: "Exame de composição corporal detalhado.", sortOrder: 0, placeholder: "Exame preciso de composição corporal (músculo, gordura, água).", image: "/images/global-services/bioimpedancia.png" },
                    { name: "Avaliação Postural", defaultDuration: 30, defaultPrice: 80, defaultDescription: "Análise da postura para prevenção de lesões.", sortOrder: 1, placeholder: "Análise técnica da postura e indicação de exercícios corretivos.", image: "/images/global-services/avaliacao-postural.png" },
                    { name: "Teste de Esforço", defaultDuration: 45, defaultPrice: 150, defaultDescription: "Avaliação da capacidade cardiovascular respiratória.", sortOrder: 2, placeholder: "Avaliação monitorada da resposta do coração ao exercício.", image: "/images/global-services/teste-esforco.png" },
                ]
            },
            {
                name: "Treinos Coletivos",
                sortOrder: 2,
                services: [
                    { name: "Aula de Yoga", defaultDuration: 60, defaultPrice: 60, defaultDescription: "Sessão coletiva focada em flexibilidade e mente.", sortOrder: 0, placeholder: "Equilíbrio entre corpo e mente em aula compartilhada.", image: "/images/global-services/aula-yoga.png" },
                    { name: "Cross Training", defaultDuration: 60, defaultPrice: 70, defaultDescription: "Treino de alta intensidade com movimentos funcionais.", sortOrder: 1, placeholder: "Desafio físico completo em grupo dinâmico.", image: "/images/global-services/cross-training.png" },
                    { name: "Pilates Solo", defaultDuration: 60, defaultPrice: 65, defaultDescription: "Fortalecimento do core com exercícios de controle.", sortOrder: 2, placeholder: "Melhora da força e flexibilidade com Pilates em grupo.", image: "/images/global-services/pilates-solo.png" },
                ]
            }
        ]
    },
    {
        name: "Educação e Aulas",
        icon: "📚",
        description: "Aulas particulares e mentorias focadas no seu desenvolvimento.",
        sortOrder: 10,
        categories: [
            {
                name: "Aulas",
                sortOrder: 0,
                services: [
                    { name: "Mentoria Individual", defaultDuration: 90, defaultPrice: 150, defaultDescription: "Sessão de mentoria para desenvolvimento profissional.", sortOrder: 0, placeholder: "Sessão de mentoria para desenvolvimento profissional ou pessoal.\nDuração média de 90 minutos.\nPlano de action personalizado com acompanhamento.", image: "/images/global-services/mentoria-individual.png" },
                    { name: "Workshop em Grupo", defaultDuration: 120, defaultPrice: 60, defaultDescription: "Workshop temático para pequenos grupos.", sortOrder: 1, placeholder: "Workshop temático para grupos de até 10 pessoas.\nDuração média de 2 horas.\nMaterial didático incluso e certificado de participação.", image: "/images/global-services/workshop-grupo.png" },
                    { name: "Consultoria de Carreira", defaultDuration: 60, defaultPrice: 180, defaultDescription: "Orientação profissional e planejamento de carreira.", sortOrder: 2, placeholder: "Orientação profissional e planejamento estratégico de carreira.\nDuração média de 60 minutos.\nInclui análise de perfil e definição de metas.", image: "/images/global-services/consultoria-carreira.png" },
                ]
            },
            {
                name: "Idiomas",
                sortOrder: 1,
                services: [
                    { name: "Aula de Inglês", defaultDuration: 60, defaultPrice: 100, defaultDescription: "Aula particular focada em conversação ou gramática.", sortOrder: 0, placeholder: "Aprendizado acelerado com professor particular.", image: "/images/global-services/aula-ingles.png" },
                    { name: "Aula de Espanhol", defaultDuration: 60, defaultPrice: 90, defaultDescription: "Domine o espanhol com aulas dinâmicas e práticas.", sortOrder: 1, placeholder: "Foco em fluência e vocabulário cotidiano.", image: "/images/global-services/aula-espanhol.png" },
                    { name: "Aula de Francês", defaultDuration: 60, defaultPrice: 120, defaultDescription: "Aulas personalizadas do básico ao avançado.", sortOrder: 2, placeholder: "Cultura e língua francesa de forma estruturada.", image: "/images/global-services/aula-frances.png" },
                ]
            },
            {
                name: "Artes & Música",
                sortOrder: 2,
                services: [
                    { name: "Aula de Violão", defaultDuration: 60, defaultPrice: 80, defaultDescription: "Iniciação ao violão com técnicas básicas e repertório.", sortOrder: 0, placeholder: "Aprenda a tocar suas músicas favoritas with método prático.", image: "/images/global-services/aula-violao.png" },
                    { name: "Aula de Pintura", defaultDuration: 90, defaultPrice: 110, defaultDescription: "Técnicas de desenho e pintura em tela ou papel.", sortOrder: 1, placeholder: "Desperte sua criatividade with orientação técnica.", image: "/images/global-services/aula-pintura.png" },
                    { name: "Aula de Canto", defaultDuration: 60, defaultPrice: 130, defaultDescription: "Técnica vocal, respiração e performance.", sortOrder: 2, placeholder: "Desenvolva sua voz with exercícios profissionais.", image: "/images/global-services/aula-canto.png" },
                ]
            }
        ]
    },
    {
        name: "Fotografia",
        icon: "📸",
        description: "Eternize momentos especiais com olhar profissional e arte.",
        sortOrder: 11,
        categories: [
            {
                name: "Ensaios",
                sortOrder: 0,
                services: [
                    { name: "Ensaio Individual", defaultDuration: 60, defaultPrice: 250, defaultDescription: "Sessão fotográfica individual em estúdio ou locação.", sortOrder: 0, placeholder: "Sessão fotográfica individual com direção de poses.", image: "/images/global-services/ensaio-individual.png" },
                    { name: "Ensaio de Casal", defaultDuration: 90, defaultPrice: 400, defaultDescription: "Sessão romântica para registrar momentos especiais.", sortOrder: 1, placeholder: "Sessão romântica para casais em cenários externos ou internos.", image: "/images/global-services/ensaio-casal.png" },

                    { name: "Ensaio Gestante", defaultDuration: 120, defaultPrice: 450, defaultDescription: "Registro delicado da espera pelo bebê.", sortOrder: 2, placeholder: "Registro sensível e artístico da gestação.", image: "https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80" },
                ]
            },
            {
                name: "Eventos",
                sortOrder: 1,
                services: [
                    { name: "Cobertura de Batizado", defaultDuration: 120, defaultPrice: 500, defaultDescription: "Registro completo da cerimônia e recepção.", sortOrder: 0, placeholder: "Fotografia profissional de batizados e celebrações religiosas.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" },
                    { name: "Aniversário Infantil", defaultDuration: 240, defaultPrice: 800, defaultDescription: "Cobertura fotográfica de festas de aniversário.", sortOrder: 1, placeholder: "Registro espontâneo e divertido de festas infantis.", image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&q=80" },
                    { name: "Evento Corporativo", defaultDuration: 180, defaultPrice: 600, defaultDescription: "Fotografia profissional para palestras e reuniões.", sortOrder: 2, placeholder: "Registro de alta qualidade para eventos e marketing empresarial.", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80" },
                ]
            },
            {
                name: "Produtos & Branding",
                sortOrder: 2,
                services: [
                    { name: "Foto de Produto", defaultDuration: 60, defaultPrice: 150, defaultDescription: "Fotografia lifestyle or fundo branco para e-commerce.", sortOrder: 0, placeholder: "Imagens que valorizam seu produto para vendas online.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80" },
                    { name: "Retrato Corporativo", defaultDuration: 30, defaultPrice: 180, defaultDescription: "Foto profissional para LinkedIn e redes sociais.", sortOrder: 1, placeholder: "Posicionamento de marca pessoal através da imagem.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" },
                    { name: "Catálogo de Moda", defaultDuration: 240, defaultPrice: 1200, defaultDescription: "Produção fotográfica completa para marcas de roupas.", sortOrder: 2, placeholder: "Editorial de moda com qualidade de revista.", image: "https://images.unsplash.com/photo-1445205174242-2775f242aa1a?auto=format&fit=crop&q=80" },
                ]
            }
        ]
    },
    {
        name: "Manutenção e Reparos",
        icon: "🛠️",
        description: "Manutenção residencial e comercial com rapidez e confiança.",
        sortOrder: 12,
        categories: [
            {
                name: "Reparos",
                sortOrder: 0,
                services: [
                    { name: "Reparo Elétrico", defaultDuration: 60, defaultPrice: 120, defaultDescription: "Conserto de tomadas, disjuntores e fiação.", sortOrder: 0, placeholder: "Soluções rápidas e seguras para problemas elétricos.", image: "/images/global-services/reparo-eletrico.png" },
                    { name: "Reparo Hidráulico", defaultDuration: 60, defaultPrice: 100, defaultDescription: "Conserto de vazamentos, torneiras e descargas.", sortOrder: 1, placeholder: "Eliminação de vazamentos e manutenção de encanamento.", image: "/images/global-services/reparo-hidraulico.png" },
                    { name: "Pequenos Reparos", defaultDuration: 45, defaultPrice: 80, defaultDescription: "Serviços gerais de 'marido de aluguel'.", sortOrder: 2, placeholder: "Consertos diversos em móveis, portas e janelas.", image: "/images/global-services/pequenos-reparos.png" },
                ]
            },
            {
                name: "Instalação",
                sortOrder: 1,
                services: [
                    { name: "Instalação de TV", defaultDuration: 45, defaultPrice: 90, defaultDescription: "Fixação de suporte e configuração de aparelhos.", sortOrder: 0, placeholder: "Instalação segura de suporte de TV na parede ou painel.", image: "/images/global-services/instalacao-tv.png" },
                    { name: "Instalação de Ar Condicionado", defaultDuration: 180, defaultPrice: 350, defaultDescription: "Instalação técnica de ar condicionado split.", sortOrder: 1, placeholder: "Montagem completa de unidade interna e externa.", image: "/images/global-services/instalacao-ar.png" },
                    { name: "Montagem de Móveis", defaultDuration: 120, defaultPrice: 150, defaultDescription: "Montagem profissional de móveis novos ou usados.", sortOrder: 2, placeholder: "Montagem precisa com ferramentas adequadas.", image: "/images/global-services/montagem-moveis.png" },
                ]
            },
            {
                name: "Reformas & Acabamentos",
                sortOrder: 2,
                services: [
                    { name: "Pintura de Parede", defaultDuration: 240, defaultPrice: 300, defaultDescription: "Pintura residencial ou comercial com acabamento fino.", sortOrder: 0, placeholder: "Renove seus ambientes com pintura profissional.", image: "/images/global-services/pintura-parede.png" },
                    { name: "Instalação de Rodapé", defaultDuration: 120, defaultPrice: 150, defaultDescription: "Colocação de rodapés de madeira, PVC ou poliestireno.", sortOrder: 1, placeholder: "Acabamento perfeito para seus pisos.", image: "/images/global-services/instalacao-rodape.png" },
                    { name: "Troca de Revestimento", defaultDuration: 480, defaultPrice: 600, defaultDescription: "Substituição de azulejos ou pisos em áreas pequenas.", sortOrder: 2, placeholder: "Pequenas reformas de piso e parede com precisão.", image: "/images/global-services/troca-revestimento.png" },
                ]
            }
        ]
    },
    {
        name: "Outros",
        icon: "📝",
        description: "Atendimento de excelência para diversos tipos de serviços especializados.",
        sortOrder: 13,
        categories: [
            {
                name: "Geral",
                sortOrder: 0,
                services: [
                    { name: "Consultoria Geral", defaultDuration: 60, defaultPrice: 150, defaultDescription: "Sessão de consultoria para temas diversos.", sortOrder: 0, placeholder: "Aconselhamento especializado de acordo com sua necessidade.", image: "/images/global-services/consultoria-geral.png" },
                    { name: "Planejamento de Evento", defaultDuration: 90, defaultPrice: 200, defaultDescription: "Organização e logística para pequenos eventos.", sortOrder: 1, placeholder: "Deixe os detalhes do seu evento na mão de um profissional.", image: "/images/global-services/planejamento-evento.png" },
                    { name: "Serviços Administrativos", defaultDuration: 60, defaultPrice: 80, defaultDescription: "Suporte em tarefas de escritório e organização.", sortOrder: 2, placeholder: "Auxílio prático para sua rotina administrativa.", image: "/images/global-services/servicos-administrativos.png" },
                ]
            },
            {
                name: "Especializado",
                sortOrder: 1,
                services: [
                    { name: "Consultoria Jurídica", defaultDuration: 60, defaultPrice: 300, defaultDescription: "Orientação legal inicial para diversos fins.", sortOrder: 0, placeholder: "Esclareça suas dúvidas legais com um advogado.", image: "/images/global-services/consultoria-juridica.png" },
                    { name: "Tradução de Documentos", defaultDuration: 120, defaultPrice: 100, defaultDescription: "Tradução escrita para diferentes idiomas.", sortOrder: 1, placeholder: "Versão técnica ou juramentada de seus documentos.", image: "/images/global-services/traducao-documentos.png" },
                    { name: "Acompanhamento Terapêutico", defaultDuration: 60, defaultPrice: 150, defaultDescription: "Suporte emocional e desenvolvimento pessoal.", sortOrder: 2, placeholder: "Escuta ativa e ferramentas para equilíbrio mental.", image: "/images/global-services/acompanhamento-terapeutico.png" },
                ]
            },
            {
                name: "Suporte Digital & TI",
                sortOrder: 2,
                services: [
                    { name: "Configuração de Rede", defaultDuration: 45, defaultPrice: 80, defaultDescription: "Otimização de sinal Wifi e configuração de roteador.", sortOrder: 0, placeholder: "Melhore sua conexão de internet em casa ou no escritório.", image: "/images/global-services/configuracao-rede.png" },
                    { name: "Remoção de Vírus", defaultDuration: 60, defaultPrice: 120, defaultDescription: "Limpeza e otimização de computadores e notebooks.", sortOrder: 1, placeholder: "Deixe seu equipamento mais rápido e seguro.", image: "/images/global-services/remocao-virus.png" },
                    { name: "Treinamento de Software", defaultDuration: 90, defaultPrice: 150, defaultDescription: "Aulas práticas para uso de ferramentas digitais.", sortOrder: 2, placeholder: "Domine aplicativos e softwares para sua produtividade.", image: "/images/global-services/treinamento-software.png" },
                ]
            }
        ]
    },
]

/* ─── Seed Execution ─── */

async function main() {
    console.log("🌱 Seeding global taxonomy...\n")

    console.log("🧹 Cleaning old taxonomy...")
    try {
        await sql`DELETE FROM global_placeholders`
        await sql`DELETE FROM global_services`
        await sql`DELETE FROM global_categories`
        await sql`DELETE FROM business_types`
        console.log("✅ Old taxonomy cleaned.\n")
    } catch (error) {
        console.warn("⚠️ Could not fully clean taxonomy (likely due to existing references). Proceeding with upsert...")
    }

    for (const bt of TAXONOMY) {
        const btId = deterministicId("bt", bt.name)
        const btSlug = slugify(bt.name)

        // Upsert business type (with new fields)
        await sql`
            INSERT INTO business_types (id, name, slug, icon, emoji, description, sort_order, created_at)
            VALUES (${btId}, ${bt.name}, ${btSlug}, ${bt.icon}, ${bt.icon}, ${bt.description}, ${bt.sortOrder}, now())
            ON CONFLICT (id) DO UPDATE SET
                name = ${bt.name}, slug = ${btSlug}, icon = ${bt.icon},
                emoji = ${bt.icon}, description = ${bt.description}, sort_order = ${bt.sortOrder}
        `
        console.log(`✅ Business Type: ${bt.icon} ${bt.name}`)

        for (const cat of bt.categories) {
            const catId = deterministicId(`gc-${btSlug}`, cat.name)
            const catSlug = slugify(cat.name)

            await sql`
                INSERT INTO global_categories (id, business_type_id, name, slug, sort_order, created_at)
                VALUES (${catId}, ${btId}, ${cat.name}, ${catSlug}, ${cat.sortOrder}, now())
                ON CONFLICT (id) DO UPDATE SET name = ${cat.name}, slug = ${catSlug}, sort_order = ${cat.sortOrder}
            `
            console.log(`   📁 Category: ${cat.name}`)

            for (const svc of cat.services) {
                const svcId = deterministicId(`gs-${btSlug}`, svc.name)
                const svcSlug = slugify(svc.name)

                await sql`
                    INSERT INTO global_services (id, business_type_id, global_category_id, name, slug, image, default_duration, default_price, default_description, sort_order, created_at)
                    VALUES (${svcId}, ${btId}, ${catId}, ${svc.name}, ${svcSlug}, ${svc.image}, ${svc.defaultDuration}, ${svc.defaultPrice}, ${svc.defaultDescription}, ${svc.sortOrder}, now())
                    ON CONFLICT (id) DO UPDATE SET
                        name = ${svc.name}, slug = ${svcSlug}, image = ${svc.image},
                        default_duration = ${svc.defaultDuration}, default_price = ${svc.defaultPrice},
                        default_description = ${svc.defaultDescription}, sort_order = ${svc.sortOrder}
                `

                const phId = deterministicId(`gp-${btSlug}`, svc.name)

                await sql`
                    INSERT INTO global_placeholders (id, global_service_id, placeholder_text, created_at)
                    VALUES (${phId}, ${svcId}, ${svc.placeholder}, now())
                    ON CONFLICT (id) DO UPDATE SET placeholder_text = ${svc.placeholder}
                `

                console.log(`      🔹 Service: ${svc.name} (${svc.defaultDuration}min · R$${svc.defaultPrice})`)
            }
        }
        console.log()
    }

    // Summary
    const types = await sql`SELECT count(*) as c FROM business_types`
    const cats = await sql`SELECT count(*) as c FROM global_categories`
    const svcs = await sql`SELECT count(*) as c FROM global_services`
    const phs = await sql`SELECT count(*) as c FROM global_placeholders`

    console.log("─── Summary ───")
    console.log(`Business Types:      ${types[0].c}`)
    console.log(`Global Categories:   ${cats[0].c}`)
    console.log(`Global Services:     ${svcs[0].c}`)
    console.log(`Global Placeholders: ${phs[0].c}`)
    console.log("\n✨ Taxonomy seed complete!")

    await sql.end()
    process.exit(0)
}

main().catch((err) => {
    console.error("❌ Seed failed:", err)
    process.exit(1)
})
