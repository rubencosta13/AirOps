import { User } from "@/db/schema/users";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { authRepository } from "../../../repository";
import { authService } from "../../../service";

vi.mock("../../../repository");
vi.mock("@/modules/sessions/service");
vi.mock("@/modules/sessions/repository");

describe("authService.getUserDetails", () => {
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
  it("returns the user details if they are signed in", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(mockUser);
    const result = await authService.getUserDetails(mockUser.email);
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith(
      "john@example.com",
    );
    expect(result).toEqual(mockUser);
  });
  it("returns null when user is not found", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);
    const result = await authService.getUserDetails("no@test.com");
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith("no@test.com");
    expect(result).toEqual(null);
  });
  it("propagates repository errors", async () => {
    vi.mocked(authRepository.findUserByEmail).mockRejectedValue(
      new Error("DB connection failed"),
    );

    await expect(
      authService.getUserDetails("john@example.com"),
    ).rejects.toThrow("DB connection failed");
  });
});
