<template>
  <div class="search-page">
    <div class="search-bar-wrap">
      <input
        v-model="searchInput"
        @keyup.enter="doSearch"
        class="search-bar"
        type="text"
        :placeholder="'Search for apps or games'"
        autofocus
      />
      <button class="search-btn2" @click="doSearch" title="搜索">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round"/></svg>
      </button>
    </div>
    <h2 class="search-title">Search results for “{{ keyword }}”</h2>
    <div v-if="!keyword">
      <div class="search-empty-tip">
        <span class="tip-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"/>
            <line x1="18" y1="18" x2="15.2" y2="15.2"/>
          </svg>
        </span>
        <div class="tip-text">Enter a keyword to discover apps or games you may like</div>
      </div>
    </div>
    <div v-else-if="results.length > 0" class="search-result-list">
      <div
        v-for="item in results"
        :key="item.id"
        class="search-result-card"
        @click="goDetail(item.id)"
        tabindex="0"
      >
        <img :src="item.icon" :alt="item.title" class="result-icon" loading="lazy" @error="onImgError" />
        <div class="result-info">
          <div class="result-title card-text-row">{{ item.title }}</div>
          <div class="result-desc card-text-row">{{ item.author }}</div>
          <div class="result-rating">
            <template v-for="n in 5">
              <svg v-if="Number(item.rating) >= n" :key="item.id + '-' + n + '-full'" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              <svg v-else :key="item.id + '-' + n + '-empty'" class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            </template>
            <span class="rating-value">{{ item.rating }}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="results.length > 0">
        <!-- 卡片列表内容 -->
      </div>
      <div v-else class="empty-result">No apps or games found</div>
      <div style="height:50px;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'

const route = useRoute()
const router = useRouter()
const searchInput = ref('')
const keyword = computed(() => {
  const q = route.query.q
  return Array.isArray(q) ? q[0] || '' : q || ''
})
searchInput.value = keyword.value

// 主页热门类别分类名
const appCategoryOrder = [
  'ai_powerhouse', 'art-design', 'auto-vehicles', 'word', 'video-players-editors', 'business', 'educational', 'essential_apps', 'events', 'finance', 'health-fitness', 'hot_apps', 'house-home', 'music', 'news-magazines', 'photography', 'Shopping', 'social', 'top_downloads', 'top_free_apps'
]
const gameCategoryOrder = [
  'arcade', 'action', 'adventure', 'card', 'casual', 'puzzle', 'racing', 'role-playing', 'simulation', 'sport', 'strategy', 'trivia', 'board', 'top_free_games', 'entertainment', 'comics'
]

const allData = ref<any[]>([])
const loadingAll = ref(true)

onMounted(async () => {
  loadingAll.value = true
  const allCats = [...appCategoryOrder, ...gameCategoryOrder]
  const all = await Promise.all(
    allCats.map(cat => fetch(`/dataJson/${cat}.json`).then(res => res.json()).catch(() => []))
  )
  // 统一字段名，兼容不同json结构
  allData.value = all.flat().map(item => ({
    id: item.id || item._id || item.pkgName || item.packageName || item.name || Math.random().toString(36).slice(2),
    title: item.name || item.title || '',
    author: item.developer || item.author || item.publisher || '',
    icon: item.icon || item.img || item.logo || '',
    rating: item.rating || item.score || item.stars || 0
  }))
  loadingAll.value = false
})

const results = computed(() => {
  if (!keyword.value) return allData.value
  return allData.value.filter(item => item.title && item.title.toLowerCase().includes(keyword.value.toLowerCase()))
})

