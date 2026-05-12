import { db } from "../db";
import { tenants, categories, services, user } from "../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { buildDefaultEditorConfig } from "../lib/default-editor-config";

const DATA = {
    niche: 'Salão de Beleza',
    name: 'Jaque Geovanelle',
    surname: 'Micropigmentação & Brow Lamination',
    title: 'Studio Jaque Geovanelle | Brow Lamination & Micropigmentação',
    description: 'Especialista em Brow Lamination, Micropigmentação de sobrancelhas e labial. Realce sua beleza natural com técnicas exclusivas no Centro de Itaguaí.',
    colors: {
        primary: '#8c6239', // Bronze Gold Sofisticado
        hover: '#6d4a2a',    // Bronze Profundo
    },
    contact: {
        phone: '(21) 96655-9255',
        whatsapp: '5521966559255',
        address: 'R. Aníbal Alves, 106 - Centro, Itaguaí - RJ, 23810-390',
        instagram: 'jaquegeovanelle',
        mapEmbedUrl: ''
    },
    categories: [
        { id: 'sobrancelhas', label: 'Sobrancelhas' },
        { id: 'labios', label: 'Lábios' },
        { id: 'pele', label: 'Pele' }
    ],
    services: [
        { id: 'design-personalizado', categoryId: 'sobrancelhas', name: "Design Personalizado", description: "Técnica exclusiva para desenhar a sobrancelha ideal para o seu formato de rosto.", image: "https://negociosdebeleza.beautyfair.com.br/wp-content/uploads/2024/08/design-de-sobrancelhas-1.webp" },
        { id: 'design-com-tintura', categoryId: 'sobrancelhas', name: "Design com Tintura", description: "Design perfeito alinhado com coloração para destacar e preencher fios claros ou finos.", image: "https://negociosdebeleza.beautyfair.com.br/wp-content/uploads/2024/07/coloracao-para-sobrancelhas-capa-1.webp" },
        { id: 'design-masculino', categoryId: 'sobrancelhas', name: "Design Masculino", description: "Limpeza e alinhamento natural dos fios, mantendo a expressão e masculinidade do olhar.", image: "https://vocemerecetudo.com/wp-content/uploads/2025/07/4-8-1.webp" },
        { id: 'brow-lamination', categoryId: 'sobrancelhas', name: "Brow Lamination", description: "Alinhamento dos fios, proporcionando volume, preenchimento e aspecto natural.", image: "https://www.maybelline.com.br/-/media/project/loreal/brand-sites/mny/americas/br/artigos/2024/olhos/sobrancelha/brow-lamination/brow-lamination.jpg?rev=9503a04edfeb40d9846f1f1812a530b8&cx=0.45&cy=0.61&cw=650&ch=650&hash=1818B76889E7DC36CB7F2CA1A8DDC5BE" },
        { id: 'micropigmentacao-fio-a-fio', categoryId: 'sobrancelhas', name: "Micropigmentação Fio a Fio", description: "Fios perfeitamente desenhados com precisão para corrigir falhas e garantir naturalidade.", image: "/sombrancelha.png" },
        { id: 'micropigmentacao-labial', categoryId: 'labios', name: "Micropigmentação Labial", description: "Revitalização profunda. Traz uma cor saudável, contorno definido e efeito de lábios hidratados.", image: "https://static.wixstatic.com/media/0a37dc_c1018d0587fe466e8d0126e10609a8cd~mv2.png/v1/fill/w_568,h_370,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a37dc_c1018d0587fe466e8d0126e10609a8cd~mv2.png" },
        { id: 'hidragloss', categoryId: 'labios', name: "Hidragloss", description: "Tratamento de super hidratação e rejuvenescimento labial que devolve o brilho e maciez.", image: "https://static.wixstatic.com/media/8b1c0b_54438c4e1beb4fe2bf73f61d92c2c7b5~mv2.jpg/v1/fill/w_568,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/8b1c0b_54438c4e1beb4fe2bf73f61d92c2c7b5~mv2.jpg" },
        { id: 'dermaplaning', categoryId: 'pele', name: "Dermaplaning", description: "Tratamentos faciais para revitalização, limpeza profunda e hidratação, devolvendo o viço e a saúde do seu rosto.", image: "/pele-rosto.png" }
    ],
    faq: [
        { id: '1', question: "O que é Brow Lamination?", answer: "A Brow Lamination é uma técnica não invasiva que alinha e fixa os fios naturais das sobrancelhas, criando um design mais volumoso, encorpado e moderno." },
        { id: '2', question: "A micropigmentação dói?", answer: "O procedimento é altamente tolerável. Utilizamos anestésicos tópicos de qualidade premium para garantir o máximo de conforto durante todo o processo." },
        { id: '3', question: "Quanto tempo dura a micropigmentação?", answer: "A durabilidade varia de acordo com o tipo de pele e os cuidados pós-procedimento, mas em média, a micropigmentação (sobrancelhas ou lábios) dura de 8 meses a 2 anos." },
        { id: '4', question: "Onde o studio está localizado?", answer: "Estamos na Casa Beauty, Rua Aníbal Alves, 106, Centro, Itaguaí Rua atrás do shopping (galeria), vira à esquerda. Na rua entre a sorveteria Oggi e a igreja Batista." }
    ],
    founder: {
        name: 'Jaque Geovanelle',
        bio: 'Empreendedora da beleza, apaixonada por transformar vidas através da autoestima. Minha missão é entregar naturalidade e excelência em cada detalhe, realçando a beleza única de cada cliente na Casa Beauty.',
        role: 'Especialista em Micropigmentação & Brow Lamination',
        imageUrl: '/studio-jaqueline-perfil.jpg'
    },
    trustBadges: [
        { text: 'Avaliação 5.0 (152)', icon: 'Star' },
        { text: 'Empresa de Empreendedoras', icon: 'ShieldCheck' }
    ],
    beforeAfter: [
        { id: '1', title: "Micropigmentação Fio a Fio", before: "/jaque-studio-antes-e-depois/Brow Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Brow Depois-100.jpg" },
        { id: '2', title: "Brow Lamination", before: "/jaque-studio-antes-e-depois/Brow Lamination Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Brow Lamination Depois-100.jpg" },
        { id: '3', title: "Brow Lamination", before: "/jaque-studio-antes-e-depois/Brow Lamination Antes_1-100.jpg", after: "/jaque-studio-antes-e-depois/Brow Lamination Depois_1-100.jpg" },
        { id: '4', title: "Design Masculino", before: "/jaque-studio-antes-e-depois/Design Masculino Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Design Masculino Depois-100.jpg" },
        { id: '5', title: "Design Personalizado", before: "/jaque-studio-antes-e-depois/Design Personalizado Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Design Personalizado Depois-100.jpg" },
        { id: '6', title: "Hidragloss", before: "/jaque-studio-antes-e-depois/Hidragloss Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Hidragloss Depois-100.jpg" },
        { id: '7', title: "Micropigmentação Labial", before: "/jaque-studio-antes-e-depois/Micro Labial Antes-100.jpg", after: "/jaque-studio-antes-e-depois/Micro Labial Depois-100.jpg" },
    ]
}

