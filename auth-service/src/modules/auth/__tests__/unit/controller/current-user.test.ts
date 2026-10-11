import { authService } from "@/modules/auth/service";
import { server } from "@/server";
import {
  makeAccessToken,
  setupAuthenticatedUser,
} from "@/tests/helpers/access-token";
import { describe, expect, it, vi } from "vitest";
import fc from "fast-check";

describe("Current user controller", () => {
  it("GET /me returns 401 when no access token is provided", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      payload: {},
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toBe("Invalid or expired token");
  });
  it("GET /current-user returns 401 when the access token is invalid", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        authorization: "Bearer this.is.not.a.valid.token",
      },
    });
    expect(response.statusCode).toBe(401);
  });
  it("GET /me returns 401 when the access token is expired", async () => {
    const token = await makeAccessToken({ email: "john@example.com" });

    vi.spyOn(authService, "getUserDetails").mockResolvedValue({
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      password: "",
      verified: true,
      verifiedAt: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    });
    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual("Session revoked");
  });
  it("returns the authenticated user's name, email and id", async () => {
    const { token } = await setupAuthenticatedUser();
    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      email: "john@example.com",
      id: "user-123",
      name: "John Doe",
    });
  });
  it("does not expose sensitive fields in the response body", async () => {
    const { token } = await setupAuthenticatedUser();

    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.json()).not.toHaveProperty("password");
  });
  it("propagates errors from authService.getUserDetails", async () => {
    const { token } = await setupAuthenticatedUser();

    vi.spyOn(authService, "getUserDetails").mockRejectedValue(
      new Error("ERROR"),
    );

    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      error: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  });
  it("rejects requests with malformed Authorization headers", async () => {
    const malformedHeaders = fc.oneof(
      fc.constant("Bearer"),
      fc.constant("Bearer "),
      fc.constant("bearer token"),
      fc.constant("Token abc"),
      fc.constant("Basic dXNlcjpwYXNz"),
      fc.string().filter((s) => !s.startsWith("Bearer ")),
      fc.constant(undefined),
    );

    await fc.assert(
      fc.asyncProperty(malformedHeaders, async (authHeader) => {
        const response = await server.inject({
          method: "GET",
          url: "/api/auth/me",
          headers: authHeader ? { authorization: authHeader } : {},
        });

        expect(response.statusCode).toBe(401);
      }),
    );
  });
  it("accepts arbitrary valid access tokens and returns the matching user", async () => {
    const validUserArb = fc.record({
      email: fc.stringMatching(/^[a-zA-Z0-9]{1,20}@[a-zA-Z0-9]{1,20}\.com$/),
      userId: fc.uuid(),
      sessionId: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 50 }),
    });

    await fc.assert(
      fc.asyncProperty(validUserArb, async (user) => {
        const { token } = await setupAuthenticatedUser(user);

        const response = await server.inject({
          method: "GET",
          url: "/api/auth/me",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
          id: user.userId,
          name: user.name,
          email: user.email,
        });
      }),
      { numRuns: 50 },
    );
  });
  it("never crashes on arbitrary Authorization header values", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.constant(null),
          fc.constant(undefined),
          fc.array(fc.string()),
        ),
        async (authValue) => {
          const response = await server.inject({
            method: "GET",
            url: "/api/auth/me",
            headers: {
              authorization: String(authValue),
            },
          });

          expect(response.statusCode).not.toBe(500);
        },
      ),
      { numRuns: 100 },
    );
  });
});
