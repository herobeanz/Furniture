<template>
  <article class="collection-card">
    <RouterLink
      :to="'/bo-suu-tap/' + collection.slug"
      class="collection-card-link"
    >
      <div class="collection-card-image-wrap">
        <OptimizedImage
          :src="collection.thumbnail || COLLECTIONS_FALLBACK_THUMBNAIL"
          :alt="collection.name"
          img-class="collection-card-image"
          :widths="IMAGE_WIDTHS.card"
          :sizes="IMAGE_SIZES.collectionCard"
        />
      </div>
      <div class="collection-card-footer">
        <div>
          <h3 class="collection-card-title">{{ collection.name }}</h3>
          <p class="collection-card-count">{{ productCountLabel }}</p>
        </div>
        <span class="collection-card-arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-right" />
        </span>
      </div>
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { Collection } from "@/services/api/collections";
import OptimizedImage from "@/components/common/OptimizedImage.vue";
import { COLLECTIONS_FALLBACK_THUMBNAIL } from "@/constants/collections-page";
import { IMAGE_SIZES, IMAGE_WIDTHS } from "@/utils/imageUrl";

interface Props {
  collection: Collection;
}

const props = defineProps<Props>();

const productCountLabel = computed(() => {
  const n = props.collection.productCount ?? 0;
  return `${n} sản phẩm`;
});
</script>

<style scoped>
.collection-card {
  background: #fff;
  border: 1px solid var(--color-border-light);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
  height: 100%;
}

.collection-card:hover {
  box-shadow: var(--shadow-md);
}

.collection-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.collection-card-image-wrap {
  height: 13rem;
  overflow: hidden;
  border-radius: 0.375rem;
  background: #f9fafb;
  margin-bottom: 0.75rem;
}

.collection-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.collection-card:hover .collection-card-image {
  transform: scale(1.02);
}

.collection-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 0.25rem;
}

.collection-card-title {
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
  line-height: 1.35;
}

.collection-card-count {
  font-size: var(--fs-body-sm);
  color: var(--color-text-light);
  margin: 0.125rem 0 0;
}

.collection-card-arrow {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.collection-card:hover .collection-card-arrow {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.collection-card-arrow i {
  font-size: var(--fs-caption);
  line-height: 1;
}
</style>