function doSearch() {
  if (searchInput.value.trim() === keyword.value) return
  router.push({ path: '/search', query: { q: searchInput.value.trim() } })
}
function goDetail(id: string|number) {
  router.push(`/app/${id}`)
}
function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = '/logo/logo2.png'
}
// 监听路由变化，自动更新输入框
watch(keyword, (val) => {
  searchInput.value = val
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f7fafd;
  padding: 150px 0 0 0;
}
.search-bar-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 32px auto;
  width: 100%;
  max-width: 600px;
  position: relative;
  gap: 0 8px;
}
.search-bar {
  width: 100%;
  height: 43px;
  border-radius: 21px;
  border: none;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(59,130,246,0.10);
  padding: 0 60px 0 22px;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s;
}
.search-bar:focus {
  box-shadow: 0 4px 24px 0 rgba(59,130,246,0.18);
}
.search-btn2 {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 18px;
  width: 60px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
  transition: background 0.2s;
}
.search-btn2:hover {
  background: #1d4ed8;
}
.search-btn2 svg {
  width: 16px;
  height: 16px;
}
.search-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #222e3a;
  margin: 0 0 24px 0;
  text-align: left;
  padding-left: 8vw;
  position: relative;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0,0,0,0.06);
}
.search-result-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 28px 18px;
  justify-content: center;
  grid-template-columns: repeat(5, 1fr);
  overflow-x: hidden;
}
.search-result-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(59,130,246,0.07);
  padding: 18px 10px 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  min-width: 0;
  max-width: 180px;
  width: 100%;
  outline: none;
}
.search-result-card:hover, .search-result-card:focus {
  box-shadow: 0 6px 24px 0 rgba(59,130,246,0.13);
  transform: translateY(-2px) scale(1.03);
}
.result-icon {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  margin-bottom: 10px;
  object-fit: cover;
  background: #f3f4f6;
}
.result-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.result-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}
.result-desc {
  font-size: 0.98rem;
  color: #888;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}
.result-rating {
  display: flex;
  align-items: center;
  font-size: 1rem;
  justify-content: center;
}
.rating-value {
  margin-left: 6px;
  color: #2563eb;
  font-weight: 600;
  font-size: 1.02em;
}
.empty-result {
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin-top: 60px;
}
.result-title.card-text-row, .result-desc.card-text-row {
  max-width: 70%;
  width: 70%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
}
@media (max-width: 1200px) {
  .search-result-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 900px) {
  .search-result-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 700px) {
  .search-result-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px 6px;
    justify-items: center;
    padding: 0 8px;
  }
  .search-title {
    padding-left: 4vw;
    font-size: 1.1rem;
  }
  .search-result-card {
    padding: 10px 6px 8px 6px;
    max-width: 110px;
    width: 100%;
    justify-self: center;
  }
  .result-icon {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    margin-bottom: 6px;
  }
  .result-title {
    font-size: 0.8rem;
  }
  .result-desc {
    font-size: 0.7rem;
  }
  .result-rating {
    font-size: 0.8rem;
  }
  .result-rating svg {
    width: 12px;
    height: 12px;
  }
}
@media (max-width: 500px) {
  .search-result-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 4px;
    justify-items: center;
    padding: 0 12px;
  }
  .search-bar-wrap {
    max-width: 98vw;
    padding: 0 2vw;
  }
  .search-result-card {
    padding: 8px 4px 6px 4px;
    max-width: 110px;
    width: 100%;
    justify-self: center;
  }
  .result-icon {
    width: 36px;
    height: 36px;
    border-radius: 3px;
    margin-bottom: 5px;
  }
  .result-title {
    font-size: 0.75rem;
  }
  .result-desc {
    font-size: 0.65rem;
  }
  .result-rating {
    font-size: 0.7rem;
  }
  .result-rating svg {
    width: 10px;
    height: 10px;
  }
}
/* 新增美观提示样式 */
.search-empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 60px 0 80px 0;
  color: #2563eb;
  font-size: 1.18rem;
  min-height: 180px;
  position: relative;
  z-index: 10;
  background: none;
  border-radius: 20px;
  padding: 0 32px;
  border: none;
}
.tip-icon {
  margin-bottom: 18px;
  display: block;
  background: #f2f4f8;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tip-icon svg {
  width: 32px;
  height: 32px;
  color: #2563eb;
  display: block;
}
.tip-text {
  color: #3b5bdb;
  font-weight: 700;
  font-size: 1.13rem;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(59,130,246,0.06);
  margin-top: 2px;
}
@media (max-width: 768px) {
  .search-page {
    padding: 90px 0 0 0;
  }
  .search-bar {
    height: 38px;
    font-size: 0.95rem;
    padding: 0 54px 0 18px;
  }
  .search-btn2 {
    width: 48px;
    height: 28px;
  }
  .search-btn2 svg {
    width: 14px;
    height: 14px;
  }
}
@media (max-width: 480px) {
  .search-page {
    padding: 95px 0 0 0;
  }
  .search-bar {
    height: 36px;
    font-size: 0.9rem;
    padding: 0 46px 1px 12px;
  }
  .search-btn2 {
    width: 50px;
    height: 30px;
    right: 12px;

  }
  .search-btn2 svg {
    width: 15px;
    height: 15px;
  }
}
@media (max-width: 700px) {
  .search-empty-tip {
    padding: 0 12vw;
    font-size: 1rem;
  }
  .tip-icon {
    width: 38px;
    height: 38px;
  }
  .tip-icon svg {
    width: 22px;
    height: 22px;
  }
}
@media (max-width: 480px) {
  .search-empty-tip {
    padding: 0 6vw;
    font-size: 0.98rem;
  }
  .tip-icon {
    width: 30px;
    height: 30px;
  }
  .tip-icon svg {
    width: 16px;
    height: 16px;
  }
}
@media (max-width: 600px) {
  .search-bar:focus {
    font-size: inherit;
  }
}
</style> 