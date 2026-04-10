<template>
  <div class="home-page">
    <HeroSection :rooms="rooms" :products="products" />
    <ValuePropsSection />
    <FlashSaleSection
      :products="flashProducts"
      :loading="loading"
    />
    <!-- <CategoriesSection :categories="allDeptCategories" :products="products" /> -->
    <!-- <SaleBannerSection /> -->
    <TopProductsSection
      :categories="rootCategories"
      :products="tabProducts"
      :active-tab="activeTab"
      :loading="tabProductsLoading"
      @change-tab="activeTab = $event"
    />
    <ReviewsCarousel :reviews="mockReviews" />
    <BlogSection
      :posts="blogPosts"
      :loading="loadingBlogs"
      @go-to-post="goToBlogPost"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroSection from '../components/home/HeroSection.vue'
import ValuePropsSection from '../components/home/ValuePropsSection.vue'
import FlashSaleSection from '../components/home/FlashSaleSection.vue'
import CategoriesSection from '../components/home/CategoriesSection.vue'
import SaleBannerSection from '../components/home/SaleBannerSection.vue'
import TopProductsSection from '../components/home/TopProductsSection.vue'
import BlogSection from '../components/home/BlogSection.vue'
import ReviewsCarousel from '../components/ReviewsCarousel.vue'
import { useHomeData } from '../composables/home/useHomeData'

const router = useRouter()

// Composables
const {
  rooms,
  products,
  allDeptCategories,
  blogPosts,
  loading,
  loadingBlogs,
  tabProducts,
  tabProductsLoading,
  activeTab,
  rootCategories,
  flashProducts,
  loadInitialData,
} = useHomeData()

// Mock data
const mockReviews = [
  {
    text: 'Phục vụ rất nhiệt tình, sản phẩm đúng mô tả. Tôi rất hài lòng.',
    name: 'Mạnh Hùng',
    location: 'Ninh Bình',
  },
  {
    text: 'Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ lâu dài.',
    name: 'Lan Nguyễn',
    location: 'Hà Nội',
  },
  {
    text: 'Chất lượng tốt, giá hợp lý. Recommend cho mọi người.',
    name: 'Công Minh',
    location: 'Hải Phòng',
  },
  {
    text: 'Sản phẩm đẹp, chất lượng cao. Đúng như hình ảnh.',
    name: 'Nguyễn Mai Hương',
    location: 'Thái Bình',
  },
  {
    text: 'Dịch vụ chăm sóc khách hàng tuyệt vời. Cảm ơn shop!',
    name: 'Tuấn Vũ',
    location: 'Hòa Bình',
  },
]

function goToBlogPost(slug: string) {
  router.push(`/blog/${slug}`)
}

onMounted(() => {
  loadInitialData()
})
</script>

<style scoped>
.home-page {
  padding-bottom: 0;
}

@media (max-width: 768px) {
  .home-page {
    padding-bottom: 0;
  }
}
</style>
