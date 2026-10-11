import { authRepository } from "@/modules/auth/repository";
import { authService } from "@/modules/auth/service";
import { sessionService } from "@/modules/sessions/service";
import { tokenService } from "@/modules/tokens/service";
import { server } from "@/server";
import { randomBytes } from "node:crypto";
import { describe, expect, it, vi, beforeEach } from "vitest";
import fc from "fast-check";
vi.mock("@/modules/sessions/service");

describe("authService.refresh", () => {
  beforeEach(async () => {
    await server.ready();
    vi.clearAllMocks();
  });

  it("refreshes the session and creates a new access token", async () => {
    const refreshToken = randomBytes(20).toString("hex");

    vi.spyOn(sessionService, "refresh").mockResolvedValue({
      session: {
        id: "session-id",
        userId: "user-id",
        tokenHash: "",
        expiresAt: undefined,
        createdAt: undefined,
        revokedAt: undefined,
        updatedAt: undefined,
      },
      refreshToken: "new-refresh-token",
    });

    vi.spyOn(authRepository, "findUserById").mockResolvedValue({
      id: "user-id",
      email: "user@example.com",
      name: "",
      password: "",
      verified: false,
      verifiedAt: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    });

    vi.spyOn(tokenService, "createAccessToken").mockResolvedValue(
      "new-access-token",
    );

    const result = await authService.refresh(refreshToken);

    expect(sessionService.refresh).toHaveBeenCalledWith(refreshToken);
    expect(authRepository.findUserById).toHaveBeenCalledWith("user-id");
    expect(tokenService.createAccessToken).toHaveBeenCalledWith({
      userId: "user-id",
      email: "user@example.com",
      sessionId: "session-id",
    });

    expect(result).toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
  });
  it("passes arbitrary refresh tokens to sessionService.refresh", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }),
        async (refreshToken) => {
          vi.spyOn(sessionService, "refresh").mockResolvedValue({
            session: {
              id: "session-id",
              userId: "user-id",
              tokenHash: "",
              expiresAt: undefined,
              createdAt: undefined,
              revokedAt: undefined,
              updatedAt: undefined,
            },
            refreshToken: "new-refresh-token",
          });

          vi.spyOn(authRepository, "findUserById").mockResolvedValue({
            id: "user-id",
            email: "user@example.com",
            name: "",
            password: "",
            verified: false,
            verifiedAt: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: undefined,
          });

          vi.spyOn(tokenService, "createAccessToken").mockResolvedValue(
            "new-access-token",
          );

          await authService.refresh(refreshToken);

          expect(sessionService.refresh).toHaveBeenCalledWith(refreshToken);

          vi.restoreAllMocks();
        },
      ),
      { numRuns: 100 },
    );
  });
});
