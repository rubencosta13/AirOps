import { describe, it, expect, beforeEach, vi } from "vitest";
import { authRepository } from "@/modules/auth/repository";
import { User } from "@/db/schema";

vi.mock("../../../repository");
describe("authRepository.findUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const fakeUser: User = {
    id: "1",
    name: "TEST USER",
    email: "test@test.com",
    password: "superSecureAndHardToCrackPassword...You'dHope",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    verified: true,
    verifiedAt: new Date(),
  };
  it("returns the user when found", async () => {
    vi.mocked(authRepository.findUser).mockResolvedValue(fakeUser);
    const result = await authRepository.findUser("test@example.com", "secret");
    expect(result).toEqual(fakeUser);
  });
  it("returns undefined when not found", async () => {
    vi.mocked(authRepository.findUser).mockResolvedValue(undefined);
    const result = await authRepository.findUser(
      "missing@example.com",
      "whatever",
    );
    expect(result).toBeUndefined();
  });
});
