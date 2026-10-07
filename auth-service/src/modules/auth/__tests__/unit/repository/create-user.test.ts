import { describe, it, expect, beforeEach, vi } from "vitest";
import { authRepository } from "@/modules/auth/repository";
import { User } from "@/db/schema";
vi.mock("../../../repository");

describe("authRepository.createUser", () => {
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
  it("creates and returns a user", async () => {
    vi.mocked(authRepository.createUser).mockResolvedValue(fakeUser);

    const result = await authRepository.createUser({
      name: "TEST USER",
      email: "test@test.com",
      password: "20202020202",
    });
    expect(result).toEqual(fakeUser);
  });
});
