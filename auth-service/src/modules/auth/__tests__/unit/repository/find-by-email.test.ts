import { User } from "@/db/schema/users";
import { describe, expect, it, vi } from "vitest";
import { authRepository } from "../../../repository";

vi.mock("../../../repository");

describe("authRepository.findUser", () => {
  const validUser: User = {
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
  it("returns user's details from a valid email and valid user", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(validUser);

    const details = await authRepository.findUserByEmail(validUser.email);
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith(
      validUser.email,
    );
    expect(details).toEqual(validUser);
  });
  it("returns undefined when user is not found", async () => {
    vi.mocked(authRepository.findUserByEmail).mockResolvedValue(null);

    const result = await authRepository.findUserByEmail("missing@test.com");
    expect(result).toBeNull();
  });
});
