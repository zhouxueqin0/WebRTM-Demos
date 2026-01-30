// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  ssr: false, // 禁用 SSR，因为 agora-rtm 只能在客户端运行

  modules: ["@pinia/nuxt"],

  runtimeConfig: {
    public: {
      // Nuxt 会自动从 NUXT_PUBLIC_APP_ID 和 NUXT_PUBLIC_APP_CERT 读取
      appId: "",
      appCert: "",
    },
  },

  vite: {
    optimizeDeps: {
      include: ["agora-rtm", "events"], // 预构建 agora-rtm 和 events
    },
    build: {
      commonjsOptions: {
        include: [/agora-rtm/, /events/, /node_modules/],
        transformMixedEsModules: true,
      },
    },
    resolve: {
      alias: {
        events: "events",
      },
    },
  },
});
