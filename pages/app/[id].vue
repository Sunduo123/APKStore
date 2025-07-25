<template>
  <div class="app-detail-bg2">
    <div class="app-detail-main">
      <!-- 删除顶部原有app-top-card等旧卡片结构，只保留新版Google Play风格内容 -->
      <!-- 手机端Google Play风格整体详情页，仅!isPC时渲染 -->
      <div v-if="!isPC">
        <!-- 1. 图片+名字+开发商 -->
        <div class="app-header-mobile">
          <img :src="appData.icon" class="app-header-icon" loading="lazy" />
          <div class="app-header-info">
            <div class="app-header-title">{{ appData.name }}</div>
            <div class="app-header-dev">{{ appData.developer }}</div>
          </div>
        </div>
        <!-- 2. 关键信息表格 -->
        <div class="info-table-gp">
          <div class="info-row-gp"><div class="info-label-gp">Installs</div><div class="info-value-gp">{{ appData.downloads }}</div></div>
          <div class="info-row-gp"><div class="info-label-gp">Developer</div><div class="info-value-gp">{{ appData.developer }}</div></div>
          <div class="info-row-gp"><div class="info-label-gp">Category</div><div class="info-value-gp">{{ appData.category }}</div></div>
          <div class="info-row-gp"><div class="info-label-gp">Age Rating</div><div class="info-value-gp">{{ appData.age }}</div></div>
          <div class="info-row-gp"><div class="info-label-gp">Developer Email</div><div class="info-value-gp"><a :href="`mailto:${appData.email || 'support@example.com'}`">{{ appData.email || 'support@example.com' }}</a></div></div>
          <div class="info-row-gp"><div class="info-label-gp">Privacy Policy</div><div class="info-value-gp"><a :href="appData.privacy_url || 'https://example.com/privacy'" target="_blank">{{ appData.privacy_url || 'https://example.com/privacy' }}</a></div></div>
        </div>
        <!-- 3. 截图区 -->
        <div class="screenshot-title-mobile">Screenshots</div>
        <swiper
          :slides-per-view="2.2"
          :space-between="12"
          class="screenshot-swiper-mobile"
        >
          <swiper-slide
            v-for="(img, idx) in appData.screenshots"
            :key="idx"
            class="screenshot-slide-mobile"
          >
            <img
              :src="img"
              class="screenshot-img-mobile"
              loading="lazy"
              @load="onScreenshotLoad($event, idx)"
            />
          </swiper-slide>
        </swiper>
        <!-- 4. 下载按钮 -->
        <div class="download-section-gp">
          <div class="download-title-gp">Download the latest version of {{ appData.name }}</div>
          <a
            class="download-btn-gp"
            :href="appData.download_url"
            download
            target="_blank"
            rel="noopener"
          >
            <span class="download-icon-gp">⬇</span>
            Download latest Apk
          </a>
        </div>
        <!-- 5. 核心功能/优点/缺点/价格 -->
        <div v-if="appData.features && appData.features.length">
          <div v-for="group in appData.features" :key="group.type" class="feature-card-mobile">
            <div class="feature-title-mobile">{{ group.type }}</div>
            <ul>
              <li v-for="item in group.items" :key="item.title">
                <b>{{ item.title }}: </b>{{ item.description }}
              </li>
            </ul>
          </div>
        </div>
        <!-- 6. 推荐应用 -->
        <div class="recommend-list-mobile">
          <div class="recommend-list-title-mobile">Recommended Apps</div>
          <div v-for="item in recommendList.slice(0, 10)" :key="item.id" class="recommend-list-item-mobile" @click="goDetail(item.id)">
            <img :src="item.icon" :alt="item.name" class="recommend-list-icon-mobile" loading="lazy" />
            <div class="recommend-list-info-mobile">
              <div class="recommend-list-name-mobile">{{ item.name }}</div>
              <div class="recommend-list-dev-mobile">{{ item.developer }}</div>
              <div class="recommend-list-rating-mobile">
                <span class="star" v-for="i in 5" :key="i" :class="{ filled: Number(item.rating) >= i }">★</span>
                <span class="score">{{ item.rating }}</span>
              </div>
            </div>
            <button class="recommend-list-btn-mobile" @click.stop="goDetail(item.id)">Get</button>
          </div>
        </div>
        <!-- 7. 你可能喜欢 -->
        <div class="recommend-list-mobile">
          <div class="recommend-list-title-mobile">You may also like</div>
          <div v-for="item in likeList.slice(0, 10)" :key="item.id + '-like'" class="recommend-list-item-mobile" @click="goDetail(item.id)">
            <img :src="item.icon" :alt="item.name" class="recommend-list-icon-mobile" loading="lazy" />
            <div class="recommend-list-info-mobile">
              <div class="recommend-list-name-mobile">{{ item.name }}</div>
              <div class="recommend-list-dev-mobile">{{ item.developer }}</div>
              <div class="recommend-list-rating-mobile">
                <span class="star" v-for="i in 5" :key="i" :class="{ filled: Number(item.rating) >= i }">★</span>
                <span class="score">{{ item.rating }}</span>
              </div>
            </div>
            <button class="recommend-list-btn-mobile" @click.stop="goDetail(item.id)">Get</button>
          </div>
        </div>
        <!-- 8. 免责声明 -->
        <div class="disclaimer-section">
          <div class="disclaimer-title">Disclaimer</div>
          <ol class="disclaimer-list">
            <li>Allofapk does not represent any developer, nor any app or game developer.</li>
            <li>Allofapk provides custom app reviews written by our own reviewers, as well as details such as developer contact, ratings, and screenshots.</li>
            <li>All trademarks, registered trademarks, product names, and company names or logos appearing on the website are the property of their respective owners.</li>
            <li>Allofapk complies with the Digital Millennium Copyright Act (DMCA) and responds to alleged infringement notices in accordance with the DMCA and other applicable laws.</li>
            <li>If you are a developer or copyright owner and wish to remove your information, please contact info@allofapk.com.</li>
            <li>All information on this website strictly complies with all terms and conditions of the <a href="https://policies.google.com/ads" target="_blank">Google Ads Policy</a> and <a href="https://policies.google.com/technologies/ads" target="_blank">Google Malware Policy</a>.</li>
          </ol>
        </div>
      </div>
      <!-- PC端头部卡片 Google Play风格 -->
      <div v-if="isPC">
        <div class="app-header-pc">
          <img :src="appData.icon" class="app-header-icon-pc" loading="lazy" />
          <div class="app-header-info-pc">
            <div class="app-header-title-pc">{{ appData.name }}</div>
            <div class="app-header-dev-pc">{{ appData.developer }}</div>
            <div class="app-header-meta-pc">
              <span class="meta-item-pc"><Icon icon="mdi:star" width="20" height="20" /> {{ appData.rating }}</span>
              <span class="meta-item-pc"><Icon icon="mdi:download" width="20" height="20" /> {{ appData.downloads }}</span>
              <span class="meta-item-pc"><Icon icon="mdi:account" width="20" height="20" /> {{ appData.age }}</span>
              <span class="meta-item-pc"><Icon icon="mdi:folder" width="20" height="20" /> {{ appData.category }}</span>
            </div>
          </div>
        </div>
        <!-- 截图区域：PC端原有实现，手机端Google Play风格 -->
        <div v-if="isPC">
          <swiper
            slides-per-view="auto"
            :space-between="12"
            class="screenshot-swiper2"
            :style="{ height: '400px', alignItems: 'flex-start' }"
          >
            <swiper-slide
              v-for="(img, idx) in appData.screenshots"
              :key="idx"
              :style="getSlideStyle(img)"
            >
              <img
                :src="img"
                class="screenshot-img2"
                loading="lazy"
                @load="onScreenshotLoad($event, idx)"
                :style="getImgStyle(img)"
              />
            </swiper-slide>
          </swiper>
        </div>
        <!-- 手机端Google Play风格截图区 -->
        <div v-else>
          <div class="screenshot-title-mobile">Screenshots</div>
          <swiper
            :slides-per-view="2.2"
            :space-between="12"
            class="screenshot-swiper-mobile"
            centered-slides
          >
            <swiper-slide
              v-for="(img, idx) in appData.screenshots"
              :key="idx"
              class="screenshot-slide-mobile"
            >
              <img
                :src="img"
                class="screenshot-img-mobile"
                loading="lazy"
                @load="onScreenshotLoad($event, idx)"
              />
            </swiper-slide>
          </swiper>
        </div>
        <!-- PC端关键信息区 Google Play风格六宫格 -->
        <div v-if="isPC" class="info-grid-pc">
          <div class="info-card-pc">
            <Icon icon="mdi:download" class="info-icon-pc" />
            <div class="info-main-pc">{{ appData.downloads }}</div>
            <div class="info-label-pc">Installs</div>
          </div>
          <div class="info-card-pc">
            <Icon icon="mdi:account" class="info-icon-pc" />
            <div class="info-main-pc">{{ appData.developer }}</div>
            <div class="info-label-pc">Developer</div>
          </div>
          <div class="info-card-pc">
            <Icon icon="mdi:apps" class="info-icon-pc" />
            <div class="info-main-pc">{{ appData.category }}</div>
            <div class="info-label-pc">Category</div>
          </div>
          <div class="info-card-pc">
            <Icon icon="mdi:star-outline" class="info-icon-pc" />
            <div class="info-main-pc">{{ appData.age }}</div>
            <div class="info-label-pc">Age Rating</div>
          </div>
          <div class="info-card-pc">
            <Icon icon="mdi:email" class="info-icon-pc" />
            <div class="info-main-pc"><a :href="`mailto:${appData.email || 'support@example.com'}`">{{ appData.email || 'support@example.com' }}</a></div>
            <div class="info-label-pc">Developer Email</div>
          </div>
          <div class="info-card-pc">
            <Icon icon="mdi:web" class="info-icon-pc" />
            <div class="info-main-pc"><a :href="appData.privacy_url || 'https://example.com/privacy'" target="_blank">{{ appData.privacy_url || 'https://example.com/privacy' }}</a></div>
            <div class="info-label-pc">Privacy Policy</div>
          </div>
        </div>
        <!-- features分组全部渲染 -->
        <div v-if="appData.features && appData.features.length">
          <div v-for="group in appData.features" :key="group.type" class="section-card">
            <div class="section-title">{{ group.type }}</div>
            <ul class="section-list">
              <li v-for="item in group.items" :key="item.title">
                <b>{{ item.title }}: </b>{{ item.description }}
              </li>
            </ul>
          </div>
        </div>
        <!-- 4. 下载按钮（蓝色大按钮风格） -->
        <div class="download-section-gp">
          <div class="download-title-gp">Download the latest version of {{ appData.name }}</div>
          <a
            class="download-btn-gp"
            :href="appData.download_url"
            download
            target="_blank"
            rel="noopener"
          >
            <span class="download-icon-gp">⬇</span>
            Download latest Apk
          </a>
        </div>
        <!-- 推荐应用 -->
        <div class="recommend-section3">
          <div class="recommend-title3">Recommended Apps</div>
          <div class="recommend-grid">
            <div v-for="item in recommendList.slice(0, 15)" :key="item.id" class="recommend-card3" @click="goDetail(item.id)" style="cursor:pointer;">
              <img :src="item.icon" :alt="item.name" class="recommend-icon3" loading="lazy" />
              <div class="recommend-info3">
                <div class="recommend-name3">{{ item.name }}</div>
                <div class="recommend-dev3">{{ item.developer }}</div>
                <div class="recommend-rating3">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: Number(item.rating) >= i }">★</span>
                  <span class="score">{{ item.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 你可能喜欢 -->
        <div class="recommend-section3">
          <div class="recommend-title3">You may also like</div>
          <div class="recommend-grid">
            <div v-for="item in likeList" :key="item.id + '-like'" class="recommend-card3" @click="goDetail(item.id)" style="cursor:pointer;">
              <img :src="item.icon" :alt="item.name" class="recommend-icon3" loading="lazy" />
              <div class="recommend-info3">
                <div class="recommend-name3">{{ item.name }}</div>
                <div class="recommend-dev3">{{ item.developer }}</div>
                <div class="recommend-rating3">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: Number(item.rating) >= i }">★</span>
                  <span class="score">{{ item.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 免责声明 -->
        <div class="disclaimer-section">
          <div class="disclaimer-title">Disclaimer</div>
          <ol class="disclaimer-list">
            <li>Allofapk does not represent any developer, nor any app or game developer.</li>
            <li>Allofapk provides custom app reviews written by our own reviewers, as well as details such as developer contact, ratings, and screenshots.</li>
            <li>All trademarks, registered trademarks, product names, and company names or logos appearing on the website are the property of their respective owners.</li>
            <li>Allofapk complies with the Digital Millennium Copyright Act (DMCA) and responds to alleged infringement notices in accordance with the DMCA and other applicable laws.</li>
            <li>If you are a developer or copyright owner and wish to remove your information, please contact info@allofapk.com.</li>
            <li>All information on this website strictly complies with all terms and conditions of the <a href="https://policies.google.com/ads" target="_blank">Google Ads Policy</a> and <a href="https://policies.google.com/technologies/ads" target="_blank">Google Malware Policy</a>.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Icon } from '@iconify/vue'
const route = useRoute()
const router = useRouter()
const isPC = ref(true)
const appData = ref<any>({})
const recommendList = ref<any[]>([])
const likeList = ref<any[]>([])
const screenshotInfo = ref<Record<string, {width:number, height:number}>>({})
function onScreenshotLoad(e: Event, idx: number) {
  const img = e.target as HTMLImageElement
  screenshotInfo.value[img.src] = {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
}
function getSlideStyle(img: string) {
  const info = screenshotInfo.value[img]
  const baseH = isPC.value ? 400 : 220
  if (!info) return { width: '200px', height: `${baseH}px`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }
  const ratio = info.width / info.height
  return {
    width: `${Math.round(baseH * ratio)}px`,
    height: `${baseH}px`,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
}
function getImgStyle(img: string) {
  return {
    height: '100%',
    width: 'auto',
    objectFit: 'cover',
    borderRadius: '18px',
    background: '#fff',
    boxShadow: '0 2px 8px 0 rgba(59,130,246,0.08)'
  }
}
const portraitIndexes = computed(() => {
  if (!appData.value.screenshots) return []
  return appData.value.screenshots
    .map((img:string, idx:number) => ({ img, idx }))
    .filter(({ img }) => {
      const info = screenshotInfo.value[img]
      return info && info.height > info.width
    })
    .map(({ idx }) => idx)
})
const hasPortrait = computed(() => portraitIndexes.value.length > 0)
const filteredScreenshots = computed(() => {
  if (!appData.value.screenshots) return []
  if (hasPortrait.value) {
    return appData.value.screenshots.filter((img:string, idx:number) => portraitIndexes.value.includes(idx))
  } else {
    return appData.value.screenshots
  }
})
function goDetail(id: string) {
  router.push(`/app/${id}`)
}
function checkPC() {
  isPC.value = window.innerWidth >= 1024
}
onMounted(async () => {
  checkPC()
  window.addEventListener('resize', checkPC)
  const files = [
    'action','adventure','ai_powerhouse','arcade','art-design','auto-vehicles','beauty','board','books-reference','business','card','casino','casual','comics','communication','dating','education','educational','entertainment','essential_apps','events','finance','food-drink','health-fitness','hot_apps','house-home','libraries-demo','lifestyle','maps-navigation','medical','music-audio','music','news-magazines','parenting','Personalization','photography','productivity','puzzle','racing','role-playing','Shopping','simulation','social','sport','sports','strategy','tools','top_apps','top_downloads','top_free_apps','top_free_games','travel-local','trivia','vibe_pack','video-players-editors','weather','word'
  ]
  let found = false
  for (const file of files) {
    const res = await fetch(`/dataJson/${file}.json`)
    const arr = await res.json()
    const app = arr.find((a:any) => a.id === route.params.id)
    if (app) {
      appData.value = app
      found = true
      // 推荐应用前15
      recommendList.value = arr.filter((a:any) => a.id !== app.id).slice(0, 15)
      // 你可能喜欢后15且不与推荐重复
      const recommendIds = new Set(recommendList.value.map((a:any) => a.id))
      likeList.value = arr.filter((a:any) => a.id !== app.id && !recommendIds.has(a.id)).slice(0, 15)
      break
    }
  }
  if (!found) {
    appData.value = { name: '未找到应用', icon: '/logo/logo2.png', developer: '', rating: 0, screenshots: [], desc: '未找到该应用', features: [], comments: [] }
  }
})
</script>

<style scoped>
.app-detail-bg2 {
  background: #f7fafd;
  min-height: 100vh;
  padding: 0 0 40px 0;
}
.app-detail-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 90px 0 40px 0;
}

.app-top-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(59,130,246,0.08);
  padding: 24px 32px;
  margin-bottom: 18px;
  gap: 24px;
}
.app-top-logo {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  object-fit: cover;
  background: #f6f8fa;
}
.app-top-info {
  flex: 1;
  min-width: 0;
}
.app-top-title {
  font-size: 2rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
}
.app-top-rating {
  font-size: 1.1rem;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 4px;
}
.app-top-rating-num {
  color: #2563eb;
  font-weight: bold;
  margin-left: 6px;
  font-size: 1.1rem;
}
.app-screenshots2 {
  margin-bottom: 18px;
}
.screenshot-swiper2 {
  width: 100%;
  display: flex;
  align-items: flex-start;
  background: #f7fafd;
  border-radius: 18px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
  overflow: hidden;
  margin-bottom: 8px;
  padding: 8px 0;
}
.screenshot-img2 {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
  display: block;
}
.app-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  margin-bottom: 28px;
}
.info-card {
  background: #f7fafd;
  border-radius: 1.3rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.04);
  padding: 32px 10px 22px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 110px;
  text-align: center;
  border: 1.5px solid #e8eef7;
  justify-content: center;
  transition: box-shadow 0.2s;
}
.info-icon {
  font-size: 2.2rem;
  margin-bottom: 16px;
  line-height: 1;
}
.info-icon-blue {
  color: #2563eb;
}
.info-icon-yellow {
  color: #fbbf24;
}
.info-icon-gray {
  color: #888;
}
.info-main {
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 4px;
  word-break: break-all;
  max-width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-main-blue {
  color: #2563eb;
  font-weight: 700;
}
.info-label {
  font-size: 1.02rem;
  color: #888;
  margin-top: 2px;
}
.info-link {
  text-decoration: none;
  color: #2563eb;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 100%;
}
.info-link:hover {
  text-decoration: underline;
}
.section-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  padding: 22px 24px 16px 24px;
  margin-bottom: 18px;
}
.section-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 10px;
}
.section-content {
  color: #333;
  font-size: 1.08rem;
  line-height: 1.7;
}
.section-list {
  padding-left: 0;
  list-style: none;
  color: #444;
  font-size: 1.05rem;
}
.download-section {
  background: #f3f6fa;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  padding: 22px 24px 16px 24px;
  margin-bottom: 18px;
  text-align: center;
}
.download-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 12px;
}
.download-btn2 {
  background: linear-gradient(90deg, #2563eb 0%, #4f8cff 100%);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 999px;
  padding: 16px 48px;
  font-size: 1.15rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 8px;
}
.download-btn2:hover {
  background: #1746a2;
}
.download-history {
  margin-top: 6px;
}
.history-link {
  color: #2563eb;
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
}
.recommend-section3 {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  padding: 22px 24px 16px 24px;
  margin-bottom: 18px;
  margin-top: 24px;
}
.recommend-title3 {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 10px;
}
.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.recommend-card3 {
  background: #f7fafd;
  border-radius: 1rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  padding: 16px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}
.recommend-icon3 {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
  background: #fff;
  margin-bottom: 8px;
}
.recommend-info3 {
  width: 100%;
  min-width: 0;
  text-align: center;
}
.recommend-name3 {
  font-size: 1rem;
  color: #222;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  text-align: center;
  margin: 0 auto 2px auto;
}
.recommend-dev3 {
  font-size: 0.95rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
  text-align: center;
  margin: 0 auto 0 auto;
}
.recommend-rating3 {
  font-size: 0.95rem;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: center;
  margin-top: 2px;
}
.recommend-rating3 .star {
  color: #fbbf24;
  font-size: 1rem;
}
.recommend-rating3 .star.filled {
  color: #fbbf24;
}
.recommend-rating3 .score {
  color: #2563eb;
  font-weight: bold;
  margin-left: 4px;
  font-size: 0.98rem;
}
.recommend-scroll {
  overflow-x: auto;
  display: flex;
  flex-wrap: nowrap;
  gap: 18px;
}
.recommend-card2 {
  min-width: 220px;
  max-width: 220px;
}
.disclaimer-section {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  padding: 22px 24px 16px 24px;
  margin: 32px auto 0 auto;
  max-width: 1200px;
  font-size: 1.02rem;
  color: #444;
}
.disclaimer-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 10px;
}
.disclaimer-list {
  padding-left: 18px;
  margin: 0;
}
.disclaimer-list li {
  margin-bottom: 6px;
  line-height: 1.7;
}
.screenshot-title-mobile {
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  padding: 12px 0 8px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}
.screenshot-swiper-mobile {
  width: 100vw;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 8px;
}
.screenshot-slide-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  width: 126px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
  overflow: hidden;
}
.screenshot-img-mobile {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
  background: #fff;
}
/* Google Play风格手机端美化 */
.app-header-mobile {
  display: flex;
  align-items: flex-start;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  padding: 18px 16px 12px 16px;
  margin: 12px 8px 0 8px;
  gap: 16px;
}
.app-header-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.app-header-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
  background: #f7fafd;
}
.app-header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 2px;
}
.app-header-dev {
  font-size: 0.98rem;
  color: #888;
  margin-bottom: 6px;
}
.app-header-meta {
  display: flex;
  gap: 12px;
  font-size: 0.95rem;
  color: #2563eb;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 2px;
}
.install-btn-mobile {
  width: calc(100vw - 32px);
  margin: 18px 16px 0 16px;
  height: 48px;
  background: #0caf60;
  color: #fff;
  font-size: 1.12rem;
  font-weight: bold;
  border-radius: 999px;
  border: none;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
}
.info-table-gp {
  width: 100%;
  margin: 24px 0 0 0;
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  font-size: 15px;
  overflow: hidden;
}
.info-row-gp {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f4f6fa;
  min-height: 38px;
}
.info-row-gp:last-child {
  border-bottom: none;
}
.info-label-gp {
  width: 120px;
  min-width: 100px;
  color: #666;
  text-align: right;
  font-size: 15px;
  font-weight: 400;
  padding-right: 32px;
  flex-shrink: 0;
  letter-spacing: 0;
  line-height: 1.6;
}
.info-value-gp {
  color: #222;
  text-align: left;
  font-size: 15px;
  font-weight: 400;
  word-break: break-all;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.6;
  padding-left: 0;
}
.info-value-gp a {
  color: #222;
  text-decoration: none;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 180px;
  vertical-align: bottom;
  transition: color 0.2s;
}
.info-value-gp a:hover {
  color: #0caf60;
  text-decoration: underline;
}
.feature-card-mobile {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.04);
  margin: 18px 8px 0 8px;
  padding: 16px 14px 12px 14px;
}
.feature-title-mobile {
  font-size: 1.08rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 8px;
}
/* 手机端推荐应用/你可能喜欢 Google Play风格列表卡片 */
.recommend-list-mobile {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  margin: 22px 8px 0 8px;
  padding: 8px 0 2px 0;
}
.recommend-list-title-mobile {
  font-size: 1.08rem;
  font-weight: bold;
  color: #222;
  padding: 10px 18px 8px 18px;
  border-left: 3px solid #2563eb;
  margin-bottom: 2px;
}
.recommend-list-item-mobile {
  display: flex;
  align-items: center;
  padding: 10px 18px 10px 18px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.18s;
}
.recommend-list-item-mobile:last-child {
  border-bottom: none;
}
.recommend-list-item-mobile:hover {
  background: #f7fafd;
}
.recommend-list-icon-mobile {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  background: #f3f4f6;
  margin-right: 14px;
  flex-shrink: 0;
}
.recommend-list-info-mobile {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.recommend-list-name-mobile {
  font-size: 1.05rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recommend-list-dev-mobile {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 2px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recommend-list-rating-mobile {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 1rem;
}
.recommend-list-rating-mobile .star {
  color: #e5e7eb;
}
.recommend-list-rating-mobile .star.filled {
  color: #fbbf24;
}
.recommend-list-rating-mobile .score {
  font-size: 0.95rem;
  color: #888;
  margin-left: 4px;
}
.recommend-list-btn-mobile {
  margin-left: 12px;
  padding: 0 18px;
  height: 34px;
  background: #fff;
  color: #2563eb;
  font-weight: bold;
  border: 1.5px solid #2563eb;
  border-radius: 999px;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 1px 4px 0 rgba(59,130,246,0.04);
  outline: none;
}
.recommend-list-btn-mobile:active,
.recommend-list-btn-mobile:hover {
  background: #2563eb;
  color: #fff;
}
.download-section-gp {
  text-align: center;
  margin: 28px 0 18px 0;
}
.download-title-gp {
  color: #2563eb;
  font-size: 1.08rem;
  font-weight: bold;
  margin-bottom: 10px;
}
.download-btn-gp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #388bff 0%, #2563eb 100%);
  color: #fff;
  font-size: 1.18rem;
  font-weight: bold;
  border-radius: 999px;
  padding: 0 38px;
  height: 54px;
  min-width: 220px;
  box-shadow: 0 4px 16px 0 rgba(59,130,246,0.13);
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0 auto;
  transition: background 0.18s, color 0.18s;
  text-decoration: none;
}
.download-btn-gp:hover {
  background: linear-gradient(90deg, #2563eb 0%, #388bff 100%);
  color: #fff;
}
.download-icon-gp {
  font-size: 1.4em;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}
/* PC端头部卡片 Google Play风格 */
.app-header-pc {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 24px 0 rgba(59,130,246,0.10);
  padding: 36px 48px 36px 36px;
  margin: 32px auto 32px auto;
  gap: 36px;
  max-width: 900px;
}
.app-header-icon-pc {
  width: 110px;
  height: 110px;
  border-radius: 28px;
  box-shadow: 0 2px 12px 0 rgba(59,130,246,0.10);
  background: #f7fafd;
  object-fit: cover;
}
.app-header-info-pc {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.app-header-title-pc {
  font-size: 2.2rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 4px;
  line-height: 1.1;
  word-break: break-all;
}
.app-header-dev-pc {
  font-size: 1.08rem;
  color: #888;
  margin-bottom: 8px;
}
.app-header-meta-pc {
  display: flex;
  gap: 32px;
  font-size: 1.08rem;
  color: #2563eb;
  align-items: center;
  margin-top: 8px;
}
.meta-item-pc {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.08rem;
  color: #2563eb;
}
.info-grid-pc {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 24px;
  margin: 40px auto 0 auto;
  max-width: 900px;
  margin-bottom: 40px;
}
.info-card-pc {
  background: #EBF1F9;
  border: 1.5px solid #d3e0ef;
  border-radius: 22px;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 10px 18px 10px;
  min-height: 120px;
  text-align: center;
  transition: box-shadow 0.2s;
}
.info-icon-pc {
  font-size: 2.2rem;
  color: #222;
  margin-bottom: 16px;
  line-height: 1;
}
.info-main-pc {
  color: #9180FF;
  font-size: 1.18rem;
  font-weight: bold;
  margin-bottom: 6px;
  word-break: break-all;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-main-pc a {
  color: #9180FF;
  text-decoration: none;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 180px;
  vertical-align: bottom;
  transition: color 0.2s;
}
.info-main-pc a:hover {
  color: #2563eb;
  text-decoration: underline;
}
.info-label-pc {
  color: #888;
  font-size: 1rem;
  margin-top: 2px;
  font-weight: 400;
}
@media (min-width: 768px) {
  .app-header-mobile, .app-header-icon, .app-header-info, .app-header-title, .app-header-dev, .app-header-meta, .meta-item, .install-btn-mobile, .info-table-mobile, .info-row, .info-label, .info-value, .feature-card-mobile, .feature-title-mobile, .screenshot-swiper-mobile, .screenshot-slide-mobile, .screenshot-img-mobile, .screenshot-title-mobile, .recommend-list-mobile, .recommend-list-title-mobile, .recommend-list-item-mobile, .recommend-list-icon-mobile, .recommend-list-info-mobile, .recommend-list-name-mobile, .recommend-list-dev-mobile, .recommend-list-rating-mobile, .recommend-list-btn-mobile {
    display: none !important;
  }
}
@media (max-width: 1024px) {
  .app-detail-main {
    max-width: 100vw;
    padding: 0 2px 24px 2px;
  }
  .app-top-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 8px;
    border-radius: 1.2rem;
    margin-bottom: 10px;
    gap: 10px;
  }
  .app-top-logo {
    width: 56px;
    height: 56px;
    border-radius: 12px;
  }
  .app-top-title {
    font-size: 1.2rem;
  }
  .app-screenshots2 {
    margin-bottom: 10px;
  }
  .screenshot-img2 {
    height: 140px;
    border-radius: 10px;
  }
  .app-info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
  .info-card {
    padding: 16px 6px 10px 6px;
    border-radius: 10px;
    min-height: 60px;
  }
  .info-icon {
    font-size: 1.3rem;
    margin-bottom: 6px;
  }
  .info-main {
    font-size: 1rem;
  }
  .info-label {
    font-size: 0.95rem;
  }
  .section-card {
    padding: 12px 8px 10px 8px;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .download-section {
    padding: 12px 8px 10px 8px;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .recommend-section3 {
    padding: 12px 8px 10px 8px;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .recommend-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .recommend-card3 {
    padding: 8px 4px 6px 4px;
    border-radius: 8px;
  }
  .recommend-icon3 {
    width: 40px;
    height: 40px;
    border-radius: 6px;
  }
  .app-header-pc, .app-header-icon-pc, .app-header-info-pc, .app-header-title-pc, .app-header-dev-pc, .app-header-meta-pc, .meta-item-pc, .info-grid-pc, .info-card-pc, .info-icon-pc, .info-main-pc, .info-label-pc {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .app-top-card {
    flex-direction: row;
    align-items: center;
    padding: 12px 8px;
    border-radius: 1.2rem;
    margin-bottom: 10px;
    gap: 10px;
  }
  .app-top-logo {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    margin-right: 8px;
  }
  .app-top-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .app-top-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 2px;
    line-height: 1.2;
  }
  .app-top-rating {
    font-size: 1rem;
    color: #fbbf24;
    display: flex;
    align-items: center;
    gap: 2px;
    margin-top: 0;
  }
  .app-top-rating-num {
    color: #fbbf24;
    font-weight: bold;
    margin-left: 2px;
    font-size: 1rem;
  }
  .app-top-rating .star {
    color: #fbbf24;
    font-size: 1rem;
    margin-left: 2px;
  }
  .app-info-grid {
    display: table;
    width: 100%;
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 2px 8px 0 rgba(59,130,246,0.06);
    margin-bottom: 18px;
    padding: 0;
    gap: 0;
  }
  .info-card {
    display: table-row;
    background: none;
    box-shadow: none;
    border-radius: 0;
    min-height: 0;
    padding: 0;
    border: none;
    text-align: left;
  }
  .info-icon {
    display: none;
  }
  .info-main,
  .info-label {
    display: table-cell;
    padding: 10px 8px;
    font-size: 1.05rem;
    vertical-align: middle;
    border-bottom: 1px solid #f0f0f0;
  }
  .info-label {
    color: #888;
    font-weight: 500;
    width: 90px;
    min-width: 70px;
    text-align: right;
    background: #f7fafd;
    border-right: 1px solid #f0f0f0;
    border-radius: 0;
  }
  .info-main {
    color: #2563eb;
    font-weight: 600;
    text-align: left;
    background: #fff;
    border-radius: 0;
    word-break: break-all;
    max-width: 99vw;
    white-space: normal;
  }
}
@media (max-width: 767px) {
  .app-detail-main {
    padding-top: 80px !important;
  }
  .screenshot-title-mobile {
    margin-top: 0 !important;
  }
}
</style> 