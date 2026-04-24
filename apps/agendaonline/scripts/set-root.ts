import "dotenv/config";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Erro: Forneça o e-mail do usuário.");
    console.log("Uso: npx tsx scripts/set-root.ts seu@email.com");
    return;
  }

  console.log(`🚀 Promovendo ${email} para root...`);

  const result = await db.update(user)
    .set({ role: "root" })
    .where(eq(user.email, email))
    .returning();

  if (result.length > 0) {
    console.log(`✅ Sucesso! O usuário ${result[0].name} agora é root.`);
  } else {
    console.error("❌ Erro: Usuário não encontrado.");
  }

  process.exit(0);
}

main().catch(console.error);
