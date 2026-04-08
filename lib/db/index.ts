import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const rawUrl = process.env.DATABASE_URL || "";

// Supabase Connection Pooler (Transaction Mode) uses port 6543
// We ensure the port is 6543 and sslmode is require if using the pooler
let connectionString = rawUrl;
if (rawUrl.includes("supabase.co") || rawUrl.includes("supabase.net")) {
    if (!connectionString.includes(":6543")) {
        connectionString = connectionString.replace(":5432", ":6543");
    }
    if (!connectionString.includes("sslmode=")) {
        connectionString += (connectionString.includes("?") ? "&" : "?") + "sslmode=require";
    }
}

// For query purposes
const client = postgres(connectionString, {
    prepare: false, // Required for poolers
    idle_timeout: 30, // Increase idle timeout
    max: 20, // Increase max connections for concurrent actions + middleware
    connect_timeout: 20, // 20s timeout to handle DB waking up (cold starts)
});
export const db = drizzle(client, { schema });
