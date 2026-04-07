import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!.replace(":5432/", ":6543/") + "?sslmode=require";

// For query purposes
const client = postgres(connectionString, {
    prepare: false,
    idle_timeout: 20,
    max: 10,
});
export const db = drizzle(client, { schema });
