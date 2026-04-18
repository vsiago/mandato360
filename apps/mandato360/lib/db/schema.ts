import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───
export const relacaoStatusEnum = pgEnum("relacao_status", ["apoiador", "simpatizante", "neutro", "problema"]);
export const demandaStatusEnum = pgEnum("demanda_status", ["novo", "analise", "encaminhado", "resolvido"]);
export const legislativoStatusEnum = pgEnum("legislativo_status", ["tramitando", "aprovado", "rejeitado", "arquivado", "pendente", "concluido"]);
export const liderancaTipoEnum = pgEnum("lideranca_tipo", ["lider_comunitario", "religioso", "comerciante", "sindico", "presidente_associacao", "outro"]);
export const leadFunilEnum = pgEnum("lead_funil", ["novo", "contato", "engajado", "apoiador", "lideranca", "inativo"]);
export const agendaTipoEnum = pgEnum("agenda_tipo", ["visita", "acao", "audiencia", "reuniao", "evento", "outro"]);
export const pesquisaStatusEnum = pgEnum("pesquisa_status", ["rascunho", "ativa", "encerrada"]);
export const indicacaoPopularStatusEnum = pgEnum("indicacao_popular_status", ["pendente", "analise", "encaminhada", "resolvida", "rejeitada"]);

// ─── Auth Tables (Better Auth) ───
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

// ─── Multi-Tenant Core ───
export const tenant = pgTable("tenant", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),

    // White-label: Cores
    primaryColor: text("primary_color").default("#0F2B5B").notNull(),
    secondaryColor: text("secondary_color").default("#0D9F6E").notNull(),

    // White-label: Identidade Visual
    logoUrl: text("logo_url"),
    fotoPerfilUrl: text("foto_perfil_url"),

    // White-label: Perfil / Quem Sou
    biografia: text("biografia"),
    partido: text("partido"),
    cidade: text("cidade"),
    cargo: text("cargo").default("Vereador"),

    // White-label: Hero
    heroHeadline: text("hero_headline").default("Por uma cidade de"),
    heroHighlight: text("hero_highlight").default("Resultados"),
    heroBadge: text("hero_badge").default("Mandato Participativo"),
    heroImageUrl: text("hero_image_url"),
    heroDescription: text("hero_description"),
    heroCtaText: text("hero_cta_text").default("Solicitar Demanda"),
    tagline: text("tagline").default("Mandato Participativo"),

    // White-label: Contato
    whatsapp: text("whatsapp"),
    telefone: text("telefone"),
    email: text("email_contato"),
    instagram: text("instagram"),
    endereco: text("endereco"),

    // Visibilidade de seções na landing page
    showLeis: boolean("show_leis").default(true).notNull(),
    showIndicacoes: boolean("show_indicacoes").default(true).notNull(),
    showAgenda: boolean("show_agenda").default(true).notNull(),

    // Destaques / Trust Badges (JSON array)
    destaques: jsonb("destaques").$type<{ text: string; icon?: string }[]>().default([]),

    // Config JSON legado (editor visual avançado)
    config: text("config"),

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

