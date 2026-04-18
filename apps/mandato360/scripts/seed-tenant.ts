import { db } from "../lib/db";
import { tenant } from "../lib/db/schema";
import "dotenv/config";

async function seed() {
  console.log("Seeding demo tenant...");
  
  const demoTenant = {
    slug: "vereador",
    name: "Carlos Eduardo (Cadu do Povo)",
    config: JSON.stringify({
      nome: 'Carlos Eduardo (Cadu do Povo)',
      partido: 'REDE',
      cidade: 'Itaguaí',
      foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
      biografia: 'Liderança comunitária em Itaguaí há mais de 15 anos. Cadu iniciou sua trajetória na Associação de Moradores de Monte Serrat, lutando por saneamento e urbanização. Hoje, em seu mandato, foca em transformar a riqueza do Porto em benefícios reais para a população, com foco em educação, emprego jovem e saúde descentralizada.',
      corPrimaria: '#1E3A8A',
      corSecundaria: '#F59E0B',
    })
  };

  try {
    await db.insert(tenant).values(demoTenant).onConflictDoNothing();
    console.log("Seed completed!");
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

seed();
