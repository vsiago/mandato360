import postgres from "postgres";
import * as dotenv from "dotenv";
dotenv.config();

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function migrate() {
  console.log("🚀 Applying MVP migration...");

  // Create new enums
  await sql.unsafe(`
    DO $$ BEGIN
      CREATE TYPE lead_funil AS ENUM ('novo', 'contato', 'engajado', 'apoiador', 'lideranca', 'inativo');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE agenda_tipo AS ENUM ('visita', 'acao', 'audiencia', 'reuniao', 'evento', 'outro');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE pesquisa_status AS ENUM ('rascunho', 'ativa', 'encerrada');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE indicacao_popular_status AS ENUM ('pendente', 'analise', 'encaminhada', 'resolvida', 'rejeitada');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);
  console.log("✅ Enums created");

  // Expand tenant table
  await sql.unsafe(`
    ALTER TABLE tenant
      ADD COLUMN IF NOT EXISTS hero_headline text DEFAULT 'Por uma cidade de',
      ADD COLUMN IF NOT EXISTS hero_highlight text DEFAULT 'Resultados',
      ADD COLUMN IF NOT EXISTS hero_badge text DEFAULT 'Mandato Participativo',
      ADD COLUMN IF NOT EXISTS hero_image_url text,
      ADD COLUMN IF NOT EXISTS hero_description text,
      ADD COLUMN IF NOT EXISTS hero_cta_text text DEFAULT 'Solicitar Demanda',
      ADD COLUMN IF NOT EXISTS tagline text DEFAULT 'Mandato Participativo',
      ADD COLUMN IF NOT EXISTS partido text,
      ADD COLUMN IF NOT EXISTS cidade text,
      ADD COLUMN IF NOT EXISTS cargo text DEFAULT 'Vereador',
      ADD COLUMN IF NOT EXISTS whatsapp text,
      ADD COLUMN IF NOT EXISTS telefone text,
      ADD COLUMN IF NOT EXISTS email_contato text,
      ADD COLUMN IF NOT EXISTS instagram text,
      ADD COLUMN IF NOT EXISTS endereco text,
      ADD COLUMN IF NOT EXISTS show_leis boolean DEFAULT true NOT NULL,
      ADD COLUMN IF NOT EXISTS show_indicacoes boolean DEFAULT true NOT NULL,
      ADD COLUMN IF NOT EXISTS show_agenda boolean DEFAULT true NOT NULL,
      ADD COLUMN IF NOT EXISTS destaques jsonb DEFAULT '[]'::jsonb;
  `);
  console.log("✅ Tenant table expanded");

  // Create bairro table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS bairro (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenantId" uuid NOT NULL REFERENCES tenant(id),
      nome text NOT NULL,
      zona text,
      observacoes text,
      "createdAt" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✅ Bairro table created");

  // Create lead table (unified eleitor/lead)
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS lead (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenantId" uuid NOT NULL REFERENCES tenant(id),
      nome text NOT NULL,
      email text,
      telefone text,
      bairro_id uuid REFERENCES bairro(id),
      bairro_nome text,
      lideranca_id uuid,
      funil lead_funil DEFAULT 'novo' NOT NULL,
      origem text,
      observacoes text,
      cpf text,
      data_nascimento text,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✅ Lead table created");

  // Migrate data from eleitor to lead
  const eleitoresExist = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'eleitor') as exists`;
  if (eleitoresExist[0].exists) {
    const count = await sql`SELECT COUNT(*) as cnt FROM eleitor`;
    if (Number(count[0].cnt) > 0) {
      await sql.unsafe(`
        INSERT INTO lead (id, "tenantId", nome, email, telefone, bairro_nome, funil, observacoes, "createdAt", "updatedAt")
        SELECT id, "tenantId", nome, email, telefone, bairro,
          CASE status_relacionamento
            WHEN 'apoiador' THEN 'apoiador'::lead_funil
            WHEN 'simpatizante' THEN 'engajado'::lead_funil
            WHEN 'neutro' THEN 'novo'::lead_funil
            WHEN 'problema' THEN 'inativo'::lead_funil
            ELSE 'novo'::lead_funil
          END,
          observacoes, "createdAt", "updatedAt"
        FROM eleitor
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log("✅ Migrated eleitor data to lead");
    }
  }

  // Add lideranca_id FK to lead (after creating lead table)
  await sql.unsafe(`
    DO $$ BEGIN
      ALTER TABLE lead ADD CONSTRAINT lead_lideranca_fk FOREIGN KEY (lideranca_id) REFERENCES lideranca(id);
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  // Expand lideranca table
  await sql.unsafe(`
    ALTER TABLE lideranca
      ADD COLUMN IF NOT EXISTS email text,
      ADD COLUMN IF NOT EXISTS cpf text,
      ADD COLUMN IF NOT EXISTS bairro_id uuid REFERENCES bairro(id),
      ADD COLUMN IF NOT EXISTS endereco text,
      ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;
  `);
  console.log("✅ Lideranca table expanded");

  // Add visivel_landing to legislativo
  await sql.unsafe(`
    ALTER TABLE legislativo
      ADD COLUMN IF NOT EXISTS visivel_landing boolean DEFAULT true NOT NULL;
  `);
  console.log("✅ Legislativo table expanded");

  // Create assessor table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS assessor (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenantId" uuid NOT NULL REFERENCES tenant(id),
      "userId" text REFERENCES "user"(id),
      nome text NOT NULL,
      cargo text,
      email text,
      telefone text,
      bairro_atuacao text,
      status text DEFAULT 'ativo',
      "createdAt" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✅ Assessor table created");

  // Create agenda_publica table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS agenda_publica (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenantId" uuid NOT NULL REFERENCES tenant(id),
      titulo text NOT NULL,
      descricao text,
      local text,
      data_evento timestamp NOT NULL,
      tipo agenda_tipo DEFAULT 'evento' NOT NULL,
      visivel boolean DEFAULT true NOT NULL,
      "createdAt" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✅ Agenda pública table created");

  // Create indicacao_popular table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS indicacao_popular (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenantId" uuid NOT NULL REFERENCES tenant(id),
      lideranca_id uuid REFERENCES lideranca(id),
      bairro_id uuid REFERENCES bairro(id),
      descricao text NOT NULL,
      tipo text,
      status indicacao_popular_status DEFAULT 'pendente' NOT NULL,
      observacoes text,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✅ Indicação popular table created");

  // Create pesquisa table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS pesquisa (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "tenantId" uuid NOT NULL REFERENCES tenant(id),
      titulo text NOT NULL,
      descricao text,
      status pesquisa_status DEFAULT 'rascunho' NOT NULL,
      publica boolean DEFAULT false NOT NULL,
      perguntas jsonb DEFAULT '[]'::jsonb,
      "createdAt" timestamp DEFAULT now() NOT NULL,
      "updatedAt" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✅ Pesquisa table created");

  // Create pesquisa_resposta table
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS pesquisa_resposta (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      pesquisa_id uuid NOT NULL REFERENCES pesquisa(id),
      respostas jsonb DEFAULT '{}'::jsonb,
      respondente text,
      telefone text,
      "createdAt" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✅ Pesquisa resposta table created");

  // Update demanda to reference lead instead of eleitor
  await sql.unsafe(`
    ALTER TABLE demanda
      ADD COLUMN IF NOT EXISTS "leadId" uuid REFERENCES lead(id);
  `);

  // Migrate eleitorId references to leadId
  await sql.unsafe(`
    UPDATE demanda SET "leadId" = "eleitorId" WHERE "leadId" IS NULL AND "eleitorId" IS NOT NULL;
  `);
  console.log("✅ Demanda table updated");

  console.log("🎉 MVP migration complete!");
  await sql.end();
}

migrate().catch((e) => {
  console.error("❌ Migration failed:", e);
  process.exit(1);
});
