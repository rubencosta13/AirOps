import { cleanupDatabase, setupDatabase } from "@/__mocks__/db";
import { server } from "@/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { SignUpSchema } from "../../schema";
import { authService } from "../../service";
import { authRepository } from "../../repository";
import { Password } from "@/plugins/password";

vi.mock("@/email/email.service", () => import("@/__mocks__/email"));
vi.mock("@/db", () => import("@/__mocks__/db"));

describe("POST /api/auth/signup", () => {
  beforeAll(async () => {
    await setupDatabase();
  });
  afterAll(async () => {
    await cleanupDatabase();
  });
  it("creates a new user", async () => {
    vi.spyOn(authService, "createUser");
    vi.spyOn(authRepository, "findUserByEmail");
    vi.spyOn(authRepository, "createUser");
    const hashSpy = vi.spyOn(Password.prototype, "hash");

    const signupDetails: SignUpSchema = {
      email: "test@test.com",
      name: "Test user",
      password: "this_is_a_password",
    };

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signup",
      body: signupDetails as SignUpSchema,
    });

    expect(authService.createUser).toHaveBeenCalledWith(signupDetails);
    expect(authRepository.findUserByEmail).toHaveBeenCalledWith(
      signupDetails.email,
    );

    // ensure password has been hashed
    expect(Password.prototype.hash).toHaveBeenCalledWith(
      signupDetails.password,
    );
    const hashResult = hashSpy.mock.results[0];
    expect(hashResult.type).toBe("return");
    const hashedPassword = await hashResult.value;
    expect(hashedPassword).not.toBe(signupDetails.password);

    expect(response.statusCode).toBe(200);
  });

  it("returns 400 when the name is missing", async () => {
    const signupDetails = {
      email: "test@test.com",
      password: "this_is_a_password",
    };

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signup",
      body: signupDetails,
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: "VALIDATION_ERROR",
      fields: [
        {
          field: "name",
          message: "Invalid input: expected string, received undefined",
        },
      ],
      message: "The request is invalid",
    });
  });
  it("returns 400 when the email is missing", async () => {
    const signupDetails = {
      name: "test user",
      password: "this_is_a_password",
    };

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signup",
      body: signupDetails,
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: "VALIDATION_ERROR",
      fields: [
        {
          field: "email",
          message: "Invalid input: expected string, received undefined",
        },
      ],
      message: "The request is invalid",
    });
  });
  it("returns 400 when the password is missing", async () => {
    const signupDetails = {
      name: "test user",
      email: "test@test.com",
    };

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signup",
      body: signupDetails,
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: "VALIDATION_ERROR",
      fields: [
        {
          field: "password",
          message: "Invalid input: expected string, received undefined",
        },
      ],
      message: "The request is invalid",
    });
  });

  it("returns 409 when the email is already registered", async () => {
    const signupDetails: SignUpSchema = {
      name: "test user",
      email: "verified@airops.local",
      password: "test_user",
    };
    await authService.createUser(signupDetails);

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/signup",
      body: signupDetails,
    });
    expect(response.statusCode).toBe(409);
    expect(JSON.parse(response.body)).toEqual({
      error: "CONFLICT",
      message: "Error creating user",
    });
  });
});
