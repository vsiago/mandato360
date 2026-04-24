CREATE TABLE "business_types" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "business_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "global_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"business_type_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "global_placeholders" (
	"id" text PRIMARY KEY NOT NULL,
	"global_service_id" text NOT NULL,
	"placeholder_text" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "global_services" (
	"id" text PRIMARY KEY NOT NULL,
	"business_type_id" text NOT NULL,
	"global_category_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"default_duration" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "business_type_id" text;--> statement-breakpoint
ALTER TABLE "global_categories" ADD CONSTRAINT "global_categories_business_type_id_business_types_id_fk" FOREIGN KEY ("business_type_id") REFERENCES "public"."business_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "global_placeholders" ADD CONSTRAINT "global_placeholders_global_service_id_global_services_id_fk" FOREIGN KEY ("global_service_id") REFERENCES "public"."global_services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "global_services" ADD CONSTRAINT "global_services_business_type_id_business_types_id_fk" FOREIGN KEY ("business_type_id") REFERENCES "public"."business_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "global_services" ADD CONSTRAINT "global_services_global_category_id_global_categories_id_fk" FOREIGN KEY ("global_category_id") REFERENCES "public"."global_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_business_type_id_business_types_id_fk" FOREIGN KEY ("business_type_id") REFERENCES "public"."business_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- Data migration: seed business_types and migrate existing niche values
INSERT INTO business_types (id, name, slug, icon, created_at) VALUES
    ('bt-salao-de-beleza', 'Salão de Beleza', 'salao-de-beleza', '💇‍♀️', now()),
    ('bt-barbearia', 'Barbearia', 'barbearia', '💈', now()),
    ('bt-studio-de-estetica', 'Studio de Estética', 'studio-de-estetica', '✨', now()),
    ('bt-clinica-de-estetica', 'Clínica de Estética', 'clinica-de-estetica', '🏥', now()),
    ('bt-nail-designer', 'Nail Designer', 'nail-designer', '💅', now()),
    ('bt-studio-de-sobrancelhas', 'Studio de Sobrancelhas', 'studio-de-sobrancelhas', '👁️', now())
ON CONFLICT (id) DO NOTHING;--> statement-breakpoint
-- Map existing niche values to business_type_id
UPDATE tenants SET business_type_id = (
    SELECT bt.id FROM business_types bt WHERE bt.name = tenants.niche
) WHERE niche IS NOT NULL AND business_type_id IS NULL;--> statement-breakpoint
-- Default unmapped tenants to Salão de Beleza
UPDATE tenants SET business_type_id = 'bt-salao-de-beleza' WHERE business_type_id IS NULL;--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "niche";