import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  optimizeDeps: {
    include: ["events"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
});
