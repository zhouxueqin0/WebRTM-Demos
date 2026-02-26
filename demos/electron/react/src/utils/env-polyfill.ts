/**
 * Environment variable polyfill for Vite projects
 * This allows shared/rtm code to access environment variables via process.env
 */

// Polyfill process.env for Vite environment
if (typeof process === "undefined") {
  // Browser environment: create process object
  (globalThis as any).process = {
    env: {
      VITE_APP_ID: (import.meta as any).env.VITE_APP_ID || "",
      VITE_APP_CERT: (import.meta as any).env.VITE_APP_CERT || "",
    },
  };
} else {
  // Electron environment: merge into existing process.env
  if (typeof (process as any).env === "undefined") {
    (process as any).env = {};
  }
  // Merge Vite env variables into process.env
  (process as any).env.VITE_APP_ID = (import.meta as any).env.VITE_APP_ID || "";
  (process as any).env.VITE_APP_CERT =
    (import.meta as any).env.VITE_APP_CERT || "";
}
