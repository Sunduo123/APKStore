<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 头部导航 -->
    <header
      class="w-full z-30 bg-white shadow flex items-center justify-between px-4 md:px-12 h-16 md:h-20"
      :class="{ 'fixed top-0 left-0': isPC, 'sticky top-0': !isPC }"
    >
      <div class="flex items-center">
        <img src="/logo/logo2.png" alt="logo" class="h-10 w-30 md:h-12 md:w-30 mr-2" loading="lazy" />
      </div>
      <div class="flex items-center gap-2 md:gap-4">
        <button
          :class="['tab-btn', tab==='app' ? 'active' : '']"
          @click="tab='app'"
        >应用程序</button>
        <button
          :class="['tab-btn', tab==='game' ? 'active' : '']"
          @click="tab='game'"
        >游戏</button>
      </div>
    </header>
    <div :class="isPC ? 'pt-20' : 'pt-16'">
      <div class="container mx-auto px-2 md:px-8">
        <!-- 热门类别模块 -->
        <div class="py-6 relative group">
          <h2 class="text-xl md:text-2xl font-bold mb-4">热门类别</h2>
          <div class="flex items-center relative w-full">
            <!-- 左按钮 PC端显示 -->
            <button
              v-if="isPC && categoryPage > 0 && allCategories.length > 12"
              @click="categoryPage--"
              class="hidden md:flex items-center justify-center w-12 h-20 border-2 border-blue-400 rounded-lg text-2xl text-blue-500 bg-white absolute left-0 top-1/2 -translate-y-1/2 z-10 group-hover:flex transition"
              style="display: none;"
            >
              <span>&lt;</span>
            </button>
            <!-- 类别卡片区 -->
            <div
              class="w-full overflow-hidden px-0"
              @mouseenter="showCatBtn = true" @mouseleave="showCatBtn = false"
              @touchstart="onTouchStart" @touchend="onTouchEnd"
            >
              <div
                class="grid gap-4"
                :class="isPC ? 'grid-cols-6 grid-rows-2' : 'grid-cols-3 grid-rows-3'"
                style="transition: transform 0.3s;"
              >
                <div
                  v-for="cat in pagedCategories"
                  :key="cat"
                  class="flex items-center px-4 py-2 rounded-xl font-semibold text-white shadow cursor-pointer transition hover:scale-105"
                  :style="{ background: categoryColors[allCategories.indexOf(cat) % categoryColors.length] }"
                >
                  <span class="mr-2 text-lg">{{ categoryIcons[cat] || '📦' }}</span>
                  <span class="truncate">{{ cat }}</span>
                </div>
              </div>
            </div>
            <!-- 右按钮 PC端显示 -->
            <button
              v-if="isPC && (categoryPage + 1) * 12 < allCategories.length"
              @click="categoryPage++"
              class="hidden md:flex items-center justify-center w-12 h-20 border-2 border-blue-400 rounded-lg text-2xl text-blue-500 bg-white absolute right-0 top-1/2 -translate-y-1/2 z-10 group-hover:flex transition"
              style="display: none;"
            >
              <span>&gt;</span>
            </button>
          </div>
        </div>
        <!-- 热门应用模块 -->
        <div class="py-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4">热门{{ tab==='app' ? '应用' : '游戏' }}</h2>
          <div v-if="loading" class="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div v-for="i in 12" :key="i" class="rounded-xl bg-gray-200 animate-pulse h-32 md:h-40"></div>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div v-for="item in showList" :key="item.id" class="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center p-4 group">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const tab = ref<'app'|'game'>('app')
const isPC = ref(true)
const loading = ref(true)
const appList = ref<any[]>([])
const gameList = ref<any[]>([])

const showList = computed(() => tab.value === 'app' ? appList.value : gameList.value)

const categoryPage = ref(0)
const showCatBtn = ref(false)

// 统计所有类别（去重，按出现频率排序）
const allCategories = computed(() => {
  const cats = (tab.value === 'app' ? appList.value : gameList.value).map(i => i.category).filter(Boolean)
  const freq: Record<string, number> = {}
  cats.forEach(c => { freq[c] = (freq[c] || 0) + 1 })
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(i => i[0])
})

