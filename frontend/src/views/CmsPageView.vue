<template>
  <div class="cms-page container">
    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <article v-else>
      <h1>{{ page?.title }}</h1>
      <div class="cms-content" v-html="page?.content"></div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/services/api.client'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const page = ref<{ title: string; content: string } | null>(null)
const loading = ref(true)
const error = ref('')

async function fetchPage() {
  if (!slug.value) return
  loading.value = true
  error.value = ''
  try {
    page.value = await apiClient.get(`/cms/page/${slug.value}`) as { title: string; content: string }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Không tìm thấy trang.'
  } finally {
    loading.value = false
  }
}

watch(slug, fetchPage, { immediate: true })
</script>

<style scoped>
.cms-page {
  padding: 2rem 1.5rem;
  max-width: 720px;
  margin: 0 auto;
}
.cms-page h1 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}
.cms-content {
  line-height: 1.7;
}
.cms-content :deep(p) {
  margin-bottom: 0.75rem;
}
.error {
  color: var(--color-primary);
}
</style>
