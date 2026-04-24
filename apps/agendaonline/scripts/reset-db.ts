import "dotenv/config";
import { db } from "../db";
import { 
  user, 
  session, 
  account, 
  verification, 
  tenants, 
  subscriptions, 
  services, 
  categories, 
  appointments,
  tenantDrafts,
  tenantConfigHistory
} from "../db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🧨 Iniciando limpeza total da base de usuários e dados relacionados...");

  try {
    // A ordem importa devido às chaves estrangeiras
    console.log("- Limpando Agendamentos...");
    await db.delete(appointments);

    console.log("- Limpando Histórico de Configurações...");
    await db.delete(tenantConfigHistory);

    console.log("- Limpando Rascunhos de Tenants...");
    await db.delete(tenantDrafts);

    console.log("- Limpando Serviços e Categorias...");
    await db.delete(services);
    await db.delete(categories);

    console.log("- Limpando Assinaturas...");
    await db.delete(subscriptions);

    console.log("- Limpando Tenants (Sites)...");
    await db.delete(tenants);

    console.log("- Limpando Sessões e Contas Auth...");
    await db.delete(session);
    await db.delete(account);

    console.log("- Limpando Verificações...");
    await db.delete(verification);

    console.log("- Limpando Usuários...");
    await db.delete(user);

    console.log("✅ Base de dados limpa com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao limpar base de dados:", error);
  }

  process.exit(0);
}

main().catch(console.error);
