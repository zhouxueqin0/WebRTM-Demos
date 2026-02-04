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
    include: ["events", "agora-rtm"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  build: {
    commonjsOptions: {
      include: [/events/, /agora-rtm/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
      onwarn(warning, warn) {
        if (
          warning.code === "MIXED_EXPORTS" ||
          (warning.message && warning.message.includes("export * from"))
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
