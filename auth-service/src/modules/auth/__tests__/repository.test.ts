// src/modules/auth/__tests__/repository.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockedDb } from "@/__mocks__/db";
import { authRepository } from "../repository";

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

describe("authRepository.createUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedDb.select.mockReturnThis();
    mockedDb.from.mockReturnThis();
    mockedDb.where.mockResolvedValue([]);
  });

  it("creates and returns a user", async () => {
    const fakeUser = {
      id: "1",
      name: "TEST USER",
      email: "test@test.com",
      password: "superSecureAndHardToCrackPassword...You'dHope",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockedDb.insert.mockReturnThis();
    mockedDb.values.mockReturnThis();
    mockedDb.returning.mockResolvedValue([fakeUser]);

    const result = await authRepository.createUser({
      name: "TEST USER",
      email: "test@test.com",
      password: "20202020202",
    });
    expect(result).toEqual({
      id: "1",
      name: "TEST USER",
      email: "test@test.com",
      createdAt: fakeUser.createdAt,
      updatedAt: fakeUser.updatedAt,
    });

    expect(result).not.toHaveProperty("password");
  });

  it("propagates database errors", async () => {
    const error = new Error("Database Error");
    mockedDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockRejectedValue(error),
      }),
    } as any);

    await expect(
      authRepository.createUser({
        name: "John Doe",
        email: "john@example.com",
        password: "secret123",
      }),
    ).rejects.toThrow(error);
  });
});
