<template>
  <nav v-if="items.length > 0" class="breadcrumb">
    <RouterLink to="/">Trang chủ</RouterLink>
    <template v-for="(item, i) in items" :key="i">
      <span class="sep">/</span>
      <RouterLink :to="item.path">{{ item.name }}</RouterLink>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface BreadcrumbItem {
  name: string
  path: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<style scoped>
.breadcrumb {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}
.breadcrumb .sep {
  margin: 0 0.5rem;
}
.breadcrumb a:hover {
  color: var(--color-primary);
}
</style>
