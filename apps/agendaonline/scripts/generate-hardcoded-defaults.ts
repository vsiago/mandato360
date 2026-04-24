import postgres from "postgres";
import "dotenv/config";
import fs from "fs";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function generateDefaults() {
    try {
        const businessTypes = await sql`SELECT * FROM business_types ORDER BY sort_order ASC`;
        
        let catOutput = "    const map: Record<string, { id: string; label: string }[]> = {\n";
        let svcOutput = "    const map: Record<string, { id: string; name: string; description: string; duration: number; price: number; categoryId: string; image: string }[]> = {\n";

        for (const bt of businessTypes) {
            const cats = await sql`SELECT * FROM global_categories WHERE business_type_id = ${bt.id} ORDER BY sort_order ASC`;
            const svcs = await sql`SELECT * FROM global_services WHERE business_type_id = ${bt.id} ORDER BY sort_order ASC`;

            catOutput += `        "${bt.name}": [\n`;
            for (const c of cats) {
                catOutput += `            { id: "${c.slug}", label: "${c.name}" },\n`;
            }
            catOutput += `        ],\n`;

            svcOutput += `        "${bt.name}": [\n`;
            for (const s of svcs) {
                const globalCat = cats.find(c => c.id === s.global_category_id);
                svcOutput += `            { id: "sv-${s.slug}", name: "${s.name}", description: "${s.default_description}", duration: ${s.default_duration}, price: ${s.default_price}, categoryId: "${globalCat?.slug}", image: "${s.image || ''}" },\n`;
            }
            svcOutput += `        ],\n`;
        }

        catOutput += "    }";
        svcOutput += "    }";

        const finalOutput = `--- CATEGORIES ---\n\n${catOutput}\n\n--- SERVICES ---\n\n${svcOutput}`;
        fs.writeFileSync("scripts/new-defaults.txt", finalOutput);
        console.log("✅ Written to scripts/new-defaults.txt");

    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
        process.exit();
    }
}

generateDefaults();
