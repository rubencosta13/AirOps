import { describe, expect, it, vi } from "vitest";
import { authService } from "../service";
import { emailService } from "@/email";
import { authRepository } from "../repository";
import fc from "fast-check";
import { emailValidationService } from "@/modules/email-validation/service";
import UserCreatedPublisher from "../events/user-created";

describe("Auth Service", () => {
  describe("authService.createUser", () => {
    type User = Awaited<ReturnType<typeof authRepository.createUser>>;

    const user: User = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      verified: false,
      verifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    it("creates a valid user and returns the user", async () => {
      vi.spyOn(authRepository, "createUser").mockResolvedValue(user);

      vi.spyOn(emailService, "sendAccountRegister").mockResolvedValue(
        undefined,
      );

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

      vi.spyOn(emailService, "sendAccountRegister").mockResolvedValue(
        undefined,
      );

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
  describe("authService.verify", () => {
    type User = Awaited<ReturnType<typeof authRepository.createUser>>;

    const user: User = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      verified: false,
      verifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it("successfully verifies a user that is not verified", async () => {
      const unverifiedUser = {
        ...user,
        password: "hashed-password",
        verified: false,
        verifiedAt: null,
        deletedAt: null,
      };

      const verifiedUser = {
        ...unverifiedUser,
        verified: true,
        verifiedAt: new Date(),
      };

      vi.spyOn(emailValidationService, "verify").mockResolvedValue(
        verifiedUser,
      );

      const publish = vi
        .spyOn(UserCreatedPublisher, "publish")
        .mockResolvedValue(undefined);

      const result = await authService.verifyAccount("verification-token");

      expect(result).toEqual(verifiedUser);

      expect(emailValidationService.verify).toHaveBeenCalledWith(
        "verification-token",
      );

      expect(publish).toHaveBeenCalledWith(verifiedUser);
    });
  });
});
