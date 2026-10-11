import db from "@/db";
import { usersTable } from "@/db/schema";
import { authRepository } from "@/modules/auth/repository";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/db", () => ({
  default: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  },
}));

const mockedDb = db as unknown as {
  where: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
};

describe("authRepository.resetPassword", () => {
  it("updates the password for the given user", async () => {
    mockedDb.update = vi.fn().mockReturnThis();
    mockedDb.set = vi.fn().mockReturnThis();
    mockedDb.where = vi.fn().mockResolvedValue(undefined);

    await authRepository.resetPassword("user-123", "new-hash");
    expect(mockedDb.update).toHaveBeenCalledWith(usersTable);
    expect(mockedDb.set).toHaveBeenCalledWith({ password: "new-hash" });
    expect(mockedDb.where).toHaveBeenCalled();
  });
  it("does not throw when the user does not exist", async () => {
    mockedDb.update = vi.fn().mockReturnThis();
    mockedDb.set = vi.fn().mockReturnThis();
    mockedDb.where = vi.fn().mockResolvedValue(undefined);

    await expect(
      authRepository.resetPassword("invalid-user", "new-password"),
    ).resolves.toBeUndefined();
  });
});
