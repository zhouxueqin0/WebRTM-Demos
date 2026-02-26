// Polyfill for process.env in browser environment
if (typeof process === "undefined") {
  (window as any).process = {
    env: {
      VITE_APP_ID: (import.meta as any).env.VITE_APP_ID || "",
      VITE_APP_CERT: (import.meta as any).env.VITE_APP_CERT || "",
    },
  };
} else {
  // Electron 环境：合并到现有 process.env
  if (typeof (process as any).env === "undefined") {
    (process as any).env = {};
  }
  // 直接赋值，合并环境变量
  (process as any).env.VITE_APP_ID = (import.meta as any).env.VITE_APP_ID || "";
  (process as any).env.VITE_APP_CERT =
    (import.meta as any).env.VITE_APP_CERT || "";
}
