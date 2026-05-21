<template>
  <div class="rich-html-content" v-html="resolvedHtml" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatRichContent } from '@/utils/format'

const props = defineProps<{
  html: string
}>()

const resolvedHtml = computed(() => formatRichContent(props.html))
</script>

<style scoped>
.rich-html-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
}

.rich-html-content :deep(p) {
  margin-bottom: 1.25rem;
}

.rich-html-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.rich-html-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.rich-html-content :deep(ul),
.rich-html-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 2rem;
}

.rich-html-content :deep(li) {
  margin-bottom: 0.5rem;
}

.rich-html-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
  margin: 1rem 0;
}

.rich-html-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.25rem;
}

.rich-html-content :deep(th),
.rich-html-content :deep(td) {
  border: 1px solid var(--color-border);
  padding: 0.5rem 0.75rem;
}
</style>
