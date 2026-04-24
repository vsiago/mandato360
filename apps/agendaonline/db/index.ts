import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as { pgClient: Sql | undefined };

const client =
    globalForDb.pgClient ??
    postgres(connectionString, {
        prepare: false,
        max: 10,
        idle_timeout: 20,
        connect_timeout: 30,
    });

if (process.env.NODE_ENV !== "production") {
    globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });
