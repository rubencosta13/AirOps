import { User } from "@/db/schema/users";
import { server as app } from "@/server";
import { getAuthToken } from "@/tests/helpers/auth";
import { describe, expect, it } from "vitest";

describe("authService.getUserDetails", () => {
  const mockUser: User = {
    id: "user-1",
    email: "john@example.com",
    password: "hashed-password",
    verified: true,
    createdAt: new Date(),
    deletedAt: null,
    name: "test-user",
    verifiedAt: new Date(),
    updatedAt: null,
  };
  it.skip("returns the user details if they are signed in", async () => {
    console.log(process.env.SESSION_SECRET);
    console.log(process.env.JWT_SECRET);
    const token = await getAuthToken({
      sub: "user-1-sub",
      sid: "user-1-sid",
      email: mockUser.email,
    });

    const result = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    expect(result.statusCode).toBe(200);
  });
});
