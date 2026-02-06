<template>
  <div class="cms-page container">
    <ContactView v-if="slug === 'lien-he'" />
    <template v-else>
      <LoadingState v-if="loading" />
      <NotFoundView v-else-if="isNotFound" />
      <ErrorState v-else-if="error" :message="error" />
      <article v-else>
        <h1>{{ page?.title }}</h1>
        <div class="cms-content" v-html="page?.content"></div>
      </article>
    </template>
  </div>
</template>

<script setup lang="ts">
import ContactView from '@/views/ContactView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useCmsPage } from '@/composables/cms/useCmsPage'

// Container component: orchestrates data and logic
const { slug, page, loading, error, isNotFound } = useCmsPage()
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
