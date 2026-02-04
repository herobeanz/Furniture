<template>
  <div id="app">
    <DefaultLayout v-if="!isAdminRoute">
      <router-view />
    </DefaultLayout>
    <router-view v-else />
    <UiToaster />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { UiToaster } from '@/components/ui'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
