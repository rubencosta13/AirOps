import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { Password } from "../../../plugins/password";

describe("AuthService – property tests", () => {
  it("password hashing is deterministic and verifiable", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 4, maxLength: 128 }),
        async (password) => {
          const passwordUtils = new Password({
            memoryCost: 2 ** 12,
            timeCost: 2,
            parallelism: 1,
          });
          const hash = await passwordUtils.hash(password);
          const isValid = await passwordUtils.compare(hash, password); // check argument order!
          expect(isValid).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  }, 10_000);
});
