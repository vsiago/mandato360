import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// For query purposes
const client = postgres({
    host: "aws-1-us-west-2.pooler.supabase.com",
    port: 5432,
    database: "postgres",
    username: "postgres.tvuqwhrjiixlmmelmyam",
    password: process.env.DATABASE_PASSWORD || "Ia81510156!",
    ssl: "require",
});
export const db = drizzle(client, { schema });
