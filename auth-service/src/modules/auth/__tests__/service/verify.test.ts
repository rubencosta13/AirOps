import { describe, expect, it, vi } from "vitest";
import { authService } from "@/modules/auth/service";
import { emailValidationService } from "@/modules/email-validation/service";
import UserCreatedPublisher from "@/modules/auth/events/user-created";
import { User } from "@/db/schema/users";

describe("authService.verify", () => {
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

  it("successfully verifies a user that is not verified", async () => {
    const unverifiedUser: User = {
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

    vi.spyOn(emailValidationService, "verify").mockResolvedValue(verifiedUser);

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
