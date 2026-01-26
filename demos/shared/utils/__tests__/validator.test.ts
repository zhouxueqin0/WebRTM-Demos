import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  validatePassword,
  validateUsername,
} from "../validator.js";

describe("validator utils", () => {
  describe("isValidEmail", () => {
    it("validates correct email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("rejects invalid email", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("accepts valid password", () => {
      const result = validatePassword("password123");
      expect(result.valid).toBe(true);
    });

    it("rejects short password", () => {
      const result = validatePassword("12345");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("at least 6 characters");
    });

    it("rejects empty password", () => {
      const result = validatePassword("");
      expect(result.valid).toBe(false);
    });
  });

  describe("validateUsername", () => {
    it("accepts valid username", () => {
      const result = validateUsername("user123");
      expect(result.valid).toBe(true);
    });

    it("rejects short username", () => {
      const result = validateUsername("ab");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("at least 3 characters");
    });

    it("rejects username with special characters", () => {
      const result = validateUsername("user@123");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("letters, numbers, and underscores");
    });
  });
});
