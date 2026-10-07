import { PGlite } from "@electric-sql/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { drizzle } from "drizzle-orm/pglite";

const client = new PGlite();

const db = drizzle({
  client,
});

export async function setupDatabase() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
}

export async function cleanupDatabase() {
  await client.exec(`
    DO $$
    DECLARE
      table_name TEXT;
    BEGIN
      FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
      LOOP
        EXECUTE 'DROP TABLE IF EXISTS "' || table_name || '" CASCADE';
      END LOOP;
    END
    $$;
  `);

  await client.close();
}

export default db;
