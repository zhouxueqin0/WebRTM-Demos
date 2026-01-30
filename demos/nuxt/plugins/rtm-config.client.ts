// Nuxt 插件：在客户端注入 RTM 配置到 process.env
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // 将 Nuxt 的 runtimeConfig 注入到 process.env，供 shared/rtm 使用
  if (process.client) {
    // @ts-ignore
    if (!window.process) {
      // @ts-ignore
      window.process = { env: {} };
    }
    // @ts-ignore
    window.process.env.NUXT_PUBLIC_APP_ID = config.public.appId;
    // @ts-ignore
    window.process.env.NUXT_PUBLIC_APP_CERT = config.public.appCert;
  }
});
