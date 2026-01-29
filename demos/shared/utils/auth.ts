import {
  getGlobalRtmClient,
  initRtm,
  releaseRtm,
  RTMBaseError,
  rtmEventEmitter,
} from "../rtm";

/**
 * Mock login function - now uses RTM login
 * @param username - User's username (used as RTM uid)
 * @param password - User's password (optional, for future use)
 * @returns Promise that resolves when login is successful
 */
export const mockAppLogin = async (
  username = "",
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
export const mockAppLogout = async (): Promise<void> => {
  rtmEventEmitter.removeAllListeners();

  await releaseRtm();

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
