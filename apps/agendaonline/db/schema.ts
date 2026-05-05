import { pgTable, text, timestamp, boolean, integer, numeric, pgEnum, jsonb } from "drizzle-orm/pg-core";

// ===== Better Auth tables =====

export const roleEnum = pgEnum("role", ["user", "admin", "superadmin", "root"]);

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    role: text("role").notNull().default("user"),
    banned: boolean("banned"),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

// ===== Agenda Online SaaS tables =====

export const planEnum = pgEnum("plan", ["essencial", "profissional", "premium"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
    "incomplete",
    "incomplete_expired"
]);

// ===== Global Taxonomy Tables =====

export const businessTypes = pgTable("business_types", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon"),
    emoji: text("emoji"),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

export const globalCategories = pgTable("global_categories", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    businessTypeId: text("business_type_id").notNull().references(() => businessTypes.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

export const globalServices = pgTable("global_services", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    businessTypeId: text("business_type_id").notNull().references(() => businessTypes.id),
    globalCategoryId: text("global_category_id").notNull().references(() => globalCategories.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    image: text("image"),
    defaultDuration: integer("default_duration"),
    defaultPrice: numeric("default_price", { precision: 10, scale: 2 }),
    defaultDescription: text("default_description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

export const globalPlaceholders = pgTable("global_placeholders", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    globalServiceId: text("global_service_id").notNull().references(() => globalServices.id),
    placeholderText: text("placeholder_text").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// ===== Multi-Tenant Tables =====

export const tenants = pgTable("tenants", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    surname: text("surname"),
    businessTypeId: text("business_type_id").references(() => businessTypes.id),
    description: text("description"),
    // Colors
    primaryColor: text("primary_color").notNull().default("#8c6239"),
    hoverColor: text("hover_color").notNull().default("#6d4a2a"),
    // Contact
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    address: text("address"),
    mapEmbedUrl: text("map_embed_url"),
    path: text("path"), // added for navigation
    instagram: text("instagram"),
    // Branding
    logoUrl: text("logo_url"),
    heroImageUrl: text("hero_image_url"),
    profileImageUrl: text("profile_image_url"),
    avatarUrl: text("avatar_url"),
    headerBgColor: text("header_bg_color"),
    // Founder
    founderName: text("founder_name"),
    founderBio: text("founder_bio"),
    founderRole: text("founder_role"),
    // Hero content
    heroBadge: text("hero_badge"),
    heroHeadline: text("hero_headline"),
    heroHighlight: text("hero_highlight"),
    ctaText: text("cta_text").default("Agendar Horário"),
    // Trust
    trustBadges: jsonb("trust_badges").$type<{ text: string; icon: string }[]>().default([]),
    // FAQ
    faq: jsonb("faq").$type<{ id: string; question: string; answer: string }[]>().default([]),
    // Before/After
    beforeAfter: jsonb("before_after").$type<{ id: string; title: string; before: string; after: string }[]>().default([]),
    // Visual editor
    sectionStyles: jsonb("section_styles").$type<Record<string, unknown>>(),
    responsiveOverrides: jsonb("responsive_overrides").$type<Record<string, unknown>>(),
    heroImageSettings: jsonb("hero_image_settings").$type<Record<string, unknown>>(),
    sections: jsonb("sections").$type<any[]>().default([]),

    // Theme (design system)
    theme: text("theme").notNull().default("neutro"),
    designSystem: jsonb("design_system").$type<any>(),
    config: jsonb("config").$type<any>(),
    // Chat widget
    chat: jsonb("chat").$type<{ greeting: string; avatarUrl: string; status: string }>(),
    // Status
    onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
    isDemo: boolean("is_demo").notNull().default(false),
    claimed: boolean("claimed").notNull().default(false),
    // Versioning & Publishing
    configVersion: integer("config_version").notNull().default(1),
    lastPublished: timestamp("last_published"),
    publishedBy: text("published_by").references(() => user.id),
    // Owner
    ownerId: text("owner_id").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===== Tenant Drafts (Lab Mode) =====

export const tenantDrafts = pgTable("tenant_drafts", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    configSnapshot: jsonb("config_snapshot").notNull(), // Full TenantConfig JSON
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===== Audit Log =====

export const tenantConfigHistory = pgTable("tenant_config_history", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    version: integer("version").notNull(),
    configSnapshot: jsonb("config_snapshot").notNull(),
    changeSummary: text("change_summary"),
    changedBy: text("changed_by").references(() => user.id),
    changedAt: timestamp("changed_at").notNull().defaultNow(),
});

// ===== Waitlist Tables =====

export const waitlist = pgTable("waitlist", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    whatsapp: text("whatsapp").notNull(),
    niche: text("niche"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => user.id),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    plan: planEnum("plan").notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    trialStart: timestamp("trial_start"),
    trialEnd: timestamp("trial_end"),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    canceledAt: timestamp("canceled_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const services = pgTable("services", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    categoryId: text("category_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    image: text("image"),
    price: numeric("price", { precision: 10, scale: 2 }),
    duration: integer("duration"), // minutes
    fullDescription: text("full_description"),
    features: jsonb("features").$type<{ item: string }[]>().default([]),
    addons: jsonb("addons").$type<{ name: string; price: number }[]>().default([]),
    longImage: text("long_image"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    label: text("label").notNull(),
    slug: text("slug").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
});

export const appointments = pgTable("appointments", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    tenantId: text("tenant_id").notNull().references(() => tenants.id),
    serviceId: text("service_id").references(() => services.id),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),
    date: text("date").notNull(), // YYYY-MM-DD
    time: text("time").notNull(), // HH:MM
    status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, blocked, completed
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

import { relations } from "drizzle-orm";

export const appointmentsRelations = relations(appointments, ({ one }) => ({
    tenant: one(tenants, {
        fields: [appointments.tenantId],
        references: [tenants.id],
    }),
    service: one(services, {
        fields: [appointments.serviceId],
        references: [services.id],
    }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
    tenant: one(tenants, {
        fields: [services.tenantId],
        references: [tenants.id],
    }),
    category: one(categories, {
        fields: [services.categoryId],
        references: [categories.id],
    }),
}));
