<template>
  <div class="simple-content-page container">
    <article>
      <h1>{{ page.title }}</h1>
      <p v-for="(paragraph, index) in page.paragraphs" :key="index">
        {{ paragraph }}
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { StaticContentPage } from '@/constants/static-content-pages'

defineProps<{
  page: StaticContentPage
}>()
</script>

<style scoped>
.simple-content-page {
  padding: 2rem 1.5rem;
  max-width: 720px;
  margin: 0 auto;
}

.simple-content-page h1 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.simple-content-page p {
  line-height: 1.7;
  margin-bottom: 0.75rem;
  color: var(--color-text, #333);
}
</style>
