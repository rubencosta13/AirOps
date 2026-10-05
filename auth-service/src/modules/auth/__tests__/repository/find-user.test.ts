import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockedDb } from "@/__mocks__/db";
import { authRepository } from "@/modules/auth/repository";

describe("authRepository.findUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedDb.select.mockReturnThis();
    mockedDb.from.mockReturnThis();
    mockedDb.where.mockResolvedValue([]);
  });

  it("returns the user when found", async () => {
    const fakeUser = {
      id: "1",
      email: "test@example.com",
      password: "secret",
    };

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
