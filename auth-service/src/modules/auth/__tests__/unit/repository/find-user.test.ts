import { describe, it, expect, beforeEach, vi } from "vitest";
import { authRepository } from "@/modules/auth/repository";
import { User } from "@/db/schema";
import db from "@/db";

vi.mock("@/db", () => ({
  default: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  },
}));

const mockedDb = db as unknown as {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
};

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
    mockedDb.where.mockResolvedValue([fakeUser]);

    const result = await authRepository.findUser("test@example.com", "secret");

    expect(result).toEqual(fakeUser);
  });

  it("returns undefined when not found", async () => {
    mockedDb.where.mockResolvedValue([]);

    const result = await authRepository.findUser(
      "missing@example.com",
      "whatever",
    );

    expect(result).toBeUndefined();
  });
});
