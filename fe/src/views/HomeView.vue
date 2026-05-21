<template>
  <div class="home-page">
    <HeroSection
      :collections="showcaseCollections"
      :products="products"
    />
    <FeaturedCollectionsSection
      :collections="featuredCollections"
      :loading="collectionsLoading"
    />
    <TopProductsSection
      :categories="rootCategories"
      :products="tabProducts"
      :active-tab="activeTab"
      :loading="tabProductsLoading"
      @change-tab="activeTab = $event"
    />
    <ReviewsCarousel :reviews="mockReviews" />
    <BlogSection :posts="blogPosts" :loading="loadingBlogs" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HeroSection from '../components/home/HeroSection.vue'
import FeaturedCollectionsSection from '../components/home/FeaturedCollectionsSection.vue'
import TopProductsSection from '../components/home/TopProductsSection.vue'
import BlogSection from '../components/home/BlogSection.vue'
import ReviewsCarousel, { type Review } from '../components/ReviewsCarousel.vue'
import { useHomeData } from '../composables/home/useHomeData'

const {
  products,
  blogPosts,
  featuredCollections,
  showcaseCollections,
  collectionsLoading,
  loadingBlogs,
  tabProducts,
  tabProductsLoading,
  activeTab,
  rootCategories,
  loadInitialData,
} = useHomeData()

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Nguyễn Minh Tuấn',
    location: 'Hà Nội',
    content:
      'Chất lượng sản phẩm vượt mong đợi. Gỗ đẹp, chắc chắn và tinh tế trong từng chi tiết.',
  },
  {
    id: '2',
    author: 'Trần Thị Mai',
    location: 'Đà Nẵng',
    content: 'Dịch vụ rất chuyên nghiệp, giao hàng nhanh và hỗ trợ lắp đặt tận nơi nhiệt tình.',
  },
  {
    id: '3',
    author: 'Lê Hoàng Nam',
    location: 'TP. Hồ Chí Minh',
    content: 'Không gian nhà tôi đẹp hơn hẳn từ khi dùng nội thất gỗ của Hùng Cường.',
  },
  {
    id: '4',
    author: 'Mạnh Hùng',
    location: 'Ninh Bình',
    content: 'Phục vụ rất nhiệt tình, sản phẩm đúng mô tả. Tôi rất hài lòng.',
  },
  {
    id: '5',
    author: 'Lan Nguyễn',
    location: 'Hà Nội',
    content: 'Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ lâu dài.',
  },
]

onMounted(() => {
  loadInitialData()
})
</script>

<style scoped>
.home-page {
  padding-bottom: 0;
}
</style>
