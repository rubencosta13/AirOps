import { describe, expect, it, vi } from "vitest";
import { emailService } from "@/email";
import { authRepository } from "@/modules/auth/repository";
import { authService } from "@/modules/auth/service";
import fc from "fast-check";
import { User } from "@/db/schema/users";

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
  it("creates a valid user and returns the user", async () => {
    vi.spyOn(authRepository, "createUser").mockResolvedValue(user);

    vi.spyOn(emailService, "sendAccountRegister").mockResolvedValue(undefined);

    const result = await authService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password: "secret123",
    });

    expect(result).toEqual(user);
  });

  it("sends an account registration email", async () => {
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

        createUser.mockResolvedValue(generatedUser);
        createUser.mockClear();

        const result = await authService.createUser(input);

        expect(result).toEqual(generatedUser);

        expect(emailService.sendAccountRegister).toHaveBeenCalledWith(
          input.email,
          generatedUser,
          expect.any(String),
        );
      }),
    );
  }, 10_000);
});