// ─── Bairros ───
export const bairro = pgTable("bairro", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenantId").notNull().references(() => tenant.id),
    nome: text("nome").notNull(),
    zona: text("zona"), // norte, sul, leste, oeste, centro etc
    observacoes: text("observacoes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Leads / Eleitores (Unificado com Funil) ───
export const lead = pgTable("lead", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenantId").notNull().references(() => tenant.id),
    nome: text("nome").notNull(),
    email: text("email"),
    telefone: text("telefone"),
    bairroId: uuid("bairro_id").references(() => bairro.id),
    bairroNome: text("bairro_nome"), // fallback text
    liderancaId: uuid("lideranca_id").references(() => lideranca.id),

    // Funil de relacionamento
    funil: leadFunilEnum("funil").default("novo").notNull(),
    origem: text("origem"), // "landing_cta", "whatsapp", "manual", "pesquisa", "indicacao"

    // Extras
    observacoes: text("observacoes"),
    cpf: text("cpf"),
    dataNascimento: text("data_nascimento"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Backward compat: alias eleitor = lead ───
export const eleitor = lead;

// ─── Demandas ───
export const demanda = pgTable("demanda", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	leadId: uuid("leadId").references(() => lead.id),
	assessorId: text("assessorId").references(() => user.id),
	tipo: text("tipo").notNull(),
	descricao: text("descricao").notNull(),
	status: demandaStatusEnum("status").default("novo").notNull(),
	data: timestamp("data").defaultNow().notNull(),
});

// ─── Lideranças ───
export const lideranca = pgTable("lideranca", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	nome: text("nome").notNull(),
	telefone: text("telefone"),
	email: text("email"),
	cpf: text("cpf"),
	bairroId: uuid("bairro_id").references(() => bairro.id),
	bairro: text("bairro"), // fallback legado
	tipo: liderancaTipoEnum("tipo").notNull(),
	influenciaEstimada: text("influencia_estimada"),
	endereco: text("endereco"),
	anotacoes: text("anotacoes"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Legislativo (Projetos de Lei, Indicações, Leis Aprovadas) ───
export const legislativo = pgTable("legislativo", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	tipo: text("tipo", { enum: ["projeto_lei", "indicacao", "lei_aprovada"] }).notNull(),
	numero: text("numero"),
	titulo: text("titulo").notNull(),
	descricao: text("descricao"),
	status: legislativoStatusEnum("status").notNull(),
	data: timestamp("data").notNull(),
	// Visibilidade na landing page
	visivelLanding: boolean("visivel_landing").default(true).notNull(),
});

// ─── Publicações ───
export const publicacao = pgTable("publicacao", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenantId").notNull().references(() => tenant.id),
	titulo: text("titulo").notNull(),
	conteudo: text("conteudo").notNull(),
	imagemUrl: text("imagem_url"),
	data: timestamp("data").defaultNow().notNull(),
});

// ─── Assessores (tabela própria para dados extras) ───
export const assessor = pgTable("assessor", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenantId").notNull().references(() => tenant.id),
    userId: text("userId").references(() => user.id), // opcional, link com user do sistema
    nome: text("nome").notNull(),
    cargo: text("cargo"),
    email: text("email"),
    telefone: text("telefone"),
    bairroAtuacao: text("bairro_atuacao"),
    status: text("status").$type<"ativo" | "inativo">().default("ativo"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Agenda Pública ───
export const agendaPublica = pgTable("agenda_publica", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenantId").notNull().references(() => tenant.id),
    titulo: text("titulo").notNull(),
    descricao: text("descricao"),
    local: text("local"),
    dataEvento: timestamp("data_evento").notNull(),
    tipo: agendaTipoEnum("tipo").default("evento").notNull(),
    visivel: boolean("visivel").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Indicações da População (por liderança) ───
export const indicacaoPopular = pgTable("indicacao_popular", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenantId").notNull().references(() => tenant.id),
    liderancaId: uuid("lideranca_id").references(() => lideranca.id),
    bairroId: uuid("bairro_id").references(() => bairro.id),
    descricao: text("descricao").notNull(),
    tipo: text("tipo"), // "infraestrutura", "saude", "seguranca", etc
    status: indicacaoPopularStatusEnum("status").default("pendente").notNull(),
    observacoes: text("observacoes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Pesquisas (Google Forms style) ───
export const pesquisa = pgTable("pesquisa", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenantId").notNull().references(() => tenant.id),
    titulo: text("titulo").notNull(),
    descricao: text("descricao"),
    status: pesquisaStatusEnum("status").default("rascunho").notNull(),
    publica: boolean("publica").default(false).notNull(), // se tem página pública
    // Perguntas em JSON: [{ id, type: "text"|"choice"|"checkbox"|"scale", question, options?: string[], required?: boolean }]
    perguntas: jsonb("perguntas").$type<PesquisaPergunta[]>().default([]),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const pesquisaResposta = pgTable("pesquisa_resposta", {
    id: uuid("id").primaryKey().defaultRandom(),
    pesquisaId: uuid("pesquisa_id").notNull().references(() => pesquisa.id),
    // Respostas em JSON: { [perguntaId]: "resposta" | string[] }
    respostas: jsonb("respostas").$type<Record<string, string | string[]>>().default({}),
    respondente: text("respondente"), // nome opcional
    telefone: text("telefone"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Types ───
export interface PesquisaPergunta {
    id: string;
    type: "text" | "choice" | "checkbox" | "scale";
    question: string;
    options?: string[];
    required?: boolean;
}

// ─── Relations ───
export const tenantRelations = relations(tenant, ({ many }) => ({
    members: many(tenantMember),
    leads: many(lead),
    demandas: many(demanda),
    liderancas: many(lideranca),
    legislativo: many(legislativo),
    publicacoes: many(publicacao),
    bairros: many(bairro),
    assessores: many(assessor),
    agendas: many(agendaPublica),
    indicacoesPopulares: many(indicacaoPopular),
    pesquisas: many(pesquisa),
}));

export const leadRelations = relations(lead, ({ one, many }) => ({
    tenant: one(tenant, { fields: [lead.tenantId], references: [tenant.id] }),
    bairroRef: one(bairro, { fields: [lead.bairroId], references: [bairro.id] }),
    liderancaRef: one(lideranca, { fields: [lead.liderancaId], references: [lideranca.id] }),
    demandas: many(demanda),
}));

export const demandaRelations = relations(demanda, ({ one }) => ({
    tenant: one(tenant, { fields: [demanda.tenantId], references: [tenant.id] }),
    lead: one(lead, { fields: [demanda.leadId], references: [lead.id] }),
    assessorUser: one(user, { fields: [demanda.assessorId], references: [user.id] }),
}));

export const liderancaRelations = relations(lideranca, ({ one, many }) => ({
    tenant: one(tenant, { fields: [lideranca.tenantId], references: [tenant.id] }),
    bairroRef: one(bairro, { fields: [lideranca.bairroId], references: [bairro.id] }),
    leads: many(lead),
    indicacoes: many(indicacaoPopular),
}));

export const bairroRelations = relations(bairro, ({ one, many }) => ({
    tenant: one(tenant, { fields: [bairro.tenantId], references: [tenant.id] }),
    liderancas: many(lideranca),
    leads: many(lead),
    indicacoes: many(indicacaoPopular),
}));

export const assessorRelations = relations(assessor, ({ one }) => ({
    tenant: one(tenant, { fields: [assessor.tenantId], references: [tenant.id] }),
    userRef: one(user, { fields: [assessor.userId], references: [user.id] }),
}));

export const agendaPublicaRelations = relations(agendaPublica, ({ one }) => ({
    tenant: one(tenant, { fields: [agendaPublica.tenantId], references: [tenant.id] }),
}));

export const indicacaoPopularRelations = relations(indicacaoPopular, ({ one }) => ({
    tenant: one(tenant, { fields: [indicacaoPopular.tenantId], references: [tenant.id] }),
    liderancaRef: one(lideranca, { fields: [indicacaoPopular.liderancaId], references: [lideranca.id] }),
    bairroRef: one(bairro, { fields: [indicacaoPopular.bairroId], references: [bairro.id] }),
}));

export const pesquisaRelations = relations(pesquisa, ({ one, many }) => ({
    tenant: one(tenant, { fields: [pesquisa.tenantId], references: [tenant.id] }),
    respostas: many(pesquisaResposta),
}));

export const pesquisaRespostaRelations = relations(pesquisaResposta, ({ one }) => ({
    pesquisaRef: one(pesquisa, { fields: [pesquisaResposta.pesquisaId], references: [pesquisa.id] }),
}));
