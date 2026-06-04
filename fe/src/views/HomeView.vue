<template>
  <div class="home-page">
    <HeroSection />
    <FeaturedCollectionsSection
      :collections="featuredCollections"
      :loading="collectionsLoading"
    />
    <TopProductsSection
      :products="topProducts"
      :loading="topProductsLoading"
    />
    <ReviewsCarousel :reviews="homeReviews" />
    <BlogSection :posts="blogPosts" :loading="loadingBlogs" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HeroSection from '../components/home/HeroSection.vue'
import FeaturedCollectionsSection from '../components/home/FeaturedCollectionsSection.vue'
import TopProductsSection from '../components/home/TopProductsSection.vue'
import BlogSection from '../components/home/BlogSection.vue'
import ReviewsCarousel from '../components/ReviewsCarousel.vue'
import { HOME_REVIEWS } from '../constants/home-reviews'
import { useHomeData } from '../composables/home/useHomeData'

const {
  blogPosts,
  featuredCollections,
  collectionsLoading,
  loadingBlogs,
  topProducts,
  topProductsLoading,
  loadInitialData,
} = useHomeData()

const homeReviews = HOME_REVIEWS

onMounted(() => {
  loadInitialData()
})
</script>

<style scoped>
.home-page {
  padding-bottom: 0;
}
</style>
