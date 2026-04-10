<template>
  <div class="product-gallery">
    <div class="gallery-main">
      <img v-if="currentImage" :src="currentImage" :alt="productName" />
      <div v-else class="no-image">Ảnh sản phẩm</div>
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
}>()
</script>

<style scoped>
.product-gallery {
  position: sticky;
  top: calc(var(--header-height, 60px) + 1rem);
}
.gallery-main {
  aspect-ratio: 1;
  background: var(--color-bg-alt);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery-main .no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.thumb {
  width: 64px;
  height: 64px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background: var(--color-bg-alt);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb.active,
.thumb:hover {
  border-color: var(--color-primary);
}
</style>