async function main() {
    const slug = "jaque-geovanelle"; 
    
    const owner = await db.query.user.findFirst();
    if (!owner) {
        console.error("No user found.");
        return;
    }

    // Delete existing manually to handle FKs
    const existing = await db.query.tenants.findFirst({ where: eq(tenants.slug, slug) });
    if (existing) {
        console.log(`Cleaning up existing tenant: ${slug}`);
        await db.delete(services).where(eq(services.tenantId, existing.id));
        await db.delete(categories).where(eq(categories.tenantId, existing.id));
        await db.delete(tenants).where(eq(tenants.id, existing.id));
    }

    const defaultConfig = buildDefaultEditorConfig({
        name: DATA.name,
        heroImage: "/studio-jaqueline.png",
        primaryColor: DATA.colors.primary,
        hoverColor: DATA.colors.hover,
        heroHeadline: "Realce sua beleza de forma Natural e Perfeita.",
        heroBadge: "Especialista em Sobrancelhas & Lábios",
        description: DATA.description,
        nicheSlug: "salao-de-beleza"
    });

    // Manually fix beforeAfter in config
    if (defaultConfig.plugins) {
        defaultConfig.plugins.beforeAfter = {
            enabled: true,
            title: "Nossos *Resultados*",
            subtitle: "Confira as transformações reais de nossas clientes.",
            items: DATA.beforeAfter
        };
    }

    // Insert Tenant
    const tenantResult = await db.insert(tenants).values({
        slug: slug,
        name: DATA.name,
        surname: DATA.surname,
        businessTypeId: "bt-salao-de-beleza",
        description: DATA.description,
        primaryColor: DATA.colors.primary,
        hoverColor: DATA.colors.hover,
        phone: DATA.contact.phone,
        whatsapp: DATA.contact.whatsapp,
        address: DATA.contact.address,
        instagram: DATA.contact.instagram,
        logoUrl: "/logo-studio-jaqueline.png",
        heroImageUrl: "/studio-jaqueline.png",
        profileImageUrl: DATA.founder.imageUrl,
        founderName: DATA.founder.name,
        founderBio: DATA.founder.bio,
        founderRole: DATA.founder.role,
        heroBadge: "Especialista em Sobrancelhas & Lábios",
        heroHeadline: "Realce sua beleza de forma Natural e Perfeita.",
        heroHighlight: "Natural e Perfeita",
        trustBadges: DATA.trustBadges,
        faq: DATA.faq,
        beforeAfter: DATA.beforeAfter,
        ownerId: owner.id,
        onboardingCompleted: true,
        theme: "neutro",
        config: defaultConfig
    }).returning();

    const tenantId = tenantResult[0].id;

    // Insert Categories
    const catMap = new Map();
    for (const cat of DATA.categories) {
        const catId = crypto.randomUUID();
        await db.insert(categories).values({
            id: catId,
            tenantId,
            label: cat.label,
            slug: cat.id,
            sortOrder: 0
        });
        catMap.set(cat.id, catId);
    }

    // Insert Services
    for (const svc of DATA.services) {
        await db.insert(services).values({
            tenantId,
            categoryId: catMap.get(svc.categoryId),
            name: svc.name,
            slug: svc.id,
            description: svc.description,
            image: svc.image,
            isActive: true,
            sortOrder: 0,
            duration: 60,
            price: "0"
        });
    }

    console.log(`Successfully migrated to dynamic tenant: /${slug}`);
}

main().catch(console.error);
