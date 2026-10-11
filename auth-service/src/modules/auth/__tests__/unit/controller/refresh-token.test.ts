import { authService } from "@/modules/auth/service";
import { server } from "@/server";
import { setupAuthenticatedUser } from "@/tests/helpers/access-token";
import { describe, expect, it, vi, beforeEach } from "vitest";
import fc from "fast-check";

vi.mock("@/modules/sessions/service");
describe("Refresh Token controller", () => {
  beforeEach(async () => {
    await server.ready();
    vi.clearAllMocks();
  });
  it("Throws 401 error if no refresh token is provided", async () => {
    const { token } = await setupAuthenticatedUser();
    const result = await server.inject({
      method: "POST",
      url: "/api/auth/refresh",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(result.statusCode).toBe(401);
    expect(result.json()).toEqual({
      error: "Not Authorized",
      message: "Missing refresh token",
    });
  });
  it("returns a new access token when refresh token is valid", async () => {
    const { token } = await setupAuthenticatedUser();
    vi.spyOn(authService, "refresh").mockResolvedValue({
      accessToken: "new_access_token",
      refreshToken: "new_refresh_token",
    });

    const result = await server.inject({
      method: "POST",
      url: "/api/auth/refresh",
      headers: {
        authorization: `Bearer ${token}`,
        cookie: "refresh_token=old_refresh_token",
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.json()).toEqual({
      accessToken: "new_access_token",
    });
  });
  it("passes the refresh token cookie to authService.refresh", async () => {
    const { token } = await setupAuthenticatedUser();

    const refreshSpy = vi.spyOn(authService, "refresh").mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    await server.inject({
      method: "POST",
      url: "/api/auth/refresh",
      headers: {
        authorization: `Bearer ${token}`,
        cookie: "refresh_token=my-refresh-token",
      },
    });

    expect(refreshSpy).toHaveBeenCalledWith("my-refresh-token");
  });
  it("sets the new refresh token cookie", async () => {
    const { token } = await setupAuthenticatedUser();

    vi.spyOn(authService, "refresh").mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    const result = await server.inject({
      method: "POST",
      url: "/api/auth/refresh",
      headers: {
        authorization: `Bearer ${token}`,
        cookie: "refresh_token=old-refresh-token",
      },
    });

    expect(result.statusCode).toBe(200);

    const setCookie = result.headers["set-cookie"];

    expect(setCookie).toContain("refresh_token=new-refresh-token");
    expect(setCookie).toContain("Max-Age=2592000");
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
  });
  it("passes arbitrary valid refresh token values to authService.refresh", async () => {
    const { token } = await setupAuthenticatedUser();

    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[A-Za-z0-9._~-]+$/),
        async (refreshToken) => {
          const refreshSpy = vi
            .spyOn(authService, "refresh")
            .mockResolvedValue({
              accessToken: "new-access-token",
              refreshToken: "new-refresh-token",
            });

          await server.inject({
            method: "POST",
            url: "/api/auth/refresh",
            headers: {
              authorization: `Bearer ${token}`,
              cookie: `refresh_token=${refreshToken}`,
            },
          });

          expect(refreshSpy).toHaveBeenCalledWith(refreshToken);

          refreshSpy.mockRestore();
        },
      ),
    );
  });
});
