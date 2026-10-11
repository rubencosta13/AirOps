import { authRepository } from "@/modules/auth/repository";
import { authService } from "@/modules/auth/service";
import { sessionRepository } from "@/modules/sessions/repository";
import { tokenService } from "@/modules/tokens/service"; // adjust path
import { randomBytes } from "node:crypto";
import { vi } from "vitest";

async function makeAccessToken(
  overrides: Partial<{ userId: string; email: string; sessionId: string }> = {},
) {
  return tokenService.createAccessToken({
    userId: overrides.userId ?? "user-123",
    email: overrides.email ?? "john@example.com",
    sessionId: overrides.sessionId ?? "session-abc",
  });
}

async function setupAuthenticatedUser(
  overrides: {
    email?: string;
    userId?: string;
    sessionId?: string;
    name?: string;
  } = {},
) {
 
  const email = overrides.email ?? "john@example.com";
  const userId = overrides.userId ?? "user-123";
  const sessionId = overrides.sessionId ?? "12111";
  const name = overrides.name ?? "John Doe";

  const token = await makeAccessToken({ email, userId, sessionId });

  vi.spyOn(sessionRepository, "findById").mockResolvedValue({
    id: sessionId,
    userId,
    revokedAt: null,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    tokenHash: "whatever",
    createdAt: undefined,
    updatedAt: undefined,
  });

  vi.spyOn(authRepository, "findUserById").mockResolvedValue({
    id: userId,
    name,
    email,
    password: "",
    verified: true,
    verifiedAt: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
  });

  vi.spyOn(authService, "getUserDetails").mockResolvedValue({
    id: userId,
    name,
    email,
    password: "",
    verified: false,
    verifiedAt: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    deletedAt: undefined,
  });

  return { token, email, userId, sessionId, name };
}

const makeRefreshToken = () => {
  return randomBytes(64).toString("hex");
};

export { setupAuthenticatedUser, makeAccessToken, makeRefreshToken };
