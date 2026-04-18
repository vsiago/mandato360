CREATE TYPE "public"."demanda_status" AS ENUM('novo', 'analise', 'encaminhado', 'resolvido');--> statement-breakpoint
CREATE TYPE "public"."legislativo_status" AS ENUM('tramitando', 'aprovado', 'rejeitado', 'arquivado', 'pendente', 'concluido');--> statement-breakpoint
CREATE TYPE "public"."lideranca_tipo" AS ENUM('lider_comunitario', 'religioso', 'comerciante', 'sindico', 'presidente_associacao', 'outro');--> statement-breakpoint
CREATE TYPE "public"."relacao_status" AS ENUM('apoiador', 'simpatizante', 'neutro', 'problema');--> statement-breakpoint
CREATE TABLE "demanda" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"eleitorId" uuid NOT NULL,
	"assessorId" text,
	"tipo" text NOT NULL,
	"descricao" text NOT NULL,
	"status" "demanda_status" DEFAULT 'novo' NOT NULL,
	"data" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eleitor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"nome" text NOT NULL,
	"email" text,
	"telefone" text,
	"bairro" text NOT NULL,
	"status_relacionamento" "relacao_status" DEFAULT 'neutro' NOT NULL,
	"observacoes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legislativo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"tipo" text NOT NULL,
	"numero" text,
	"titulo" text NOT NULL,
	"descricao" text,
	"status" "legislativo_status" NOT NULL,
	"data" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lideranca" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"nome" text NOT NULL,
	"telefone" text,
	"bairro" text,
	"tipo" "lideranca_tipo" NOT NULL,
	"influencia_estimada" text,
	"anotacoes" text
);
--> statement-breakpoint
CREATE TABLE "publicacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenantId" uuid NOT NULL,
	"titulo" text NOT NULL,
	"conteudo" text NOT NULL,
	"imagem_url" text,
	"data" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "demanda" ADD CONSTRAINT "demanda_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demanda" ADD CONSTRAINT "demanda_eleitorId_eleitor_id_fk" FOREIGN KEY ("eleitorId") REFERENCES "public"."eleitor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demanda" ADD CONSTRAINT "demanda_assessorId_user_id_fk" FOREIGN KEY ("assessorId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eleitor" ADD CONSTRAINT "eleitor_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislativo" ADD CONSTRAINT "legislativo_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lideranca" ADD CONSTRAINT "lideranca_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publicacao" ADD CONSTRAINT "publicacao_tenantId_tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;