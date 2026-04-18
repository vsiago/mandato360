import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const rawUrl = process.env.DATABASE_URL || "";

// Ensure sslmode=require for Supabase
let connectionString = rawUrl;
if (rawUrl.includes("supabase.co") || rawUrl.includes("supabase.net")) {
    if (!connectionString.includes("sslmode=")) {
        connectionString += (connectionString.includes("?") ? "&" : "?") + "sslmode=require";
    }
}

// For connection pooling in Next.js development
const globalForPostgres = globalThis as unknown as {
	postgres: ReturnType<typeof postgres> | undefined;
};

// Connection stability adjustments for multi-environments
export const client =
	globalForPostgres.postgres ??
	postgres(connectionString, {
		prepare: false, // Required for poolers
		idle_timeout: 60, // Keep connections alive longer to reduce handshake overhead
		max: 10, // Lower max connections to prevent Supabase pool exhaustion
		connect_timeout: 15, // Faster feedback on connection failure
	});

if (process.env.NODE_ENV !== "production") {
	globalForPostgres.postgres = client;
}

export const db = drizzle(client, { schema });
