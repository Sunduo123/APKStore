<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 头部导航已移除，使用全局导航 -->
    <!-- 轮播图模块 -->
     <!-- 头部导航与轮播图之间留有25px间距 -->
    <div :style="(isPC ? 'padding-top:80px;' : 'padding-top:64px;') + ' margin-top:25px;'">
      <div class="container mx-auto px-2 md:px-8 flex justify-center mb-0">
        <div class="w-full">
          <!-- 轮播图自动切换3秒 -->
          <Swiper
            :slides-per-view="1"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            loop
            class="rounded-3xl shadow-lg bg-white"
            @swiper="onSwiper"
            @mouseenter="pauseAutoplay"
            @mouseleave="resumeAutoplay"
          >
            <SwiperSlide v-for="(banner, idx) in banners" :key="idx">
              <div class="flex items-stretch w-full h-[240px] md:h-[400px]">
                <!-- 左侧文字 50% -->
                <div class="flex-[0_0_50%] flex flex-col justify-center p-8 md:p-12 h-full overflow-hidden max-h-full">
                  <div class="text-2xl md:text-3xl font-bold mb-2 truncate">{{ banner.title }}</div>
                  <div class="text-base md:text-lg text-gray-500 overflow-hidden" :class="isPC ? '' : 'text-ellipsis whitespace-pre-line'" style="display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical;">
                    {{ banner.desc }}
                  </div>
                </div>
                <!-- 右侧图片 50%，上下右8px间距，100%填充 -->
                <div class="flex-[0_0_50%] h-full flex items-center justify-center pt-6 pb-6 pr-4 md:pt-4 md:pb-4 md:pr-4">
                  <div class="w-full h-full rounded-2xl shadow overflow-hidden bg-gray-900 cursor-pointer" @click="goBannerDetail(banner.img)">
                    <img :src="banner.img" alt="banner" class="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <!-- 轮播图下方与热门类别之间留有10px间距 -->
      <div style="height:10px;"></div>
    </div>
    <!-- 热门类别模块 -->
    <div class="container mx-auto px-2 md:px-8">
      <div class="py-6 relative group">
        <h2 class="text-xl md:text-2xl font-bold mb-4">热门类别</h2>
        <div class="flex items-center relative w-full">
          <div class="w-full overflow-visible px-0">
            <div
              class="grid gap-4"
              :class="isPC ? 'grid-cols-6' : 'grid-cols-3'"
              :style="showAllCategories ? 'max-height:1000px;transition:max-height 0.4s;' : `max-height:${categoryRows*56+24}px;overflow:hidden;transition:max-height 0.4s;`"
            >
              <div
                v-for="cat in visibleCategories"
                :key="cat"
                class="flex items-center px-4 py-2 rounded-xl font-semibold text-white shadow cursor-pointer transition hover:scale-103 hover:shadow-lg"
                :style="{ background: categoryColors[allCategories.indexOf(cat) % categoryColors.length] }"
                @click="goCategory(cat)"
              >
                <span :class="['text-lg', isPC ? 'mr-2' : 'mx-auto']">{{ categoryIcons[cat] || '📦' }}</span>
                <span v-if="isPC" class="truncate">{{ cat }}</span>
              </div>
            </div>
            <!-- 分割线和展开按钮 -->
            <div v-if="pagedCategories.length > maxShowCount" class="relative mt-4 flex items-center">
              <!-- 分割线，右侧留出按钮宽度 -->
              <div ref="categoryLine" class="flex-1 border-t" :style="`border-color: #e5e7eb; border-top-width: 1.5px; margin-right: 120px;`"></div>
              <!-- 按钮上下 ，位置！！！ -->
              <button
                class="absolute btn-expand"
                style="
                  right: 0;
                  top: 0px;
                  min-width: 120px;
                  height: 40px;
                  border: 1.5px solid #e5e7eb;
                  border-top: none;
                  border-bottom-left-radius: 24px;
                  border-bottom-right-radius: 24px;
                  border-top-left-radius: 0;  
                  border-top-right-radius: 0;
                  background: linear-gradient(180deg, #f0f7ff 0%, #fff 100%);
                  color: #2563eb;
                  font-weight: 700;
                  font-size: 16px;
                  box-shadow: 0 4px 16px 0 rgba(59,130,246,0.10);
                  padding: 0 28px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: background 0.2s, color 0.2s;
                  z-index: 20;
                  box-sizing: border-box;
                "
                @click="showAllCategories = !showAllCategories"
              >
                <span v-if="!showAllCategories">Expand</span>
                <span v-else>Close</span>
                <svg v-if="!showAllCategories" class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                <svg v-else class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 热门应用模块 -->
      <div class="py-6">
        <h2 class="text-xl md:text-2xl font-bold mb-4">热门{{ tab==='app' ? '应用' : '游戏' }}</h2>
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div v-for="i in 12" :key="i" class="rounded-xl bg-gray-200 animate-pulse h-32 md:h-40"></div>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div v-for="item in showList" :key="item.id" class="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center p-4 group" @click="goDetail(item.id)" style="cursor:pointer;">
            <img
              :src="item.icon"
              :alt="item.name"
              class="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover mb-3 group-hover:scale-105 transition"
              loading="lazy"
              @error="onImgError"
            />
            <div class="text-sm md:text-base font-semibold text-gray-900 text-center truncate w-full max-w-[120px] md:max-w-[150px] mb-1">
              {{ item.name }}
            </div>
            <div class="text-xs text-gray-400 text-center truncate w-full max-w-[120px] md:max-w-[150px] mb-2">
              {{ item.developer }}
            </div>
            <div class="flex items-center gap-0.5 mt-auto">
              <template v-for="i in 5">
                <svg v-if="Number(item.rating) >= i" :key="i + '-full'" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg v-else-if="Number(item.rating) >= i - 0.5" :key="i + '-half'" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg v-else :key="i + '-empty'" class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              </template>
              <span class="text-xs text-gray-500 ml-1">{{ item.rating }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 分类轮播模块1：应用程序 -->
      <div class="w-full mt-10">
        <CategorySwiperModule
          :category-list="appCategoryOrder"
          :category-display-map="appCategoryDisplayMap"
          data-prefix="app"
          :isPC="isPC"
          title="APP"
        />
      </div>
      <div style="height:10px;"></div>
      <!-- 分类轮播模块2：游戏 -->
      <div class="w-full">
        <CategorySwiperModule
          :category-list="gameCategoryOrder"
          :category-display-map="gameCategoryDisplayMap"
          data-prefix="game"
          :isPC="isPC"
          title="Games"
        />
      </div>
      
      <!-- 排行榜模块 -->
      <div class="mt-10 flex flex-col md:flex-row gap-8 w-full mb-16">
        <!-- 应用排行榜 --> 
        <div class="flex-1 bg-white rounded-3xl shadow-lg p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">编辑精选应用</h3>
            <a href="#" class="text-blue-500 text-base hover:underline" @click.prevent="goCategory(appCategoryOrder[0])">查看更多 &gt;</a>
          </div>
          <div>
            <div v-for="(item, idx) in appRankList" :key="item.id" class="flex items-center py-4 px-2 rounded-2xl hover:bg-gray-50 transition group mb-2">
              <div class="w-8 text-xl text-gray-400 font-bold text-center">{{ idx + 1 }}</div>
              <img :src="item.icon" @error="onImgError" :alt="item.name" class="w-14 h-14 rounded-2xl object-cover mx-4 shadow-sm" loading="lazy" />
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-lg truncate">{{ item.name }}</div>
                <div class="text-sm text-gray-400 truncate">{{ item.developer }}</div>
                <div class="flex items-center gap-1 mt-1">
                  <span v-for="i in 5" :key="i">
                    <svg v-if="Number(item.rating) >= i" class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                    <svg v-else-if="Number(item.rating) >= i - 0.5" class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                    <svg v-else class="w-4 h-4 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                  </span>
                  <span class="text-sm text-gray-500 ml-2">{{ item.rating }}</span>
                </div>
              </div>
              <button class="ml-5 px-6 h-9 bg-blue-50 text-blue-600 rounded-full font-bold text-base border border-blue-100 hover:bg-blue-100 transition shadow" @click.stop="goDetail(item.id)">得到</button>
            </div>
          </div>
        </div>
        <!-- 游戏排行榜 -->
        <div class="flex-1 bg-white rounded-3xl shadow-lg p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold">编辑精选游戏</h3>
            <a href="#" class="text-blue-500 text-base hover:underline" @click.prevent="goCategory(gameCategoryOrder[0])">查看更多 &gt;</a>
          </div>
          <div>
            <div v-for="(item, idx) in gameRankList" :key="item.id" class="flex items-center py-4 px-2 rounded-2xl hover:bg-gray-50 transition group mb-2">
              <div class="w-8 text-xl text-gray-400 font-bold text-center">{{ idx + 1 }}</div>
              <img :src="item.icon" @error="onImgError" :alt="item.name" class="w-14 h-14 rounded-2xl object-cover mx-4 shadow-sm" loading="lazy" />
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-lg truncate">{{ item.name }}</div>
                <div class="text-sm text-gray-400 truncate">{{ item.developer }}</div>
                <div class="flex items-center gap-1 mt-1">
                  <span v-for="i in 5" :key="i">
                    <svg v-if="Number(item.rating) >= i" class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                    <svg v-else-if="Number(item.rating) >= i - 0.5" class="w-4 h-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                    <svg v-else class="w-4 h-4 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                  </span>
                  <span class="text-sm text-gray-500 ml-2">{{ item.rating }}</span>
                </div>
              </div>
              <button class="ml-5 px-6 h-9 bg-blue-50 text-blue-600 rounded-full font-bold text-base border border-blue-100 hover:bg-blue-100 transition shadow" @click.stop="goDetail(item.id)">得到</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/autoplay';
SwiperCore.use([Autoplay]);
import CategorySwiperModule from '~/components/CategorySwiperModule.vue';
import { useRouter } from 'nuxt/app'
const router = useRouter()
function goDetail(id: string) {
  router.push(`/app/${id}`)
}
function goCategory(cat) {
  router.push(`/category/${cat}`)
}
function goBannerDetail(img: string) {
  const map: Record<string, string> = {
    '/App_img/1.png': '/app/55c5027502ac64f9c0001fa6',
    '/App_img/2.png': '/app/56cbbce9d48401b048003405',
    '/App_img/3.png': '/app/55c527c302ac64f9c0002b18',
    '/games_img/1.png': '/app/66b1f458d72cf61108f8c2c6',
    '/games_img/2.png': '/app/5d0355893ea9832c13e157d2',
    '/games_img/3.png': '/app/64870d70b3ae27253f16c069',
  };
  const url = map[img];
  if (url) router.push(url);
}
const tab = ref<'app'|'game'>('app')
const isPC = ref(true)
const loading = ref(true) 
const appList = ref<any[]>([])
const gameList = ref<any[]>([])
const appRankList = ref<any[]>([])
const gameRankList = ref<any[]>([])

// 分类轮播相关变量
const selectedCategory = ref('dating')
const categoryData = ref<{ [key: string]: any[] }>({})
const categorySwiperRef = ref<any | null>(null)

const swiperModules = [Autoplay]

const showList = computed(() => tab.value === 'app' ? appList.value : gameList.value)

// 分类轮播相关计算属性
const selectedCategories = computed(() => {
  return tab.value === 'app' 
    ? ['dating', 'social', 'communication', 'entertainment', 'music', 'photography']
    : ['action', 'adventure', 'arcade', 'casual', 'puzzle', 'racing']
})

const currentCategoryItems = computed(() => {
  return categoryData.value[selectedCategory.value] || []
})

const categoryPage = ref(0)
const showCatBtn = ref(false)
const showAllCategories = ref(false)
// 计算每行显示数量
const categoryCols = computed(() => isPC.value ? 6 : 3)
const categoryRows = computed(() => isPC.value ? 2 : 3)
const maxShowCount = computed(() => categoryCols.value * categoryRows.value)
const visibleCategories = computed(() => {
  if (showAllCategories.value) return pagedCategories.value
  return pagedCategories.value.slice(0, maxShowCount.value)
})

// 应用和游戏类别固定顺序数组
const appCategoryOrder = [
  'ai_powerhouse', 'art-design', 'auto-vehicles', 'word', 'video-players-editors', 'business', 'educational', 'essential_apps', 'events', 'finance', 'health-fitness', 'hot_apps', 'house-home', 'music', 'news-magazines', 'photography', 'Shopping', 'social', 'top_downloads', 'top_free_apps'
]
const gameCategoryOrder = [
  'arcade', 'action', 'adventure', 'card', 'casual', 'puzzle', 'racing', 'role-playing', 'simulation', 'sport', 'strategy', 'trivia', 'board', 'top_free_games', 'entertainment', 'comics'
]
// 中文名映射
const appCategoryDisplayMap = {
  ai_powerhouse: 'AI应用',
  'art-design': '艺术设计',
  'auto-vehicles': '汽车交通',
  word: '单词',
  'video-players-editors': '视频编辑',
  business: '商业',
  educational: '教育',
  essential_apps: '必备应用',
  events: '事件',
  finance: '金融',
  'health-fitness': '健康',
  hot_apps: '热门应用',
  'house-home': '家居',
  music: '音乐',
  'news-magazines': '新闻杂志',
  photography: '摄影',
  Shopping: '购物',
  social: '社交',
  top_downloads: '下载排行',
  top_free_apps: '免费应用',
};
const gameCategoryDisplayMap = {
  arcade: '街机',
  action: '动作',
  adventure: '冒险',
  card: '卡牌',
  casual: '休闲',
  puzzle: '解谜',
  racing: '赛车',
  'role-playing': '角色扮演',
  simulation: '模拟',
  sport: '体育',
  strategy: '策略',
  trivia: '益智',
  board: '棋盘',
  top_free_games: '免费游戏',
  entertainment: '娱乐',
  comics: '漫画',
};
// 统计所有类别（固定顺序，不再动态统计）
const allCategories = computed(() => {
  return tab.value === 'app' ? appCategoryOrder : gameCategoryOrder
})
// 当前页要展示的类别（全部展示，不分页）
const pagedCategories = computed(() => allCategories.value)

// 移动端支持左右滑动
let startX = 0
function onTouchStart(e: TouchEvent) {
  startX = e.touches?.[0]?.clientX ?? 0
}
function onTouchEnd(e: TouchEvent) {
  const delta = (e.changedTouches?.[0]?.clientX ?? 0) - startX
  if (delta < -50 && (categoryPage.value + 1) * (isPC.value ? 12 : 9) < allCategories.value.length) {
    categoryPage.value++
  } else if (delta > 50 && categoryPage.value > 0) {
    categoryPage.value--
  }
}

const checkPC = () => {
  isPC.value = window.innerWidth >= 1024
}

// 分类规则：文件名包含 game/arcade/action/adventure/card/casino/casual/puzzle/racing/role-playing/simulation/sport/strategy/trivia/board 归为游戏，其余为应用
const gameKeywords = [
  'game', 'arcade', 'action', 'adventure', 'card', 'casino', 'casual', 'puzzle', 'racing', 'role-playing', 'simulation', 'sport', 'strategy', 'trivia', 'board'
]

async function fetchData() {
  loading.value = true
  // 只加载免费热门应用和免费热门游戏
  let apps: any[] = []
  let games: any[] = []
  try {
    const res = await fetch('/dataJson/top_free_apps.json')
    const data = await res.json()
    apps = data.slice(0, 48)
  } catch {}
  try {
    const res = await fetch('/dataJson/top_free_games.json')
    const data = await res.json()
    games = data.slice(0, 48)
  } catch {}
  appList.value = apps
  gameList.value = games
  // 加载排行榜数据
  try {
    const res = await fetch('/dataJson/top_downloads.json')
    const data = await res.json()
    appRankList.value = data.slice(0, 8)
  } catch {}
  try {
    const res = await fetch('/dataJson/top_free_games.json')
    const data = await res.json()
    gameRankList.value = data.slice(0, 8)
  } catch {}
  loading.value = false
}

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = '/logo/logo2.png'
}

// 分类轮播相关函数
function selectCategory(category: string) {
  selectedCategory.value = category
  loadCategoryData(category)
}

function getCategoryDisplayName(category: string): string {
  const displayNames: { [key: string]: string } = {
    dating: '约会交友',
    social: '社交',
    communication: '通讯',
    entertainment: '娱乐',
    music: '音乐',
    photography: '摄影',
    action: '动作',
    adventure: '冒险',
    arcade: '街机',
    casual: '休闲',
    puzzle: '解谜',
    racing: '赛车'
  }
  return displayNames[category] || category
}

function onCategorySwiper(swiper: any) {
  categorySwiperRef.value = swiper
}

function pauseCategoryAutoplay() {
  categorySwiperRef.value?.autoplay?.stop()
}

function resumeCategoryAutoplay() {
  categorySwiperRef.value?.autoplay?.start()
}

async function loadCategoryData(category: string) {
  if (categoryData.value[category]) return
  
  try {
    const res = await fetch(`/dataJson/${category}.json`)
    const data = await res.json()
    categoryData.value[category] = data.slice(0, 20) // 只加载前20个
  } catch (error) {
    console.error(`Failed to load category ${category}:`, error)
    categoryData.value[category] = []
  }
}

const swiperRef = ref<any | null>(null) // SwiperCore 类型已更改
function onSwiper(swiper: any) { // SwiperCore 类型已更改
  swiperRef.value = swiper
}
function pauseAutoplay() {
  swiperRef.value?.autoplay?.stop()
}
function resumeAutoplay() {
  swiperRef.value?.autoplay?.start()
}

onMounted(() => {
  checkPC()
  window.addEventListener('resize', checkPC)
  fetchData()
  // 初始化分类数据
  loadCategoryData(selectedCategory.value)
})

const categoryColors = [
  '#b983ff', '#5f8cff', '#ff6b81', '#feca57', '#54a0ff', '#1dd1a1', '#f368e0', '#00d2d3', '#48dbfb', '#576574', '#222f3e', '#ff9f43', '#00b894', '#fd79a8', '#636e72', '#fdcb6e', '#e17055', '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#fab1a0', '#e17055', '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#fab1a0', '#e17055'
]
const categoryIcons: { [key: string]: string } = {
  // 应用类别
  ai_powerhouse: '🤖',
  'art-design': '🎨',
  'auto-vehicles': '🚗',
  word: '🔤',
  'video-players-editors': '🎬',
  business: '💼',
  educational: '🧑',
  essential_apps: '⭐',
  events: '📅',
  finance: '💰',
  'health-fitness': '🏃',
  hot_apps: '🔥',
  'house-home': '🏠',
  music: '🎵',
  'news-magazines': '📰',
  photography: '📷',
  Shopping: '🛒',
  social: '👥',
  top_downloads: '⬇️',
  top_free_apps: '🆓',
  // 游戏类别
  arcade: '🕹️',
  action: '🥊',
  adventure: '🗺️',
  card: '🃏',
  casual: '🎲',
  puzzle: '🧩',
  racing: '🏎️',
  'role-playing': '🧙',
  simulation: '🕹️',
  sport: '🏀',
  strategy: '♟️',
  trivia: '❓',
  board: '♟️',
  top_free_games: '🆓',
  entertainment: '🎮',
  comics: '📚',
  // 兼容原有中文名
  '人工智能': '🤖', '艺术与设计': '🎨', '汽车与交通': '🚗', '单词/文字': '🔤', '视频播放器与编辑': '🎬', '商业': '💼', '教育工具': '🧑‍🏫', '必备应用': '⭐', '事件/活动': '📅', '金融': '💰', '健康与健身': '🏃', '热门应用': '🔥', '家庭与家居': '🏠', '音乐': '🎵', '新闻杂志': '📰', '摄影': '📷', '购物': '🛒', '社交': '👥', '下载排行': '⬇️', '免费热门应用': '🆓', '街机': '🕹️', '动作': '🥊', '冒险': '🗺️', '卡牌': '🃏', '休闲': '🎲', '解谜': '🧩', '赛车': '🏎️', '角色扮演': '🧙', '模拟': '🕹️', '体育': '🏀', '策略': '♟️', '益智/问答': '❓', '棋盘': '♟️', '免费热门游戏': '🆓', '娱乐': '🎮', '漫画': '📚'
}

const appBanners = [
  {
    title: 'YouTube',
    desc: 'Give creators the flexibility to make videos the way you want, share and find your fans. Create the content you want, the way you want. Quick Start Guide ...',
    img: '/App_img/1.png',
  },
  {
    title: 'TikTok',
    desc: 'Our mission is to ignite creativity and spread the power of joy. TikTok s global headquarters are located in Los Angeles and Singapore, with offices in New York, London, Dublin, Paris, Berlin, Dubai, Jakarta, Seoul, and Tokyo.',
    img: '/App_img/2.png',
  },
  {
    title: 'Instagram',
    desc: 'Is a free social application that allows users to share photos and videos and interact with other users',
    img: '/App_img/3.png',
  },
]
const gameBanners = [
  {
    title: 'Delta Operation ',
    desc: 'Players take on the role of GTI s special operations operators and can choose from different arms such as assault, support, engineering and reconnaissance, and fight in various terrains and modes.',
    img: '/games_img/1.png',
  },
  {
    title: 'Call of Duty: Warzone 2.0',
    desc: 'It is a free-to-play, multiplayer online tactical shooter that is part of the Call of Duty series and is included in Call of Duty: Modern Warfare II (2022) and Call of Duty: Modern Warfare III (2023).',
    img: '/games_img/2.png',
  },
  {
    title: 'Subway Surf',
    desc: 'The player plays a teenager who graffiti on the subway tracks. In order to avoid the pursuit of the police and hounds, he needs to run, jump, slide on the tracks, avoid oncoming trains and various obstacles, and collect gold coins and props at the same time.',
    img: '/games_img/3.png',
  },
]
const banners = computed(() => tab.value === 'app' ? appBanners : gameBanners)

// 在 <script setup> 里需要 defineExpose 暴露 swiperModules

defineExpose({ swiperModules })
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
.btn-expand {
  background: linear-gradient(180deg, #f0f7ff 0%, #fff 100%);
  transition: background 0.2s, color 0.2s;
}
.btn-expand:hover {
  background: linear-gradient(180deg, #e0edff 0%, #f0f7ff 100%);
}
@media (max-width: 768px) {
  .flex-col.md\:flex-row {
    flex-direction: column !important;
  }
}
.swiper {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  display: flex;
  align-items: center;
  background: #fff;
}

.category-swiper {
  padding: 10px 0;
}

.category-swiper .swiper-slide {
  height: auto;
  background: transparent;
}
@media (max-width: 768px) {
  .swiper-slide {
    flex-direction: column;
    padding: 0;
  }
}
</style> 