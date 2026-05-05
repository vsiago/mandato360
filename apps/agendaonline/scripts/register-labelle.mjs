import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const TENANT_ID = crypto.randomUUID();
const SLUG = 'labellestudio62';
const NAME = 'Espaço La Belle';
const FULL_NAME = 'Espaço La Belle | salão de beleza e estética';
async function register() {
    console.log(`Registering tenant: ${FULL_NAME} (${SLUG})`);

    try {
        // Find owner ID
        const users = await sql`SELECT id FROM "user" WHERE email = 'vsiago21@gmail.com'`;
        if (users.length === 0) {
            throw new Error('Owner user not found');
        }
        const ownerId = users[0].id;
        console.log(`Using owner ID: ${ownerId}`);

        // 1. Create or Update Tenant
        const existing = await sql`SELECT id FROM tenants WHERE slug = ${SLUG}`;
        let tenantId = TENANT_ID;

        if (existing.length > 0) {
            tenantId = existing[0].id;
            console.log('Tenant already exists. Updating...');
            await sql`
                UPDATE tenants SET
                    name = ${NAME},
                    description = '✦ Tudo oque você precisa em um só lugar!✨',
                    phone = '51999522618',
                    whatsapp = '51999522618',
                    address = 'Av bernardino Silveira Amorim, 3770 N102',
                    instagram = 'labellestudio62',
                    primary_color = '#E8A83A',
                    hover_color = '#C98D2E',
                    hero_headline = 'Realce sua beleza natural',
                    hero_highlight = 'no Espaço La Belle',
                    cta_text = 'Agendar Agora',
                    hero_badge = 'NOVIDADE',
                    theme = 'premium',
                    onboarding_completed = true,
                    is_demo = true,
                    claimed = false
                WHERE id = ${tenantId}
            `;
        } else {
            await sql`
                INSERT INTO tenants (
                    id, slug, name, business_type_id, description, 
                    primary_color, hover_color, phone, whatsapp, 
                    address, instagram, onboarding_completed, owner_id,
                    theme, is_demo, claimed, config
                ) VALUES (
                    ${tenantId},
                    ${SLUG},
                    ${NAME},
                    'bt-salao-de-beleza',
                    '✦ Tudo oque você precisa em um só lugar!✨',
                    '#E8A83A',
                    '#C98D2E',
                    '51999522618',
                    '51999522618',
                    'Av bernardino Silveira Amorim, 3770 N102',
                    'labellestudio62',
                    true,
                    ${ownerId},
                    'Realce sua beleza natural',
                    'no Espaço La Belle',
                    'Agendar Agora',
                    'NOVIDADE',
                    'premium',
                    true,
                    false,
                    ${JSON.stringify({
                        hero: {
                            title: 'Realce sua beleza natural',
                            description: '✦ Tudo oque você precisa em um só lugar!✨',
                            orientation: 'left',
                            autoHeight: true
                        },
                        sectionOrder: ['hero', 'services', 'beforeAfter', 'faq', 'contact']
                    })}
                )
            `;
            console.log('Tenant created successfully!');
        }

        // 2. Add Categories
        const cats = [
            { label: 'Cabelo', slug: 'cabelo' },
            { label: 'Unhas', slug: 'unhas' },
            { label: 'Estética', slug: 'estetica' }
        ];

        for (const cat of cats) {
            const existingCat = await sql`SELECT id FROM categories WHERE tenant_id = ${tenantId} AND slug = ${cat.slug}`;
            if (existingCat.length === 0) {
                await sql`
                    INSERT INTO categories (id, tenant_id, label, slug)
                    VALUES (${crypto.randomUUID()}, ${tenantId}, ${cat.label}, ${cat.slug})
                `;
            }
        }
        console.log('Categories synced.');

        // 3. Add Services
        const services = [
            { category: 'cabelo', name: 'Corte Feminino', price: 60.00, duration: 60 },
            { category: 'cabelo', name: 'Escova e Lavagem', price: 45.00, duration: 40 },
            { category: 'unhas', name: 'Pé e Mão', price: 50.00, duration: 90 },
            { category: 'unhas', name: 'Manicure', price: 25.00, duration: 45 },
            { category: 'estetica', name: 'Limpeza de Pele', price: 120.00, duration: 90 },
            { category: 'estetica', name: 'Design de Sobrancelha', price: 35.00, duration: 30 }
        ];

        for (const svc of services) {
            const catRow = await sql`SELECT id FROM categories WHERE tenant_id = ${tenantId} AND slug = ${svc.category}`;
            if (catRow.length > 0) {
                const catId = catRow[0].id;
                const existingSvc = await sql`SELECT id FROM services WHERE tenant_id = ${tenantId} AND name = ${svc.name}`;
                if (existingSvc.length === 0) {
                    await sql`
                        INSERT INTO services (id, tenant_id, category_id, name, slug, price, duration, is_active)
                        VALUES (
                            ${crypto.randomUUID()}, 
                            ${tenantId}, 
                            ${catId}, 
                            ${svc.name}, 
                            ${svc.name.toLowerCase().replace(/ /g, '-')}, 
                            ${svc.price}, 
                            ${svc.duration}, 
                            true
                        )
                    `;
                }
            }
        }
        console.log('Services synced.');

        console.log(`\nSite pronto em: http://labellestudio62.agendaonline.app/ (ou use o domínio local com o slug)`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sql.end();
    }
}

register();
