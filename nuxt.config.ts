// nuxt.config.ts for Nuxt3
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  app: {
    head: {
      title: 'APKStore',
      meta: [
        { name: 'description', content: 'APKStore - 精美且流畅的安卓应用下载与发现平台' },
        { name: 'keywords', content: 'APK, 安卓, 应用, 下载, 游戏, 软件, 手机, 免费' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'APKStore Team' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})