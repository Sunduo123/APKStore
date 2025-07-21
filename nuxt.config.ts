// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-simple-sitemap', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    sitemap: {
      siteUrl: 'http://localhost:3000', // 部署后请改为正式域名
      autoLastmod: true
    }
  }
})