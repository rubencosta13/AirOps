import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const db: NodePgDatabase = drizzle(process.env.DATABASE_URL!);

export async function runMigrations() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
}

export default db;
