/**
 * Validation utility functions
 */

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with status and message
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true, message: "Password is valid" };
};

/**
 * Validate username
 * @param username - Username to validate
 * @returns Validation result with status and message
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.length < 3) {
    return { valid: false, message: "Username must be at least 3 characters" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { valid: true, message: "Username is valid" };
};
