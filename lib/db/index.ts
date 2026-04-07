import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const rawUrl = process.env.DATABASE_URL || "";
const connectionString = rawUrl.includes(":6543") 
    ? rawUrl 
    : rawUrl.replace(":5432/", ":6543/") + (rawUrl.includes("?") ? "" : "?sslmode=require");

// For query purposes
const client = postgres(connectionString, {
    prepare: false,
    idle_timeout: 20,
    max: 10,
    connect_timeout: 10, // Add timeout for faster failure
});
export const db = drizzle(client, { schema });
