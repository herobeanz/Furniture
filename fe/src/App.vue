<template>
  <div id="app">
    <MainLayout v-if="!isAdminRoute && !isPreviewRoute">
      <router-view v-slot="{ Component, route }">
        <Transition :name="getTransitionName(route)" mode="out-in">
          <KeepAlive :max="8" :include="publicKeepAliveViews">
            <component :is="Component" />
          </KeepAlive>
        </Transition>
      </router-view>
    </MainLayout>
    <router-view v-else v-slot="{ Component, route }">
      <Transition :name="getTransitionName(route)" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>
    <RouterLoadingSpinner />
    <UiToaster />
  </div>
</template>

<script setup lang="ts">
import { computed, KeepAlive } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { UiToaster } from '@/components/ui'
import RouterLoadingSpinner from '@/components/common/RouterLoadingSpinner.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isPreviewRoute = computed(() => route.path.endsWith('/preview'))

/** Tên component (defineOptions) được giữ state khi điều hướng */
const publicKeepAliveViews = [
  'HomeView',
  'ProductsListView',
  'CategoryView',
  'ProductView',
  'CollectionView',
  'CollectionsListView',
  'SearchView',
  'BlogView',
  'BlogPostView',
]

function getTransitionName(route: any): string {
  // No transition for admin routes
  if (route.path.startsWith('/admin') || route.path.endsWith('/preview')) {
    return ''
  }
  
  // Determine transition direction based on route depth
  const depth = route.path.split('/').filter(Boolean).length
  const prevDepth = route.meta.prevDepth || 0
  
  if (depth > prevDepth) {
    return 'slide-left'
  } else if (depth < prevDepth) {
    return 'slide-right'
  }
  return 'fade'
}
</script>

<style>
#app {
  min-height: 100vh;
}

/* Route Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
