import { db } from "../lib/db";
import * as schema from "../lib/db/schema";
import * as mock from "../lib/mock-data";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("🚀 Iniciando seed completo...");

  try {
    // 1. Criar Tenant de Teste (Slug: vereador)
    const [demoTenant] = await db.insert(schema.tenant).values({
      slug: "vereador",
      name: "Carlos Eduardo (Cadu do Povo)",
      config: JSON.stringify(mock.configuracaoVereador),
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: schema.tenant.slug,
      set: { name: "Carlos Eduardo (Cadu do Povo)", updatedAt: new Date() }
    }).returning();

    const tenantId = demoTenant.id;
    console.log(`✅ Tenant criado/atualizado: ${demoTenant.slug} (${tenantId})`);

    // 2. Mapas para IDs (MockID -> DBUUID)
    const eleitorIdMap = new Map<string, string>();

    // 3. Seed Eleitores
    console.log("📥 Seeding Eleitores...");
    for (const e of mock.eleitores) {
      const [inserted] = await db.insert(schema.eleitor).values({
        tenantId,
        nome: e.nome,
        email: e.email,
        telefone: e.telefone,
        bairro: e.bairro,
        statusRelacionamento: e.statusRelacionamento,
        observacoes: e.observacoes,
      }).returning();
      eleitorIdMap.set(e.id, inserted.id);
    }
    console.log(`✅ ${mock.eleitores.length} Eleitores inseridos.`);

    // 4. Seed Demandas
    console.log("📥 Seeding Demandas...");
    const demandasToInsert = mock.demandas.map(d => ({
      tenantId,
      eleitorId: eleitorIdMap.get(d.eleitorId)!,
      tipo: d.tipo,
      descricao: d.descricao,
      status: d.status,
      data: new Date(d.data),
    }));
    await db.insert(schema.demanda).values(demandasToInsert);
    console.log(`✅ ${mock.demandas.length} Demandas inseridas.`);

    // 5. Seed Lideranças
    console.log("📥 Seeding Lideranças...");
    const liderancasToInsert = mock.liderancas.map(l => ({
      tenantId,
      nome: l.nome,
      telefone: l.telefone,
      bairro: l.bairro,
      tipo: l.tipo,
      influenciaEstimada: l.influenciaEstimada,
      anotacoes: l.anotacoes,
    }));
    await db.insert(schema.lideranca).values(liderancasToInsert);
    console.log(`✅ ${mock.liderancas.length} Lideranças inseridas.`);

    // 6. Seed Legislativo (PLs, Indicações, Leis Aprovadas)
    console.log("📥 Seeding Legislativo...");
    const legislativoData = [
      ...mock.projetosLei.map(p => ({
        tenantId,
        tipo: "projeto_lei" as const,
        numero: p.numero,
        titulo: p.titulo,
        descricao: p.descricao,
        status: p.status,
        data: new Date(p.data),
      })),
      ...mock.indicacoes.map(i => ({
        tenantId,
        tipo: "indicacao" as const,
        numero: null,
        titulo: i.titulo,
        descricao: `Indicação para o bairro ${i.bairro}`,
        status: i.status === 'concluida' ? 'concluido' : 'pendente' as any, // Mapeamento de status
        data: new Date(i.data),
      })),
      ...mock.leisAprovadas.map(l => ({
        tenantId,
        tipo: "lei_aprovada" as const,
        numero: l.numero,
        titulo: l.titulo,
        descricao: l.descricao,
        status: "aprovado" as const,
        data: new Date(l.data),
      }))
    ];
    await db.insert(schema.legislativo).values(legislativoData);
    console.log(`✅ ${legislativoData.length} itens legislativos inseridos.`);

    // 7. Seed Publicações
    console.log("📥 Seeding Publicações...");
    const publicacoesToInsert = mock.publicacoes.map(p => ({
      tenantId,
      titulo: p.titulo,
      conteudo: p.conteudo,
      imagemUrl: p.imagem,
      data: new Date(p.data),
    }));
    await db.insert(schema.publicacao).values(publicacoesToInsert);
    console.log(`✅ ${mock.publicacoes.length} Publicações inseridas.`);

    console.log("✨ Seed completo com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  }
}

seed();
