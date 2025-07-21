<template>
    <div>
      <NuxtRouteAnnouncer />
      <NuxtPage />
      <footer class="footer">
        © 2024 APKStore |
        <NuxtLink to="/privacy">隐私政策</NuxtLink> |
        <NuxtLink to="/terms">用户协议</NuxtLink>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useHead } from 'nuxt/app'
  useHead({
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
  })
  </script>
  
  <style scoped>
  .footer {
    text-align: center;
    color: #888;
    padding: 20px 0;
    border-top: 1px solid #eee;
    margin-top: 40px;
  }
  </style>
  