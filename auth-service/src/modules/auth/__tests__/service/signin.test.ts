import { beforeEach, describe, expect, it, vi } from "vitest";
import { authRepository } from "../../repository";
import { Password } from "@/plugins/password";
import { sessionService } from "@/modules/sessions/service";
import { User } from "@/db/schema/users";
import { tokenService } from "@/modules/tokens/service";
import { authService } from "../../service";
import { UnauthorizedError } from "@/errors/app-error";

vi.mock("../../repository");
vi.mock("@/modules/sessions/service");
vi.mock("@/modules/tokens/service");
vi.mock("@/plugins/password");

describe("authService.signin", () => {
  const mockUser: User = {
    id: "user-1",
    email: "john@example.com",
    password: "hashed-password",
    verified: true,
    createdAt: new Date(),
    deletedAt: null,
    name: "test-user",
    verifiedAt: new Date(),
    updatedAt: null,
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("returns token if user is verified and details are correct", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(Password.prototype.compare).mockResolvedValue(true);
    vi.mocked(sessionService.create).mockResolvedValue({
      id: "session-1",
      refreshToken: "refresh-token",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60),
      userId: mockUser.id,
      tokenHash: "token-hahs",
      revokedAt: null,
      updatedAt: null,
    });
    vi.mocked(tokenService.createAccessToken).mockResolvedValue("access-token");

    const result = await authService.signin({
      email: mockUser.email,
      password: mockUser.password,
    });
    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(sessionService.create).toHaveBeenCalledWith("user-1");
    expect(tokenService.createAccessToken).toHaveBeenCalledWith({
      userId: "user-1",
      email: "john@example.com",
      sessionId: "session-1",
    });
  });

  it("throws UnauthorizedError when user does not exist", async () => {
    vi.mocked(authRepository.findUserByEmail).mockReturnValue(null);
    vi.mocked(Password.prototype.compare).mockResolvedValue(false);

    await expect(
      authService.signin({
        email: "nobody@test.test",
        password: "Some_password",
      }),
    ).rejects.toThrow(UnauthorizedError);

    expect(Password.prototype.compare).toHaveBeenCalled();
  });

  it("throws UnauthorizedError when password is incorrect", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(Password.prototype.compare).mockResolvedValue(false);
    vi.mocked(sessionService.create).mockResolvedValue({
      id: "session-1",
      refreshToken: "refresh-token",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60),
      userId: mockUser.id,
      tokenHash: "token-hahs",
      revokedAt: null,
      updatedAt: null,
    });

    await expect(
      authService.signin({
        email: mockUser.email,
        password: "invalid_password",
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("throws UnauthorizedError when user is not verified", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue({
      ...mockUser,
      verified: false,
      verifiedAt: null,
    });
    vi.mocked(Password.prototype.compare).mockResolvedValue(true);

    await expect(
      authService.signin({
        email: mockUser.email,
        password: mockUser.password,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("always runs password comparison even when user is missing", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);
    vi.mocked(Password.prototype.compare).mockResolvedValue(false);

    await expect(
      authService.signin({ email: "missing@example.com", password: "test" }),
    ).rejects.toThrow();

    expect(Password.prototype.compare).toHaveBeenCalledTimes(1);
  });

  it("propagates error when session creation fails", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(Password.prototype.compare).mockResolvedValue(true);
    vi.mocked(sessionService.create).mockRejectedValue(
      new Error("Session creation failed"),
    );

    await expect(
      authService.signin({
        email: "test@test.com",
        password: "password123",
      }),
    ).rejects.toThrow("Session creation failed");
  });

  it("propagates error when token creation fails", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(Password.prototype.compare).mockResolvedValue(true);
    vi.mocked(sessionService.create).mockResolvedValue({
      id: "123",
      refreshToken: "refresh-token",
      createdAt: new Date(),
      expiresAt: new Date(),
      revokedAt: null,
      tokenHash: "token-hash",
      updatedAt: new Date(),
      userId: mockUser.id,
    });

    vi.mocked(tokenService.createAccessToken).mockRejectedValue(
      new Error("Token Service failed"),
    );

    await expect(
      authService.signin({
        email: mockUser.email,
        password: mockUser.password,
      }),
    ).rejects.toThrow("Token Service failed");
  });
});
