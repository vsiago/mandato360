import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const relacaoStatusEnum = pgEnum("relacao_status", ["apoiador", "simpatizante", "neutro", "problema"]);
export const demandaStatusEnum = pgEnum("demanda_status", ["novo", "analise", "encaminhado", "resolvido"]);
export const legislativoStatusEnum = pgEnum("legislativo_status", ["tramitando", "aprovado", "rejeitado", "arquivado", "pendente", "concluido"]);
export const liderancaTipoEnum = pgEnum("lideranca_tipo", ["lider_comunitario", "religioso", "comerciante", "sindico", "presidente_associacao", "outro"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
    role: text("role").$type<"admin" | "user" | "staff">().default("user"),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

// Multi-tenant tables
export const tenant = pgTable("tenant", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(), // e.g., "joao-silva"
    name: text("name").notNull(),
    config: text("config"), // JSON configuration for landing page
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const tenantMember = pgTable("tenant_member", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenantId").notNull().references(() => tenant.id),
    userId: text("userId").notNull().references(() => user.id),
    role: text("role").$type<"owner" | "admin" | "staff">().default("staff"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Dashboard Tables
export const eleitor = pgTable("eleitor", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	nome: text("nome").notNull(),
	email: text("email"),
	telefone: text("telefone"),
	bairro: text("bairro").notNull(),
	statusRelacionamento: relacaoStatusEnum("status_relacionamento").default("neutro").notNull(),
	observacoes: text("observacoes"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const demanda = pgTable("demanda", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	eleitorId: uuid("eleitorId").notNull().references(() => eleitor.id),
	assessorId: text("assessorId").references(() => user.id),
	tipo: text("tipo").notNull(),
	descricao: text("descricao").notNull(),
	status: demandaStatusEnum("status").default("novo").notNull(),
	data: timestamp("data").defaultNow().notNull(),
});

export const lideranca = pgTable("lideranca", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	nome: text("nome").notNull(),
	telefone: text("telefone"),
	bairro: text("bairro"),
	tipo: liderancaTipoEnum("tipo").notNull(),
	influenciaEstimada: text("influencia_estimada"),
	anotacoes: text("anotacoes"),
});

export const legislativo = pgTable("legislativo", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	tipo: text("tipo", { enum: ["projeto_lei", "indicacao", "lei_aprovada"] }).notNull(),
	numero: text("numero"),
	titulo: text("titulo").notNull(),
	descricao: text("descricao"),
	status: legislativoStatusEnum("status").notNull(),
	data: timestamp("data").notNull(),
});

export const publicacao = pgTable("publicacao", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	titulo: text("titulo").notNull(),
	conteudo: text("conteudo").notNull(),
	imagemUrl: text("imagem_url"),
	data: timestamp("data").defaultNow().notNull(),
});

// Relations
export const tenantRelations = relations(tenant, ({ many }) => ({
    members: many(tenantMember),
    eleitores: many(eleitor),
    demandas: many(demanda),
    liderancas: many(lideranca),
    legislativo: many(legislativo),
    publicacoes: many(publicacao),
}));

export const eleitorRelations = relations(eleitor, ({ one, many }) => ({
	tenant: one(tenant, { fields: [eleitor.tenantId], references: [tenant.id] }),
	demandas: many(demanda),
}));

export const demandaRelations = relations(demanda, ({ one }) => ({
	tenant: one(tenant, { fields: [demanda.tenantId], references: [tenant.id] }),
	eleitor: one(eleitor, { fields: [demanda.eleitorId], references: [eleitor.id] }),
	assessor: one(user, { fields: [demanda.assessorId], references: [user.id] }),
}));
