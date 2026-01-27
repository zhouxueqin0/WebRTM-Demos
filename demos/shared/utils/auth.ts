import { getGlobalRtmClient, initRtm, RTMBaseError } from "../rtm";

/**
 * Mock login function - now uses RTM login
 * @param username - User's username (used as RTM uid)
 * @param password - User's password (optional, for future use)
 * @returns Promise that resolves when login is successful
 */
export const mockLogin = async (
  username = "test-demo",
  password = "",
): Promise<void> => {
  try {
    await initRtm(username);
  } catch (rtmError) {
    const { reason, errorCode, operation } = rtmError as RTMBaseError;
    console.error(
      {
        reason,
        errorCode,
      },
      `rtm ${operation} is error`,
    );
    throw rtmError;
  }
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
  try {
    if (!getGlobalRtmClient()) {
      return false;
    }
  } catch (e) {
    return false;
  }

  if (typeof localStorage !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};
