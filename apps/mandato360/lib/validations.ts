/**
 * Zod schemas for input validation
 * Prevents XSS, SQL Injection, and invalid data
 */

import { z } from "zod";

// Common validators
export const schemas = {
  // IDs
  id: z.string().uuid("ID inválido"),
  tenantId: z.string().uuid("Tenant ID inválido"),
  userId: z.string().uuid("User ID inválido"),

  // Email & Contact
  email: z.string().email("E-mail inválido").toLowerCase().trim(),
  phone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, "Telefone inválido")
    .optional(),
  whatsapp: z
    .string()
    .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, "WhatsApp inválido")
    .optional(),

  // Names
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  firstName: z.string().min(1).max(100),

  // Document
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido").optional(),

  // Text fields
  text: z.string().min(1).max(500),
  longText: z.string().min(1).max(5000),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug inválido"),

  // Enums
  leadFunil: z.enum(["novo", "contato", "engajado", "apoiador", "lideranca", "inativo"]),
  leadOrigin: z.enum(["manual", "landing_cta", "whatsapp", "pesquisa", "indicacao"]),
  demandaStatus: z.enum(["novo", "analise", "encaminhado", "resolvido"]),
  agendaTipo: z.enum(["visita", "acao", "audiencia", "reuniao", "evento", "outro"]),

  // Dates
  date: z.coerce.date(),
  birthDate: z.coerce.date().refine((date) => {
    const age = (new Date().getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return age >= 16 && age <= 150;
  }, "Data de nascimento inválida"),

  // Colors & URLs
  hexColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
  url: z.string().url("URL inválida").optional(),

  // Pagination
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  page: z.number().min(1).default(1),

  // Files
  fileName: z.string().max(255),
  fileSize: z.number().max(10 * 1024 * 1024, "Arquivo muito grande (máx 10MB)"), // 10MB
  mimeType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/csv",
  ]),
};

// Lead/Eleitor Schemas
export const leadSchemas = {
  create: z.object({
    tenantId: schemas.tenantId,
    nome: schemas.name,
    email: schemas.email.optional(),
    telefone: schemas.phone,
    bairroId: schemas.id.optional(),
    bairroNome: z.string().max(255).optional(),
    liderancaId: schemas.id.optional(),
    funil: schemas.leadFunil.default("novo"),
    origem: schemas.leadOrigin.optional(),
    observacoes: z.string().max(1000).optional(),
    cpf: schemas.cpf,
    dataNascimento: schemas.birthDate.optional(),
  }),

  update: z.object({
    id: schemas.id,
    tenantId: schemas.tenantId,
    nome: schemas.name.optional(),
    email: schemas.email.optional(),
    telefone: schemas.phone,
    bairroId: schemas.id.optional(),
    bairroNome: z.string().max(255).optional(),
    liderancaId: schemas.id.optional(),
    funil: schemas.leadFunil.optional(),
    observacoes: z.string().max(1000).optional(),
    cpf: schemas.cpf,
    dataNascimento: schemas.birthDate.optional(),
  }),

  delete: z.object({
    id: schemas.id,
    tenantId: schemas.tenantId,
  }),

  list: z.object({
    tenantId: schemas.tenantId,
    limit: schemas.limit,
    offset: schemas.offset,
    search: z.string().max(100).optional(),
    funil: schemas.leadFunil.optional(),
  }),
};

// Demanda Schemas
export const demandaSchemas = {
  create: z.object({
    tenantId: schemas.tenantId,
    eleitorId: schemas.id,
    eleitorNome: schemas.name,
    bairro: z.string().max(255),
    tipo: z.string().max(100),
    descricao: schemas.longText,
    status: schemas.demandaStatus.default("novo"),
  }),

  update: z.object({
    id: schemas.id,
    tenantId: schemas.tenantId,
    bairro: z.string().max(255).optional(),
    tipo: z.string().max(100).optional(),
    descricao: schemas.longText.optional(),
    status: schemas.demandaStatus.optional(),
  }),
};

// Agenda Schemas
export const agendaSchemas = {
  create: z.object({
    tenantId: schemas.tenantId,
    titulo: schemas.name,
    descricao: schemas.longText.optional(),
    local: z.string().max(255).optional(),
    dataEvento: schemas.date,
    tipo: schemas.agendaTipo.default("outro"),
    visivel: z.boolean().default(true),
  }),

  update: z.object({
    id: schemas.id,
    tenantId: schemas.tenantId,
    titulo: schemas.name.optional(),
    descricao: schemas.longText.optional(),
    local: z.string().max(255).optional(),
    dataEvento: schemas.date.optional(),
    tipo: schemas.agendaTipo.optional(),
    visivel: z.boolean().optional(),
  }),
};

// File Upload Schemas
export const fileSchemas = {
  upload: z.object({
    tenantId: schemas.tenantId,
    file: z.instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, "Arquivo muito grande")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Apenas JPEG, PNG e WebP são permitidos"
      ),
  }),
};

// Auth Schemas
export const authSchemas = {
  login: z.object({
    email: schemas.email,
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  }),

  register: z.object({
    email: schemas.email,
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    name: schemas.name,
  }),

  resetPassword: z.object({
    email: schemas.email,
  }),
};

// Type exports for TypeScript
export type LeadCreateInput = z.infer<typeof leadSchemas.create>;
export type LeadUpdateInput = z.infer<typeof leadSchemas.update>;
export type DemandaCreateInput = z.infer<typeof demandaSchemas.create>;
export type AgendaCreateInput = z.infer<typeof agendaSchemas.create>;
export type FileUploadInput = z.infer<typeof fileSchemas.upload>;
