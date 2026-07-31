-- Sincroniza o banco com lib/db/schema.ts
-- ESTRITAMENTE ADITIVA: nenhum DROP, nenhum RENAME, nenhuma alteração de tipo.
-- Idempotente: pode rodar mais de uma vez com segurança.

-- ─── ENUMS ───
DO $$ BEGIN
  CREATE TYPE "lead_funil" AS ENUM ('novo','contato','engajado','apoiador','lideranca','inativo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "agenda_tipo" AS ENUM ('visita','acao','audiencia','reuniao','evento','outro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "pesquisa_status" AS ENUM ('rascunho','ativa','encerrada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "indicacao_popular_status" AS ENUM ('pendente','analise','encaminhada','resolvida','rejeitada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── TENANT: colunas de white-label ───
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "primary_color"    text NOT NULL DEFAULT '#0F2B5B';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "secondary_color"  text NOT NULL DEFAULT '#0D9F6E';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "logo_url"         text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "foto_perfil_url"  text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "biografia"        text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "partido"          text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "cidade"           text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "cargo"            text DEFAULT 'Vereador';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "hero_headline"    text DEFAULT 'Por uma city de';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "hero_highlight"   text DEFAULT 'Resultados';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "hero_badge"       text DEFAULT 'Mandato Participativo';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "hero_image_url"   text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "hero_description" text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "hero_cta_text"    text DEFAULT 'Solicitar Demanda';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "tagline"          text DEFAULT 'Mandato Participativo';
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "whatsapp"         text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "telefone"         text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "email_contato"    text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "instagram"        text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "endereco"         text;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "show_leis"        boolean NOT NULL DEFAULT true;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "show_indicacoes"  boolean NOT NULL DEFAULT true;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "show_agenda"      boolean NOT NULL DEFAULT true;
ALTER TABLE "tenant" ADD COLUMN IF NOT EXISTS "destaques"        jsonb DEFAULT '[]'::jsonb;

-- ─── BAIRRO ───
CREATE TABLE IF NOT EXISTS "bairro" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId"    uuid NOT NULL REFERENCES "tenant"("id"),
  "nome"        text NOT NULL,
  "zona"        text,
  "observacoes" text,
  "createdAt"   timestamp NOT NULL DEFAULT now()
);

-- ─── ELEITOR: colunas do funil ───
ALTER TABLE "eleitor" ADD COLUMN IF NOT EXISTS "lideranca_id"    uuid REFERENCES "lideranca"("id");
ALTER TABLE "eleitor" ADD COLUMN IF NOT EXISTS "funil"           "lead_funil" NOT NULL DEFAULT 'novo';
ALTER TABLE "eleitor" ADD COLUMN IF NOT EXISTS "origem"          text;
ALTER TABLE "eleitor" ADD COLUMN IF NOT EXISTS "cpf"             text;
ALTER TABLE "eleitor" ADD COLUMN IF NOT EXISTS "data_nascimento" text;

-- ─── LIDERANCA ───
ALTER TABLE "lideranca" ADD COLUMN IF NOT EXISTS "email"     text;
ALTER TABLE "lideranca" ADD COLUMN IF NOT EXISTS "cpf"       text;
ALTER TABLE "lideranca" ADD COLUMN IF NOT EXISTS "endereco"  text;
ALTER TABLE "lideranca" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now();

-- ─── ASSESSOR ───
CREATE TABLE IF NOT EXISTS "assessor" (
  "id"              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId"        uuid NOT NULL REFERENCES "tenant"("id"),
  "userId"          text REFERENCES "user"("id"),
  "nome"            text NOT NULL,
  "cargo"           text,
  "email"           text,
  "telefone"        text,
  "bairro_atuacao"  text,
  "status"          text DEFAULT 'ativo',
  "createdAt"       timestamp NOT NULL DEFAULT now()
);

-- ─── AGENDA PUBLICA ───
CREATE TABLE IF NOT EXISTS "agenda_publica" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId"   uuid NOT NULL REFERENCES "tenant"("id"),
  "titulo"     text NOT NULL,
  "descricao"  text,
  "local"      text,
  "dataEvento" timestamp NOT NULL,
  "tipo"       "agenda_tipo" NOT NULL DEFAULT 'evento',
  "visivel"    boolean NOT NULL DEFAULT true,
  "createdAt"  timestamp NOT NULL DEFAULT now()
);

-- ─── INDICACAO POPULAR ───
CREATE TABLE IF NOT EXISTS "indicacao_popular" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId"    uuid NOT NULL REFERENCES "tenant"("id"),
  "liderancaId" uuid REFERENCES "lideranca"("id"),
  "bairroId"    uuid REFERENCES "bairro"("id"),
  "descricao"   text NOT NULL,
  "tipo"        text,
  "status"      "indicacao_popular_status" NOT NULL DEFAULT 'pendente',
  "observacoes" text,
  "createdAt"   timestamp NOT NULL DEFAULT now(),
  "updatedAt"   timestamp NOT NULL DEFAULT now()
);

-- ─── PESQUISA ───
CREATE TABLE IF NOT EXISTS "pesquisa" (
  "id"        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId"  uuid NOT NULL REFERENCES "tenant"("id"),
  "titulo"    text NOT NULL,
  "descricao" text,
  "status"    "pesquisa_status" NOT NULL DEFAULT 'rascunho',
  "publica"   boolean NOT NULL DEFAULT false,
  "perguntas" jsonb DEFAULT '[]'::jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "pesquisa_resposta" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "pesquisaId"  uuid NOT NULL REFERENCES "pesquisa"("id"),
  "respostas"   jsonb DEFAULT '{}'::jsonb,
  "respondente" text,
  "telefone"    text,
  "createdAt"   timestamp NOT NULL DEFAULT now()
);
