import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";

import { SignInSchema } from "../../schema";
import { authService } from "../../service";
import { server } from "@/server";
import db from "@/db";
import { usersTable } from "@/db/schema";
import { cleanupDatabase, setupDatabase } from "@/__mocks__/db";

vi.mock("@/email/email.service", () => import("@/__mocks__/email"));
vi.mock("@/db", () => import("@/__mocks__/db"));

describe("POST /api/auth/signin", () => {
  const signInDetails: SignInSchema = {
    email: "verified@airops.local",
    password: "test_user",
  };

  beforeAll(async () => {
    await setupDatabase();

    const user = await authService.createUser({
      name: "Test User",
      ...signInDetails,
    });

    await db
      .update(usersTable)
      .set({
        verified: true,
        verifiedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id));
  });
  afterAll(async () => {
    await cleanupDatabase();
  });

  it("signs in an existing user", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signin",
      body: signInDetails,
    });

    // asset methods being called

    expect(response.statusCode).toBe(200);
  });

  it("returns 401 when the credentials are invalid", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signin",
      body: {
        email: signInDetails.email,
        password: "1234",
      },
    });

    expect(JSON.parse(response.body)).toEqual({
      error: "Not Authorized",
      message: "Invalid Email / Password",
    });

    expect(response.statusCode).toBe(401);
  });

  it("returns 400 when the request body is invalid", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signin",
      body: {
        email: signInDetails.email,
        password: "123",
      },
    });

    expect(JSON.parse(response.body)).toEqual({
      error: "VALIDATION_ERROR",
      fields: [
        {
          field: "password",
          message: "Too small: expected string to have >=4 characters",
        },
      ],
      message: "The request is invalid",
    });

    expect(response.statusCode).toBe(400);
  });
});
