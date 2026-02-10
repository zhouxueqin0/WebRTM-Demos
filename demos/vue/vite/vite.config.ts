import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "agora-rtm": path.resolve(__dirname, "node_modules/agora-rtm"),
        events: path.resolve(__dirname, "node_modules/events"),
      },
    },
    define: {
      "process.env.VITE_APP_ID": JSON.stringify(env.VITE_APP_ID || ""),
      "process.env.VITE_APP_CERT": JSON.stringify(env.VITE_APP_CERT || ""),
    },
  };
});
