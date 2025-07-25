// nuxt.config.ts for Nuxt3
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  app: {
    head: {
      title: 'Flowapk',
      meta: [
        { name: 'description', content: 'Flowapk - Beautiful and smooth Android app download and discovery platform' },
        { name: 'keywords', content: 'APK, Android, app, download, game, software, mobile, free' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Flowapk Team' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo/logo1.png' }
      ]
    }
  }
})