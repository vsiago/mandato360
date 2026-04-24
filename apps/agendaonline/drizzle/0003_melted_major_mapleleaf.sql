CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"niche" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_types" ADD COLUMN "emoji" text;--> statement-breakpoint
ALTER TABLE "business_types" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "business_types" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "global_services" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "global_services" ADD COLUMN "default_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "global_services" ADD COLUMN "default_description" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "full_description" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "features" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "addons" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "long_image" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "sections" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "theme" text DEFAULT 'neutro' NOT NULL;