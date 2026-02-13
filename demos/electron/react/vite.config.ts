import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ["events", "agora-rtm"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
