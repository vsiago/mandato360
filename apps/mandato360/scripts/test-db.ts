
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function test() {
    try {
        console.log("Testando conexão...");
        const result = await db.execute(sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tenant'`);
        console.log("Colunas encontradas na tabela 'tenant':");
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Erro ao testar DB:", e);
    }
    process.exit(0);
}

test();