// 当前页要展示的类别
const pagedCategories = computed(() => {
  const pageSize = isPC.value ? 12 : 9
  const start = categoryPage.value * pageSize
  return allCategories.value.slice(start, start + pageSize)
})

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
  // 只加载部分热门数据做演示，可扩展
  const appFiles = [
    'top_apps.json', 'hot_apps.json', 'essential_apps.json', 'productivity.json', 'tools.json', 'shopping.json', 'communication.json', 'social.json', 'news-magazines.json', 'finance.json', 'education.json', 'health-fitness.json', 'photography.json', 'music-audio.json', 'video-players-editors.json', 'books-reference.json', 'weather.json', 'maps-navigation.json', 'travel-local.json', 'food-drink.json', 'lifestyle.json', 'personalization.json', 'entertainment.json', 'art-design.json', 'auto-vehicles.json', 'beauty.json', 'business.json', 'medical.json', 'parenting.json', 'productivity.json', 'shopping.json', 'tools.json'
  ]
  const gameFiles = [
    'arcade.json', 'action.json', 'adventure.json', 'card.json', 'casino.json', 'casual.json', 'puzzle.json', 'racing.json', 'role-playing.json', 'simulation.json', 'sport.json', 'strategy.json', 'trivia.json', 'board.json', 'top_free_games.json'
  ]
  // 加载应用
  let apps: any[] = []
  for (const file of appFiles) {
    try {
      const res = await fetch(`/dataJson/${file}`)
      const data = await res.json()
      apps = apps.concat(data.slice(0, 8)) // 每类取前8个
    } catch {}
  }
  // 加载游戏
  let games: any[] = []
  for (const file of gameFiles) {
    try {
      const res = await fetch(`/dataJson/${file}`)
      const data = await res.json()
      games = games.concat(data.slice(0, 8))
    } catch {}
  }
  appList.value = apps.slice(0, 48)
  gameList.value = games.slice(0, 48)
  loading.value = false
}

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = '/logo/logo2.png'
}

onMounted(() => {
  checkPC()
  window.addEventListener('resize', checkPC)
  fetchData()
})

const categoryColors = [
  '#b983ff', '#5f8cff', '#ff6b81', '#feca57', '#54a0ff', '#1dd1a1', '#f368e0', '#00d2d3', '#48dbfb', '#576574', '#222f3e', '#ff9f43', '#00b894', '#fd79a8', '#636e72', '#fdcb6e', '#e17055', '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#fab1a0', '#e17055', '#00b894', '#00cec9', '#0984e3', '#6c5ce7', '#fab1a0', '#e17055'
]
const categoryIcons = {
  '金融': '💰', '健康与健身': '🏃', '餐饮': '🍔', '生活方式': '🏡', '购物': '🛒', '运动的': '🏅', '社会的': '👥', '商业': '💼', '生产率': '⚙️', '视频播放器和编辑器': '🎬', '娱乐': '🎮', '教育': '📚', '音乐': '🎵', '摄影': '📷', '新闻': '📰', '艺术与设计': '🎨', '工具': '🛠️', '地图与导航': '🗺️', '天气': '☀️', '书籍与参考': '📖', '个性化': '✨', '通讯': '💬', '医疗': '🏥', '母婴': '👶', '约会': '💑', '卡牌': '🃏', '棋盘': '♟️', '冒险': '🗺️', '解谜': '🧩', '策略': '♟️', '模拟': '🕹️', '赛车': '🏎️', '动作': '🥊', '角色扮演': '🧙', '休闲': '🎲', '博彩': '🎰', '体育': '🏀', '益智': '🧠', '家庭': '🏠', '美妆': '💄', '美食': '🍲', '旅行与本地': '✈️', '事件': '📅', '漫画': '📚', '图书馆与演示': '🏛️', '房屋与家居': '🏠', '父母': '👨‍👩‍👧', '参考': '📖', '社交': '👫', '人工智能': '🤖', '必备应用': '⭐', '热榜': '🔥', '顶级应用': '🏆', '顶级下载': '⬇️', '免费应用': '🆓', '免费游戏': '🆓', '热门': '🔥'
}
</script>

<style scoped>
.tab-btn {
  @apply px-4 py-1 md:px-6 md:py-2 rounded-full font-semibold text-gray-600 bg-gray-100 hover:bg-blue-100 transition;
}
.tab-btn.active {
  @apply bg-blue-600 text-white shadow;
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
</style> 