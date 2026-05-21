<template>
  <div class="product-gallery">
    <div class="gallery-main">
      <img v-if="currentImage" :src="currentImage" :alt="productName" />
      <div v-else class="gallery-placeholder">Ảnh sản phẩm</div>
      <button
        v-if="images.length > 1"
        type="button"
        class="gallery-nav gallery-nav--prev"
        aria-label="Ảnh trước"
        @click="$emit('prev')"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>
      <button
        v-if="images.length > 1"
        type="button"
        class="gallery-nav gallery-nav--next"
        aria-label="Ảnh sau"
        @click="$emit('next')"
      >
        <i class="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </div>
    <div v-if="images.length > 1" class="gallery-thumbs">
      <button
        v-for="(img, i) in images"
        :key="i"
        type="button"
        class="thumb"
        :class="{ active: selectedIndex === i }"
        @click="$emit('selectImage', i)"
      >
        <img :src="img" :alt="`${productName} ${i + 1}`" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  images: string[]
  currentImage: string | undefined
  productName: string
  selectedIndex: number
}

defineProps<Props>()

defineEmits<{
  selectImage: [index: number]
  prev: []
  next: []
}>()
</script>

<style scoped>
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.gallery-main {
  position: relative;
  height: 360px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.25rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .gallery-main {
    height: 420px;
  }
}

.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
  font-size: 0.875rem;
  background: var(--color-bg-alt);
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  color: #374151;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: background var(--transition-fast);
}

.gallery-nav:hover {
  background: #fff;
}

.gallery-nav--prev {
  left: 0.75rem;
}

.gallery-nav--next {
  right: 0.75rem;
}

.gallery-nav i {
  font-size: 0.6875rem;
}

.gallery-thumbs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.625rem;
}

.thumb {
  height: 4rem;
  padding: 0;
  border: 1px solid var(--color-border-light);
  border-radius: 0.25rem;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  transition: border-color var(--transition-fast);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb.active,
.thumb:hover {
  border-color: var(--color-primary);
  border-width: 2px;
}

.thumb.active {
  box-shadow: 0 0 0 1px var(--color-primary);
}
</style>
