import { beforeEach, describe, expect, it, vi } from "vitest";
import { emailService } from "@/email";
import { authRepository } from "@/modules/auth/repository";
import { authService } from "@/modules/auth/service";
import fc from "fast-check";
import { User } from "@/db/schema/users";
import { ConflictError } from "@/errors/app-error";

describe("authService.createUser", () => {
  const user: User = {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
    password: "HASHED_PASSWORD",
    verified: false,
    verifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a valid user and returns the user", async () => {
    vi.spyOn(authRepository, "findUserByEmail").mockResolvedValue(null);
    vi.spyOn(authRepository, "createUser").mockResolvedValue(user);
    vi.spyOn(emailService, "sendAccountRegister").mockResolvedValue(undefined);

    const result = await authService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password: "secret123",
    });

    expect(result).toEqual(user);
  });

  it("throws ConflictError if a user already exists", async () => {
    vi.spyOn(authRepository, "findUserByEmail").mockResolvedValue(user);

    await expect(
      authService.createUser({
        email: user.email,
        name: "Someone",
        password: "new-user-new-password",
      }),
    ).rejects.toThrow(ConflictError);
  });

  it("sends an account registration email", async () => {
    vi.spyOn(authRepository, "findUserByEmail").mockResolvedValue(null);
    vi.spyOn(authRepository, "createUser").mockResolvedValue(user);

    const sendAccountRegister = vi
      .spyOn(emailService, "sendAccountRegister")
      .mockResolvedValue(undefined);

    await authService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password: "secret123",
    });

    expect(sendAccountRegister).toHaveBeenCalledWith(
      "john@example.com",
      user,
      expect.any(String),
    );
  });

  it("creates users correctly for arbitrary valid inputs", async () => {
    const createUser = vi.spyOn(authRepository, "createUser");
    const findUserByEmail = vi.spyOn(authRepository, "findUserByEmail");

    vi.spyOn(emailService, "sendAccountRegister").mockResolvedValue(undefined);

    const createUserArb = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }),
      email: fc.emailAddress(),
      password: fc.string({ minLength: 4, maxLength: 128 }),
    });

    await fc.assert(
      fc.asyncProperty(createUserArb, async (input) => {
        const generatedUser: User = {
          ...user,
          name: input.name,
          email: input.email,
        };

        findUserByEmail.mockResolvedValue(null);
        createUser.mockResolvedValue(generatedUser);

        const result = await authService.createUser(input);

        expect(result).toEqual(generatedUser);
        expect(emailService.sendAccountRegister).toHaveBeenCalledWith(
          input.email,
          generatedUser,
          expect.any(String),
        );
      }),
    );
  }, 30_000);
});
