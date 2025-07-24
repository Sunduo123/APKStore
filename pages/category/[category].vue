<template>
  <div class="category-detail-3col">
    <!-- 返回主页按钮 -->
    <button class="back-home-btn" @click="goHome">
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      返回主页
    </button>
    <!-- PC端 左侧 应用程序类 -->
    <aside class="category-side app-side pc-only">
      <div class="side-title">Application Class</div>
      <div class="category-list">
        <div v-for="cat in appCategoryOrder" :key="cat" :class="['category-item', cat === category ? 'active' : '']" @click="goCategory(cat)">
          <span class="cat-icon">{{ categoryIcons[cat] || '📦' }}</span>
          <span class="cat-name">{{ categoryDisplayMap[cat] || cat }}</span>
        </div>
      </div>
    </aside>
    <!-- 中间内容 -->
    <main class="category-main">
      <div class="app-list">
        <div v-for="item in appList" :key="item.id" class="app-card">
          <img :src="item.icon" :alt="item.name" class="app-icon" loading="lazy" @error="onImgError" />
          <div class="app-info">
            <div class="app-name">{{ item.name }}</div>
            <div class="app-dev">{{ item.developer }}</div>
            <div class="app-rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: Number(item.rating) >= i }">★</span>
              <span class="score">{{ item.rating }}</span>
            </div>
            <button class="get-btn" @click.stop="goDetail(item.id)">Get</button>
          </div>
        </div>
      </div>
    </main>
    <!-- PC端 右侧 游戏类 -->
    <aside class="category-side game-side pc-only">
      <div class="side-title">Games</div>
      <div class="category-list">
        <div v-for="cat in gameCategoryOrder" :key="cat" :class="['category-item', cat === category ? 'active' : '']" @click="goCategory(cat)">
          <span class="cat-icon">{{ categoryIcons[cat] || '📦' }}</span>
          <span class="cat-name">{{ categoryDisplayMap[cat] || cat }}</span>
        </div>
      </div>
    </aside>
    <!-- 移动端底部宫格导航 -->
    <div class="mobile-bottom-category mobile-only">
      <div class="category-block">
        <div class="block-title">🌟 应用类别</div>
        <div class="grid-nav">
          <div v-for="cat in appCategoryOrder" :key="cat" class="grid-item" @click="goCategory(cat)">
            <div class="icon">{{ categoryIcons[cat] || '📦' }}</div>
            <div class="label">{{ categoryDisplayMap[cat] || cat }}</div>
          </div>
        </div>
      </div>
      <div class="category-block">
        <div class="block-title">🌟 游戏类别</div>
        <div class="grid-nav">
          <div v-for="cat in gameCategoryOrder" :key="cat" class="grid-item" @click="goCategory(cat)">
            <div class="icon">{{ categoryIcons[cat] || '📦' }}</div>
            <div class="label">{{ categoryDisplayMap[cat] || cat }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const isMobile = ref(false)
if (typeof window !== 'undefined') {
  isMobile.value = window.innerWidth <= 1024
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 1024
  })
}
const appCategoryOrder = [
  'ai_powerhouse', 'art-design', 'auto-vehicles', 'word', 'video-players-editors', 'business', 'educational', 'essential_apps', 'events', 'finance', 'health-fitness', 'hot_apps', 'house-home', 'music', 'news-magazines', 'photography', 'Shopping', 'social', 'top_downloads', 'top_free_apps'
]
const gameCategoryOrder = [
  'arcade', 'action', 'adventure', 'card', 'casual', 'puzzle', 'racing', 'role-playing', 'simulation', 'sport', 'strategy', 'trivia', 'board', 'top_free_games', 'entertainment', 'comics'
]
const categoryDisplayMap: Record<string, string> = {
  'ai_powerhouse': 'AI应用', 'art-design': '艺术设计', 'auto-vehicles': '汽车交通', 'word': '单词',
  'video-players-editors': '视频编辑', 'business': '商业', 'educational': '教育', 'essential_apps': '必备应用',
  'events': '事件', 'finance': '金融', 'health-fitness': '健康', 'hot_apps': '热门应用', 'house-home': '家居',
  'music': '音乐', 'news-magazines': '新闻杂志', 'photography': '摄影', 'Shopping': '购物', 'social': '社交',
  'top_downloads': '下载排行', 'top_free_apps': '免费应用',
  'arcade': '街机', 'action': '动作', 'adventure': '冒险', 'card': '卡牌', 'casual': '休闲', 'puzzle': '解谜',
  'racing': '赛车', 'role-playing': '角色扮演', 'simulation': '模拟', 'sport': '体育', 'strategy': '策略',
  'trivia': '益智', 'board': '棋盘', 'top_free_games': '免费游戏', 'entertainment': '娱乐', 'comics': '漫画',
}
const categoryIcons: Record<string, string> = {
  'ai_powerhouse': '🤖', 'art-design': '🎨', 'auto-vehicles': '🚗', 'word': '🔤', 'video-players-editors': '🎬',
  'business': '💼', 'educational': '🧑', 'essential_apps': '⭐', 'events': '📅', 'finance': '💰', 'health-fitness': '🏃',
  'hot_apps': '🔥', 'house-home': '🏠', 'music': '🎵', 'news-magazines': '📰', 'photography': '📷', 'Shopping': '🛒',
  'social': '👥', 'top_downloads': '⬇️', 'top_free_apps': '🆓', 'arcade': '🕹️', 'action': '🥊', 'adventure': '🗺️',
  'card': '🃏', 'casual': '🎲', 'puzzle': '🧩', 'racing': '🏎️', 'role-playing': '🧙', 'simulation': '🕹️',
  'sport': '🏀', 'strategy': '♟️', 'trivia': '❓', 'board': '♟️', 'top_free_games': '🆓', 'entertainment': '🎮', 'comics': '📚',
}
const route = useRoute()
const router = useRouter()
const category = computed(() => route.params.category as string)
const displayName = computed(() => categoryDisplayMap[category.value] || category.value)
const appList = ref<any[]>([])

