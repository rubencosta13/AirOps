import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => import("@/__mocks__/db"));

import db, { cleanupDatabase, setupDatabase } from "@/__mocks__/db";
import { usersTable } from "@/db/schema/users";
import { eq } from "drizzle-orm";

describe("PGlite integration", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });
  it("connects to the test database", async () => {
    const result = await db.execute("SELECT 1");
    expect(result.rows).toEqual([{ "?column?": 1 }]);
  });
  it("creates a user", async () => {
    const result = await db
      .insert(usersTable)
      .values({
        name: "John Doe",
        email: "john@example.com",
        password: "password",
      })
      .returning();

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("john@example.com");
  });

  it("returns a user", async () => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, "john@example.com"));
    expect(user.email).toBe("john@example.com");
    expect(user.email).toBe("john@example.com");
  });
});
