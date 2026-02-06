<template>
  <div id="app">
    <MainLayout v-if="!isAdminRoute && !isPreviewRoute">
      <router-view />
    </MainLayout>
    <router-view v-else />
    <UiToaster />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { UiToaster } from '@/components/ui'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isPreviewRoute = computed(() => route.path.endsWith('/preview'))
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
