import { server } from "@/server";
import { describe, expect, it } from "vitest";

describe("Sign in controller", () => {
  it("GET /signin returns error if no user details were provided", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signup",
      payload: {},
    });
    expect(response.statusCode).toBe(400);

    expect(response.json()).toEqual({
      error: "VALIDATION_ERROR",
      message: "The request is invalid",
      fields: [
        {
          field: "name",
          message: "Invalid input: expected string, received undefined",
        },
        {
          field: "email",
          message: "Invalid input: expected string, received undefined",
        },
        {
          field: "password",
          message: "Invalid input: expected string, received undefined",
        },
      ],
    });
  });
});
