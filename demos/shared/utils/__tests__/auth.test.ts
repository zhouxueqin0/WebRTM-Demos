import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockLogin, mockLogout, isAuthenticated } from "../auth";
import { mockLocalStorage } from "../../test-utils/setup";

// Mock RTM module
vi.mock("../rtm", () => ({
  initRtm: vi.fn().mockResolvedValue(undefined),
  RTMBaseError: class RTMBaseError extends Error {
    reason: string;
    errorCode: number;
    operation: string;
    constructor(message: string) {
      super(message);
      this.reason = message;
      this.errorCode = 0;
      this.operation = "test";
    }
  },
}));

describe("auth utils", () => {
  beforeEach(() => {
    (global || window).localStorage = mockLocalStorage();
    vi.clearAllMocks();
  });

  describe("mockLogin", () => {
    it("calls initRtm with username", async () => {
      const { initRtm } = await import("../../rtm");
      await mockLogin("test-user", "password");
      expect(initRtm).toHaveBeenCalledWith("test-user");
    });

    it("uses default username when not provided", async () => {
      const { initRtm } = await import("../../rtm");
      await mockLogin();
      expect(initRtm).toHaveBeenCalledWith("test-demo");
    });

    it("throws error when RTM login fails", async () => {
      const { initRtm } = await import("../../rtm");
      const mockError = new Error("RTM connection failed");
      vi.mocked(initRtm).mockRejectedValueOnce(mockError);

      await expect(mockLogin("user", "password")).rejects.toThrow(
        "RTM connection failed",
      );
    });
  });

  describe("mockLogout", () => {
    it("removes token from localStorage", async () => {
      localStorage.setItem("token", "test-token");
      await mockLogout();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when token exists", () => {
      localStorage.setItem("token", "test-token");
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false when token does not exist", () => {
      expect(isAuthenticated()).toBe(false);
    });
  });
});
