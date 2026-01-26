/**
 * Login result interface
 */
export interface LoginResult {
  success: boolean;
  token?: string;
  user?: { username: string };
  message?: string;
}

/**
 * Mock login function
 * @param username - User's username
 * @param password - User's password
 * @returns Promise with login result
 */
export const mockLogin = async (
  username = "",
  password = "",
): Promise<LoginResult> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TODO: implement real login logic
  // For now, accept any non-empty credentials
  if (username && password) {
    return {
      success: true,
      token: "mock-jwt-token-" + Date.now(),
      user: { username },
    };
  }

  return {
    success: false,
    message: "Invalid credentials",
  };
};

/**
 * Mock logout function
 * @returns Promise that resolves when logout is complete
 */
export const mockLogout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Clear any stored tokens
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("token");
  }
};

/**
 * Check if user is authenticated
 * @returns true if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  if (typeof localStorage !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};
