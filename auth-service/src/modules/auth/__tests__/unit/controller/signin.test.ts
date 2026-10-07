import { server } from "@/server";
import { describe, expect, it, vi } from "vitest";
import { authService } from "@/modules/auth/service";
import fc from "fast-check";

describe("Sign in controller", () => {
  it("GET /signin returns error if no user details were provided", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signup",
      payload: {},
    });
    expect(response.statusCode).toBe(400);

    expect(response.json()).toEqual({
      error: "VALIDATION_ERROR",
      message: "The request is invalid",
      fields: [
        {
          field: "name",
          message: "Invalid input: expected string, received undefined",
        },
        {
          field: "email",
          message: "Invalid input: expected string, received undefined",
        },
        {
          field: "password",
          message: "Invalid input: expected string, received undefined",
        },
      ],
    });
  });
  it("does not expose the refresh token in the response body", async () => {
    vi.spyOn(authService, "signin").mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "super-secret-refresh-token",
    });

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: {
        email: "john@example.com",
        password: "password123",
      },
    });

    expect(response.json()).toEqual({
      accessToken: "access-token",
    });

    expect(response.body).not.toContain("super-secret-refresh-token");
  });

  it("propagates authentication errors", async () => {
    vi.spyOn(authService, "signin").mockRejectedValue(
      new Error("Invalid credentials"),
    );

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: {
        email: "john@example.com",
        password: "wrong-password",
      },
    });

    expect(response.statusCode).toBe(500);
  });

  it("sets the refresh token as an HttpOnly cookie", async () => {
    vi.spyOn(authService, "signin").mockResolvedValue({
      accessToken: "access",
      refreshToken: "refresh",
    });

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signin",
      payload: {
        email: "john@example.com",
        password: "password",
      },
    });

    const cookie = response.cookies.find(
      (cookie) => cookie.name === "refresh_token",
    );

    expect(cookie?.httpOnly).toBe(true);
  });

  it("rejects malformed sign-in requests", async () => {
    const malformedSignInArb = fc.record({
      email: fc.oneof(
        fc.string(),
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined),
        fc.array(fc.string()),
      ),
      password: fc.oneof(
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined),
        fc.array(fc.string()),
      ),
    });

    await fc.assert(
      fc.asyncProperty(malformedSignInArb, async (payload) => {
        const response = await server.inject({
          method: "POST",
          url: "/api/auth/signin",
          payload,
        });

        expect(response.statusCode).toBe(400);
      }),
    );
  });
  it("accepts arbitrary valid sign-in credentials", async () => {
    const validSignInArb = fc.record({
      email: fc.stringMatching(/^[a-zA-Z0-9]{1,20}@[a-zA-Z0-9]{1,20}\.com$/),
      password: fc.string({ minLength: 4, maxLength: 100 }),
    });
    vi.spyOn(authService, "signin").mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    await fc.assert(
      fc.asyncProperty(validSignInArb, async (payload) => {
        const response = await server.inject({
          method: "POST",
          url: "/api/auth/signin",
          payload,
        });
        expect(response.statusCode).toBe(200);

        expect(response.json()).toEqual({
          accessToken: "access-token",
        });
      }),
      {
        numRuns: 100,
      },
    );
  });
  it("never crashes on arbitrary sign-in input", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.oneof(
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.constant(null),
          ),
          password: fc.oneof(
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.constant(null),
          ),
        }),
        async (payload) => {
          const response = await server.inject({
            method: "POST",
            url: "/api/auth/signin",
            payload,
          });

          expect(response.statusCode).not.toBe(500);
        },
      ),
      {
        numRuns: 100,
      },
    );
  });
});
