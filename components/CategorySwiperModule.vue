<template>
  <div class="category-module-container px-8">
    <div v-if="title" class="font-bold text-xl md:text-2xl mb-4 pl-0 pt-6">{{ title }}</div>
    <!-- 类别按钮横向滚动区（无滑动按钮） -->
    <div class="mb-6 flex items-center category-btns-mobile-gap">
      <div
        ref="categoryScrollRef"
        class="flex flex-nowrap overflow-x-auto no-scrollbar w-full max-w-full"
        @wheel.prevent="onWheelScroll"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        style="scroll-behavior: smooth;"
      >
        <button
          v-for="category in categoryList"
          :key="category"
          :class="['px-4 py-2 mx-1 my-2 rounded-full font-semibold whitespace-nowrap transition', selectedCategory === category ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-blue-100']"
          @click="selectCategory(category)"
        >
          {{ categoryDisplayMap[category] || category }}
        </button>
      </div>
    </div>
    <!-- 轮播图 -->
    <div class="relative category-swiper-mobile-gap">
      <Swiper
        :slides-per-view="isPC ? 6 : 3"
        :space-between="20"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :loop="true"
        class="category-swiper"
        @swiper="onCategorySwiper"
        @mouseenter="pauseCategoryAutoplay"
        @mouseleave="resumeCategoryAutoplay"
      >
        <SwiperSlide v-for="item in currentCategoryItems" :key="item.id">
          <div class="category-card group">
            <img
              :src="item.icon"
              :alt="item.name"
              class="category-card-img group-hover:scale-105 transition"
              loading="lazy"
              @error="onImgError"
            />
            <div :class="isPC ? 'category-card-title' : 'category-card-title-mobile'">
              {{ item.name }}
            </div>
            <div :class="isPC ? 'category-card-dev' : 'category-card-dev-mobile'">
              {{ item.developer }}
            </div>
            <div class="flex items-center justify-center gap-0.5 mt-1">
              <template v-for="i in 5">
                <svg v-if="Number(item.rating) >= i" :key="i + '-full'" class="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg v-else-if="Number(item.rating) >= i - 0.5" :key="i + '-half'" class="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg v-else :key="i + '-empty'" class="w-3 h-3 md:w-4 md:h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              </template>
              <span class="text-xs text-gray-500 ml-1">{{ item.rating }}</span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/autoplay'
SwiperCore.use([Autoplay])

const props = defineProps<{
  categoryList: string[],
  categoryDisplayMap: Record<string, string>,
  dataPrefix: string, // "app" 或 "game"，用于区分数据类型
  isPC: boolean,
  title?: string
}>()

const selectedCategory = ref(props.categoryList[0])
const categoryData = ref<Record<string, any[]>>({})
const swiperRef = ref<any | null>(null)
const categoryScrollRef = ref<HTMLDivElement | null>(null)
let touchStartX: number = 0
let touchScrollLeft: number = 0
let isMouseDown: boolean = false
let mouseStartX: number = 0
let mouseScrollLeft: number = 0

const currentCategoryItems = computed(() => {
  return selectedCategory.value
    ? categoryData.value[selectedCategory.value] || []
    : [];
})

function selectCategory(category: string) {
  if (!category) return;
  selectedCategory.value = category;
  loadCategoryData(category);
}

function onCategorySwiper(swiper: any) {
  swiperRef.value = swiper;
}
function pauseCategoryAutoplay() {
  swiperRef.value?.autoplay?.stop();
}
function resumeCategoryAutoplay() {
  swiperRef.value?.autoplay?.start();
}
function onImgError(e: Event) {
  const target = e.target as HTMLImageElement;
  target.src = '/logo/logo2.png';
}

async function loadCategoryData(category: string | undefined) {
  if (!category) return;
  if (categoryData.value[category]) return;
  try {
    const res = await fetch(`/dataJson/${category}.json`);
    const data = await res.json();
    categoryData.value[category] = data.slice(0, 20);
  } catch (error) {
    categoryData.value[category] = [];
  }
}

function onWheelScroll(e: WheelEvent) {
  const el = categoryScrollRef.value
  if (!el) return
  el.scrollLeft += e.deltaY
}
function onTouchStart(e: TouchEvent) {
  const el = categoryScrollRef.value as HTMLDivElement | null
  if (!el) return
  const clientX = e.touches[0]?.clientX
  if (clientX === undefined) return
  touchStartX = clientX
  touchScrollLeft = el.scrollLeft
}
function onTouchMove(e: TouchEvent) {
  const el = categoryScrollRef.value as HTMLDivElement | null
  if (!el) return
  const clientX = e.touches[0]?.clientX
  if (clientX === undefined) return
  const dx = touchStartX - clientX
  el.scrollLeft = touchScrollLeft + dx
}
function onTouchEnd() {}

function onMouseDown(e: MouseEvent) {
  isMouseDown = true
  mouseStartX = e.clientX
  mouseScrollLeft = (categoryScrollRef.value as HTMLDivElement | null)?.scrollLeft || 0
}
function onMouseMove(e: MouseEvent) {
  if (!isMouseDown) return
  const el = categoryScrollRef.value as HTMLDivElement | null
  if (!el) return
  const dx = mouseStartX - e.clientX
  el.scrollLeft = mouseScrollLeft + dx
}
function onMouseUp() {
  isMouseDown = false
}

onMounted(() => {
  if (selectedCategory.value) loadCategoryData(selectedCategory.value);
});
watch(() => selectedCategory.value, (val) => {
  if (val) loadCategoryData(val);
});
</script>

<style scoped>
.category-module-container {
  width: 100%;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(59,130,246,0.08);
  margin-bottom: 0;
}
.category-swiper {
  padding: 10px 0;
}
.category-swiper .swiper-slide {
  height: auto;
  background: transparent;
  display: flex;
  justify-content: center;
}
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
  transition: box-shadow 0.2s;
  width: 192px;
  height: 192px;
  min-width: 192px;
  min-height: 192px;
  max-width: 192px;
  max-height: 192px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 16px 8px 8px 8px;
}
@media (max-width: 1024px) {
  .category-card {
    width: 140px;
    height: 140px;
    min-width: 140px;
    min-height: 140px;
    max-width: 140px;
    max-height: 140px;
    padding: 8px 4px 4px 4px;
  }
  .category-card-title-mobile {
    font-size: 13px;
  }
  .category-card-dev-mobile {
    font-size: 11px;
  }
  .category-btns-mobile-gap {
    margin-bottom: 0.2rem !important; /* 类按钮下方间距减小为8px */
  }
  .category-swiper-mobile-gap {
    margin-top: 0 !important; /* 卡片区域更靠近按钮 */
    margin-bottom: 1rem !important; /* 卡片区域底部留16px间距 */
  }
}
.category-card-img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 8px;
}
.category-card-title {
  font-weight: 600;
  color: #222;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}
.category-card-dev {
  font-size: 12px;
  color: #888;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.category-card-title-mobile {
  font-weight: 600;
  color: #222;
  text-align: center;
  width: 100%;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 6px;
  padding-right: 6px;
}
.category-card-dev-mobile {
  font-size: 12px;
  color: #888;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 6px;
  padding-right: 6px;
}
.category-tab-btn {
  /* 撤销自定义样式，保留空实现或直接删除 */
}
.category-tab-btn.active {
  /* 撤销自定义样式，保留空实现或直接删除 */
}
.category-tab-btn:hover:not(.active) {
  /* 撤销自定义样式，保留空实现或直接删除 */
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style> 