import "dotenv/config"
import { db } from "../db"
import { tenants, businessTypes } from "../db/schema"
import { eq } from "drizzle-orm"

async function main() {
    console.log("Procurando tenants do nicho de Advocacia...")
    const bt = await db.query.businessTypes.findFirst({
        where: eq(businessTypes.slug, "advocacia")
    })

    if (!bt) {
        console.log("Nicho de advocacia não encontrado.")
        process.exit(1)
    }

    const lawyerTenants = await db.query.tenants.findMany({
        where: eq(tenants.businessTypeId, bt.id)
    })

    console.log(`Encontrados ${lawyerTenants.length} tenants.`)

    for (const tenant of lawyerTenants) {
        if (!tenant.config) continue;
        
        let config = tenant.config as any;
        let needsUpdate = false;

        if (config?.plugins?.services?.subtitle?.includes("beleza natural") || config?.plugins?.services?.subtitle?.includes("arquitetura do seu rosto")) {
            config.plugins.services.title = "Áreas de *Atuação*"
            config.plugins.services.subtitle = "Assessoria jurídica especializada para proteger seus direitos e patrimônio."
            needsUpdate = true;
        }

        if (needsUpdate) {
            await db.update(tenants)
                .set({ config })
                .where(eq(tenants.id, tenant.id))
            console.log(`Atualizado tenant: ${tenant.name} (${tenant.slug})`)
        } else {
            console.log(`Tenant ${tenant.name} já estava com os textos corretos.`)
        }
    }

    console.log("Finalizado.")
    process.exit(0)
}

main().catch(console.error)
