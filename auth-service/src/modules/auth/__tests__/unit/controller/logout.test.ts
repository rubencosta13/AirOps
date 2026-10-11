import { authService } from "@/modules/auth/service";
import { server } from "@/server";
import {
  makeRefreshToken,
  setupAuthenticatedUser,
} from "@/tests/helpers/access-token";
import { describe, expect, it, vi } from "vitest";
import fc from "fast-check";

describe("Logout controller", () => {
  it("POST /logout returns 401 when no access token is provided", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      payload: {},
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toBe("Invalid or expired token");
  });
  it("POST /logout returns 401 when the access token is invalid", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        authorization: "Bearer this.is.not.a.valid.token",
      },
    });
    expect(response.statusCode).toBe(401);
  });
  it("returns 204 and clears the refresh token cookie", async () => {
    const { token } = await setupAuthenticatedUser();
    const refreshToken = makeRefreshToken();

    vi.spyOn(authService, "logout").mockResolvedValue(undefined);

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cookies: {
        refresh_token: refreshToken,
      },
    });
    expect(response.statusCode).toBe(204);

    const cookie = response.cookies.find((c) => c.name === "refresh_token");
    expect(cookie).toBeDefined();
    expect(cookie?.maxAge).toBe(0);
  });
  it("propagates errors from authService.logout", async () => {
    const refreshToken = makeRefreshToken();
    const { token } = await setupAuthenticatedUser();

    vi.spyOn(authService, "logout").mockRejectedValue(
      new Error("Session already revoked"),
    );

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cookies: {
        refresh_token: refreshToken,
      },
    });

    expect(response.statusCode).toBe(500);
  });
  it("never crashes on arbitrary cookie values", async () => {
    const { token } = await setupAuthenticatedUser();

    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.constant(null),
          fc.constant(undefined),
        ),
        async (cookieValue) => {
          vi.spyOn(authService, "logout").mockResolvedValue(undefined);

          const response = await server.inject({
            method: "POST",
            url: "/api/auth/logout",
            headers: {
              authorization: `Bearer ${token}`,
            },
            cookies: {
              refresh_token: String(cookieValue),
            },
          });

          expect(response.statusCode).not.toBe(500);
        },
      ),
      { numRuns: 50 },
    );
  });
  it("calls authService.logout with the refresh token", async () => {
    const { token } = await setupAuthenticatedUser();
    const refreshToken = makeRefreshToken();

    const logoutSpy = vi
      .spyOn(authService, "logout")
      .mockResolvedValue(undefined);

    await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cookies: {
        refresh_token: refreshToken,
      },
    });

    expect(logoutSpy).toHaveBeenCalledWith(refreshToken);
  });
  it("still returns 204 and clears the cookie when no refresh token is present", async () => {
    const { token } = await setupAuthenticatedUser();

    vi.spyOn(authService, "logout").mockResolvedValue(undefined);

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(204);

    const cookie = response.cookies.find((c) => c.name === "refresh_token");
    expect(cookie?.maxAge).toBe(0);
  });
});
