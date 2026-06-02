<template>
  <div class="collection-page">
    <ProductGridSkeleton v-if="loading" :columns="4" :count="8" />
    <NotFoundView v-else-if="isNotFound" />
    <ErrorState v-else-if="error" :message="error" />

    <template v-else-if="collection">
      <section class="collection-hero">
        <div class="container collection-hero-inner">
          <div class="collection-hero-copy">
            <h1 class="collection-hero-title">{{ collection.name }}</h1>
            <p v-if="heroDescription" class="collection-hero-text">
              {{ heroDescription }}
            </p>
          </div>
          <div v-if="collection.thumbnail" class="collection-hero-visual">
            <img
              :src="resolveMediaUrl(collection.thumbnail)"
              :alt="collection.name"
              class="collection-hero-image"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section class="collection-body">
        <div class="container">
          <CollectionProductsSection :products="products" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductGridSkeleton from '@/components/skeleton/ProductGridSkeleton.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import CollectionProductsSection from '@/components/collection/CollectionProductsSection.vue'
import { useCollectionData } from '@/composables/collection/useCollectionData'
import { collectionPublicDescription } from '@/utils/collectionDescription'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const { collection, products, loading, error, isNotFound } = useCollectionData()

const heroDescription = computed(() =>
  collectionPublicDescription(collection.value?.description),
)
</script>

<style scoped>
.collection-page {
  padding-bottom: 3rem;
}

.collection-hero {
  background: #f5f2eb;
  padding: 2rem 0;
  margin-bottom: 0.5rem;
}

.collection-hero-inner {
  display: grid;
  gap: 1.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .collection-hero-inner {
    grid-template-columns: 1fr 1fr;
  }
}

.collection-hero-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.collection-hero-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  max-width: 36rem;
}

.collection-hero-image {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.collection-body {
  padding: 1rem 0 0;
}
</style>
