import { authService } from "@/modules/auth/service";
import { sessionService } from "@/modules/sessions/service";
import { beforeEach } from "node:test";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/modules/sessions/service");
describe("authService.logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("calls sessionService.revoke with the refresh token", async () => {
    const refreshToken = "valid-refresh-token";

    await authService.logout(refreshToken);

    expect(sessionService.revoke).toHaveBeenCalledWith(refreshToken);
  });
  it("does nothing when refresh token is missing", async () => {
    await authService.logout("");
    await authService.logout(undefined as any);

    expect(sessionService.revoke).not.toHaveBeenCalled();
  });
  it("propagates errors from sessionService.revoke", async () => {
    vi.mocked(sessionService.revoke).mockRejectedValue(
      new Error("Session not found"),
    );

    await expect(authService.logout("bad-token")).rejects.toThrow(
      "Session not found",
    );
  });
});
