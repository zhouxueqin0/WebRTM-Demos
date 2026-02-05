/**
 * Environment variable polyfill for Vite projects
 * This allows shared/rtm code to access environment variables via process.env
 */
// Polyfill process.env for Vite environment
if (typeof process === "undefined") {
  (globalThis as any).process = {
    env: {
      VITE_APP_ID: (import.meta as any).env.VITE_APP_ID || "",
      VITE_APP_CERT: (import.meta as any).env.VITE_APP_CERT || "",
    },
  };
} else if (typeof (process as any).env === "undefined") {
  (process as any).env = {
    VITE_APP_ID: (import.meta as any).env.VITE_APP_ID || "",
    VITE_APP_CERT: (import.meta as any).env.VITE_APP_CERT || "",
  };
}
