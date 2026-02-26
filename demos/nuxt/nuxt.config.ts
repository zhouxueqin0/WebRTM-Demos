// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  ssr: false, // 禁用 SSR，纯前端应用

  modules: ["@pinia/nuxt"],

  vite: {
    optimizeDeps: {
      include: ["events"],
    },
  },
});
