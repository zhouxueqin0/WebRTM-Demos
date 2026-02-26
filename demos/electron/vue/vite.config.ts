import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],

  optimizeDeps: {
    include: ["events", "agora-rtm"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
