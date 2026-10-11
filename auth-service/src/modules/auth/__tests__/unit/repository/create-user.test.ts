import { describe, it, expect, beforeEach, vi } from "vitest";
import { authRepository } from "@/modules/auth/repository";
import { User } from "@/db/schema";
import db from "@/db";

vi.mock("@/db", () => ({
  default: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
  },
}));

const mockedDb = db as unknown as {
  insert: ReturnType<typeof vi.fn>;
  values: ReturnType<typeof vi.fn>;
  returning: ReturnType<typeof vi.fn>;
};

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
    mockedDb.returning.mockResolvedValue([fakeUser]);

    const result = await authRepository.createUser({
      name: "TEST USER",
      email: "test@test.com",
      password: "20202020202",
    });

    // oxlint-disable-next-line no-unused-vars
    const { password, ...user } = fakeUser;
    expect(result).toEqual(user);
  });
});
