<template>
  <div>
    <!-- 全局头部导航 -->
    <header
      class="w-full z-50 bg-white shadow flex items-center justify-between px-4 md:px-12 h-16 md:h-20 fixed top-0 left-0"
    >
      <div class="flex items-center">
        <img src="/logo/logo2.png" alt="logo" class="h-10 w-30 md:h-12 md:w-30 mr-2" loading="lazy" />
        <button v-if="showHomeBtn" class="home-btn ml-5" @click="goHome" title="返回主页">
          <span class="icon-wrap">
            <svg class="w-6 h-6 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"/></svg>
          </span>
          <span class="home-text">Home</span>
        </button>
      </div>
      <div class="flex items-center gap-2 md:gap-4">
        <button class="search-btn mr-2" @click="goSearch" title="搜索">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round"/></svg>
        </button>
        <button
          :class="['tab-btn', tab==='app' ? 'active' : '']"
          @click="goTab('app')"
        >APP</button>
        <button
          :class="['tab-btn', tab==='game' ? 'active' : '']"
          @click="goTab('game')"
        >Games</button>
      </div>
    </header>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <button v-show="showBackTop" class="back-to-top-btn" @click="scrollToTop" title="返回顶部">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
    </button>
    <footer class="footer bg-gray-50 pt-12 pb-8">
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-row items-center justify-center mb-6">
          <img src="/logo/logo2.png" alt="logo" class="h-21 w-32 mr-4" loading="lazy" />
          <!-- <span class="text-3xl font-bold text-blue-600 tracking-widest" style="letter-spacing:2px;">ALLOFAPK</span> -->
        </div>
        <div class="flex flex-row gap-8 text-base text-gray-700">
          <NuxtLink to="/disclaimer" class="hover:underline">免责声明</NuxtLink>
          <NuxtLink to="/about" class="hover:underline">关于我们</NuxtLink>
          <NuxtLink to="/terms" class="hover:underline">使用条款</NuxtLink>
          <NuxtLink to="/privacy" class="hover:underline">隐私政策</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted, computed } from 'vue'
import { useHead, useRoute, useRouter } from 'nuxt/app'
const tab = ref<'app'|'game'>('app')
const isPC = ref(true)
function setTab(val: 'app'|'game') {
  tab.value = val
}
function goTab(val: 'app'|'game') {
  setTab(val)
  if (val === 'app') {
    router.push('/category/ai_powerhouse')
  } else {
    router.push('/category/arcade')
  }
}
provide('tab', tab)
provide('setTab', setTab)
provide('isPC', isPC)
const route = useRoute()
const router = useRouter()
const showHomeBtn = computed(() => route.path !== '/')
function goHome() {
  router.push('/')
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const showBackTop = ref(false)
function handleScroll() {
  showBackTop.value = window.scrollY > 200
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
function goSearch() {
  router.push('/search')
}
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
.tab-btn {
  @apply px-4 py-1 md:px-6 md:py-2 rounded-full font-semibold text-gray-600 bg-gray-100 hover:bg-blue-100 transition;
}
.tab-btn.active {
  @apply bg-blue-600 text-white shadow;
}
header.fixed, header.sticky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
}
header.fixed {
  position: fixed;
  top: 0;
  left: 0;
}
header.sticky {
  position: sticky;
  top: 0;
}
.home-btn {
  margin-left: 20px;
  background: #f3f4f6;
  border: none;
  padding: 6px 18px 6px 14px;
  cursor: pointer;
  color: #2563eb;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
}
.home-btn:hover {
  background: #2563eb;
  color: #fff;
}
.icon-wrap {
  display: flex;
  align-items: center;
  margin-right: 2px;
}
.home-text {
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.footer {
  width: 100%;
  background: #FFFFFF;
  border-top: 1px solid #e7e7e7;
  margin-top: 50px;
}
.footer a, .footer .router-link-active {
  color: #222;
  text-decoration: none;
  transition: color 0.2s;
}
.footer a:hover, .footer .router-link-active:hover {
  color: #2563eb;
  text-decoration: underline;
}
.back-to-top-btn {
  position: fixed;
  right: 36px;
  bottom: 48px;
  z-index: 100;
  width: 52px;
  height: 52px;
  background: #2563ebcc;
  color: #fff;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 16px 0 rgba(59,130,246,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, opacity 0.2s;
  opacity: 0.7;
}
.back-to-top-btn:hover {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 8px 24px 0 rgba(59,130,246,0.18);
  opacity: 1;
}
.search-btn {
  background: none;
  border: none;
  padding: 0 6px 0 0;
  margin-right: 10px;
  color: #2563eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.search-btn:hover {
  color: #1d4ed8;
}
@media (max-width: 1024px) {
  .header-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin: 0 auto;
    padding: 0 0 8px 0;
  }
  .tab-btn {
    font-size: 0.92rem;
    font-weight: bold;
    border-radius: 999px;
    padding: 4px 10px;
    background: #f3f4f6;
    color: #2563eb;
    border: none;
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
    outline: none;
    min-width: 44px;
    max-width: 80px;
    white-space: nowrap;
  }
  .tab-btn.active, .tab-btn:active {
    background: #2563eb;
    color: #fff;
    box-shadow: 0 4px 16px 0 rgba(59,130,246,0.12);
  }
  .home-btn {
    background: #fff;
    border-radius: 999px;
    padding: 4px 10px;
    margin-right: 0;
    box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
    display: flex;
    align-items: center;
    color: #2563eb;
    font-weight: bold;
    font-size: 0.92rem;
    border: none;
    transition: background 0.2s, color 0.2s;
    min-width: 36px;
    max-width: 44px;
    justify-content: center;
  }
  .home-btn .home-text {
    display: none;
  }
  .home-btn:active, .home-btn.active {
    background: #2563eb;
    color: #fff;
  }
  .header-logo {
    height: 24px;
    margin-right: 4px;
  }
}
@media (min-width: 1025px) {
  .home-btn .home-text {
    display: inline;
  }
}
</style>
  