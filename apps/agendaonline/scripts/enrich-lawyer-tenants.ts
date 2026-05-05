import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function main() {
    console.log("🔍 Finding lawyer tenants to enrich...");
    
    try {
        const lawyers = await sql`
            SELECT t.id, t.slug, t.config, t.name
            FROM tenants t
            JOIN business_types bt ON t.business_type_id = bt.id
            WHERE bt.slug = 'advocacia'
        `;

        console.log(`Found ${lawyers.length} lawyer tenants.`);

        for (const tenant of lawyers) {
            console.log(`📦 Enriching ${tenant.slug}...`);
            
            let config = tenant.config || {};
            if (typeof config === 'string') {
                try {
                    config = JSON.parse(config);
                } catch (e) {
                    config = {};
                }
            }

            // Ensure plugins object exists
            if (!config.plugins) config.plugins = {};

            // Add practiceAreas if missing or empty
            if (!config.plugins.practiceAreas || !config.plugins.practiceAreas.items || config.plugins.practiceAreas.items.length === 0) {
                config.plugins.practiceAreas = {
                    enabled: true,
                    title: "Áreas de *Atuação*",
                    subtitle: "Assessoria jurídica especializada para proteger seus direitos e patrimônio.",
                    items: [
                        { id: "pa-1", title: "Direito Civil", description: "Contratos, responsabilidade civil, direito do consumidor e questões patrimoniais." },
                        { id: "pa-2", title: "Direito Trabalhista", description: "Defesa dos seus direitos trabalhistas, rescisões, horas extras e ações judiciais." },
                        { id: "pa-3", title: "Direito de Família", description: "Divórcio, guarda de filhos, pensão alimentícia, inventário e partilha de bens." },
                    ]
                };
            }

            // Add team if missing or empty
            if (!config.plugins.team || !config.plugins.team.members || config.plugins.team.members.length === 0) {
                config.plugins.team = {
                    enabled: true,
                    title: "Nossa *Equipe*",
                    subtitle: "Profissionais altamente qualificados e dedicados à defesa dos seus direitos.",
                    members: [
                        { id: "m-1", name: `Dr. ${tenant.name.split(" ")[0]}`, role: "Sócio Fundador", bio: "Especialista com ampla experiência em contencioso e consultoria jurídica.", image: "" }
                    ]
                };
            }

            // Update sectionOrder
            let order = config.sectionOrder || ["header", "hero", "trust", "services", "agendamento", "about", "beforeAfter", "faq", "contact", "footer"];
            
            if (!order.includes("practiceAreas")) {
                const svcIdx = order.indexOf("services");
                if (svcIdx !== -1) {
                    order.splice(svcIdx + 1, 0, "practiceAreas");
                } else {
                    order.push("practiceAreas");
                }
            }

            if (!order.includes("team")) {
                const aboutIdx = order.indexOf("about");
                if (aboutIdx !== -1) {
                    order.splice(aboutIdx + 1, 0, "team");
                } else {
                    order.push("team");
                }
            }

            config.sectionOrder = order;

            // Save back
            await sql`
                UPDATE tenants 
                SET config = ${sql.json(config)} 
                WHERE id = ${tenant.id}
            `;
            
            console.log(`✅ ${tenant.slug} enriched successfully!`);
        }

        console.log("🏁 Enrichment completed.");

    } catch (err) {
        console.error("❌ Error during enrichment:", err);
    } finally {
        await sql.end();
    }
}

main();