function goCategory(cat: string) {
  router.push({ path: `/category/${cat}` })
}
function goHome() {
  router.push('/')
}
function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = '/logo/logo2.png'
}
function goDetail(id: string) {
  router.push(`/app/${id}`)
}
async function fetchCategoryData() {
  try {
    const res = await fetch(`/dataJson/${category.value}.json`)
    const data = await res.json()
    appList.value = data
  } catch {
    appList.value = []
  }
}
onMounted(() => {
  fetchCategoryData()
})
watch(() => category.value, () => {
  fetchCategoryData()
})
</script>

<style scoped>
.category-detail-3col {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-width: 1700px;
  margin: 0 auto 40px auto;
  padding: 90px 0 0 0;
  min-height: 70vh;
  position: relative;
  background: #f7fafd;
}
.back-home-btn {
  position: absolute;
  left: 0;
  top: -48px;
  background: #f3f4f6;
  color: #2563eb;
  font-weight: bold;
  border-radius: 999px;
  border: none;
  padding: 8px 18px 8px 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  z-index: 10;
}
.back-home-btn:hover {
  background: #2563eb;
  color: #fff;
}
.category-side {
  width: 220px;
  background: #f7fafd;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px 0 rgba(59,130,246,0.06);
  padding: 24px 12px 18px 12px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 500px;
}
/* 左侧 应用程序类 */
.app-side {
  margin-left: 10px;
  margin-top: 5px;
  margin-right: 8px;
  position: sticky;
  left: 0;
}
/* 右侧 游戏类 */
.game-side {
  margin-right: 10px;
  margin-top: 5px;
  margin-left: 8px;
  position: sticky;
  right: 0;
}
.side-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1276b9;
  margin-bottom: 18px;
  text-align: center;
}
.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  background: #f3f4f6;
  transition: background 0.2s, color 0.2s;
}
.category-item.active {
  background: #2563eb;
  color: #fff;
  font-weight: bold;
}
.category-item:hover:not(.active) {
  background: #e0edff;
  color: #2563eb;
}
.cat-icon {
  font-size: 1.2em;
}
.cat-name {
  white-space: nowrap;
}
.category-main {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  margin: 0 0;
  justify-content: center;
}
.app-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: auto;
  justify-content: center;
  margin-bottom: 40px;
  margin-top: 20px;
}
.app-card {
 
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px 0 rgba(59,130,246,0.08);
  padding: 18px 20px;
  min-height: 120px;
  width: 100%;
  width: 500px;
  transition: box-shadow 0.2s;
  position: relative;
}
.app-card:hover {
  box-shadow: 0 6px 24px 0 rgba(59,130,246,0.15);
}
.app-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  background: #f3f4f6;
  margin-right: 18px;
}
.app-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.app-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-dev {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 2px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-rating {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 1rem;
  margin-bottom: 2px;
}
.star {
  color: #e5e7eb;
}
.star.filled {
  color: #fbbf24;
}
.score {
  font-size: 0.95rem;
  color: #888;
  margin-left: 4px;
}
.app-desc {
  display: none;
}
.get-btn {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #2563eb;
  font-weight: bold;
  border: 1.5px solid #2563eb;
  border-radius: 999px;
  padding: 6px 28px;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}
.get-btn:hover {
  background: #2563eb;
  color: #fff;
}
/* 移动端样式 */
/* PC端专用显示 */
.pc-only { display: block; }
.mobile-only { display: none; }
@media (max-width: 1024px) {
  .pc-only { display: none !important; }
  .mobile-only { display: block !important; }
  .category-detail-3col {
    flex-direction: column;
    padding: 0 0 32px 0;
    max-width: 100vw;
    background: #f7fafd;
    min-height: 100vh;
    position: relative;
  }
  .back-home-btn {
    position: sticky;
    top: 0;
    left: 0;
    margin: 0 0 12px 0;
    z-index: 10;
    background: #f3f4f6;
    color: #2563eb;
    font-weight: bold;
    border-radius: 999px;
    border: none;
    padding: 8px 18px 8px 12px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .category-side, .app-side, .game-side {
    display: none !important;
  }
  .category-main {
    margin: 0 0;
    width: 100vw;
    max-width: 100vw;
  }
  .app-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100vw;
    max-width: 100vw;
    padding: 0 8px;
  }
  .app-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 2px 12px 0 rgba(59,130,246,0.08);
    padding: 14px 12px;
    min-height: 90px;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    text-align: left;
    position: relative;
  }
  .app-icon {
    width: 54px;
    height: 54px;
    border-radius: 12px;
    object-fit: cover;
    background: #f3f4f6;
    margin-right: 12px;
    flex-shrink: 0;
  }
  .app-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .app-name {
    font-size: 1.05rem;
    font-weight: 550;
    color: #222;
    margin-bottom: 2px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 50%;
    display: inline-block;
    vertical-align: middle;
  }
  .app-dev {
    max-width: 50%;
    font-size: 0.95rem;
    color: #888;
    margin-bottom: 2px;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .app-rating {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 1rem;
    margin-bottom: 2px;
  }
  .star {
    color: #e5e7eb;
  }
  .star.filled {
    color: #fbbf24;
  }
  .score {
    font-size: 0.95rem;
    color: #888;
    margin-left: 4px;
  }
  .get-btn {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    color: #2563eb;
    font-weight: bold;
    border: 1.5px solid #2563eb;
    border-radius: 999px;
    padding: 4px 22px;
    font-size: 1rem;
    transition: background 0.2s, color 0.2s;
  }
  .get-btn:hover {
    background: #2563eb;
    color: #fff;
  }
  .mobile-bottom-category {
    width: 100vw;
    max-width: 100vw;
    background: #f7fafd;
    padding: 10px 0 24px 0;
  }
  .category-block {
    margin: 0 0 18px 0;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 12px 0 rgba(59,130,246,0.06);
    padding: 12px 8px 18px 8px;
  }
  .block-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #1276b9;
    margin-bottom: 12px;
    text-align: left;
    padding-left: 8px;
  }
  .grid-nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px 0;
    width: 100%;
  }
  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    cursor: pointer;
    border-radius: 12px;
    transition: background 0.2s;
  }
  .grid-item:hover {
    background: #e0edff;
  }
  .icon {
    font-size: 2rem;
    margin-bottom: 2px;
  }
  .label {
    font-size: 0.98rem;
    color: #333;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
  }
}
</style> 