<template>
  <div class="search-page">
    <h2 class="search-title">“{{ keyword }}” Results</h2>
    <div class="search-result-list">
      <div v-for="item in results" :key="item.id" class="search-result-card">
        <img :src="item.icon" :alt="item.title" class="result-icon" loading="lazy" />
        <div class="result-info">
          <div class="result-title">{{ item.title }}</div>
          <div class="result-desc">{{ item.author }}</div>
          <div class="result-rating">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(item.rating) }">★</span>
            <span class="rating-value">{{ item.rating }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'nuxt/app'

const route = useRoute()
const keyword = computed(() => {
  const q = route.query.q
  return Array.isArray(q) ? q[0] || '' : q || ''
})
// 假数据，实际应从接口获取
const allData = [
  { id: 1, title: 'Sniper 3D Gun', author: 'Fun Games For F...', icon: '/games_img/1.png', rating: 4.8 },
  { id: 2, title: 'Super Cl...', author: 'Lion Studios', icon: '/games_img/2.png', rating: 4.7 },
  { id: 3, title: 'Dress to i...', author: 'DAKI, OOO', icon: '/games_img/3.png', rating: 2.3 },
  // ...更多数据
]
const results = computed(() => {
  if (!keyword.value) return allData
  return allData.filter(item => item.title.toLowerCase().includes(keyword.value.toLowerCase()))
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f7fafd;
  padding: 48px 0 0 0;
}
.search-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  margin: 0 0 32px 0;
  text-align: left;
  padding-left: 8vw;
}
.search-result-list {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 32px 24px;
  justify-content: center;
  grid-template-columns: repeat(3, 1fr);
  overflow-x: hidden;
}
.search-result-card {
  width: 320px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(59,130,246,0.07);
  padding: 16px 18px;
  transition: box-shadow 0.2s;
}
.search-result-card:hover {
  box-shadow: 0 6px 24px 0 rgba(59,130,246,0.13);
}
.result-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin-right: 18px;
  object-fit: cover;
  background: #f3f4f6;
}
.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.result-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-desc {
  font-size: 0.98rem;
  color: #888;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-rating {
  display: flex;
  align-items: center;
  font-size: 1rem;
}
.star {
  color: #e5e7eb;
  font-size: 1.1em;
}
.star.filled {
  color: #fbbf24;
}
.rating-value {
  margin-left: 6px;
  color: #2563eb;
  font-weight: 600;
  font-size: 1.02em;
}
@media (max-width: 1024px) {
  .search-result-list {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 700px) {
  .search-result-list {
    grid-template-columns: 1fr;
  }
  .search-result-card {
    width: 98vw;
    min-width: 0;
    max-width: 99vw;
  }
  .search-title {
    padding-left: 4vw;
  }
}
</style> 