<template>
  <div class="product-gallery">
    <div class="gallery-main">
      <img
        v-if="currentImage"
        :src="mainImageSrc"
        :srcset="mainImageSrcSet"
        sizes="(max-width: 1024px) 100vw, 50vw"
        :alt="productName"
        fetchpriority="high"
        decoding="async"
      />
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
      <span v-if="images.length > 1" class="gallery-counter" aria-live="polite">
        {{ selectedIndex + 1 }} / {{ images.length }}
      </span>
    </div>

    <div v-if="images.length > 1" class="gallery-thumbs-row">
      <button
        v-if="canScrollThumbs"
        type="button"
        class="thumbs-nav thumbs-nav--prev"
        :disabled="thumbOffset === 0"
        aria-label="Xem ảnh nhỏ trước"
        @click="scrollThumbsPrev"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      <div class="gallery-thumbs">
        <button
          v-for="item in visibleThumbs"
          :key="item.index"
          type="button"
          class="thumb"
          :class="{ active: selectedIndex === item.index }"
          @click="$emit('selectImage', item.index)"
        >
          <img
            :src="thumbSrc(item.src)"
            :srcset="thumbSrcSet(item.src)"
            sizes="96px"
            :alt="`${productName} ${item.index + 1}`"
            loading="lazy"
            decoding="async"
          />
        </button>
      </div>

      <button
        v-if="canScrollThumbs"
        type="button"
        class="thumbs-nav thumbs-nav--next"
        :disabled="thumbOffset >= images.length - VISIBLE_THUMBS"
        aria-label="Xem ảnh nhỏ sau"
        @click="scrollThumbsNext"
      >
        <i class="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { optimizeImageUrl } from '@/utils/imageUrl'

const VISIBLE_THUMBS = 4

interface Props {
  images: string[]
  currentImage: string | undefined
  productName: string
  selectedIndex: number
}

const props = defineProps<Props>()

defineEmits<{
  selectImage: [index: number]
  prev: []
  next: []
}>()

const thumbOffset = ref(0)

const canScrollThumbs = computed(() => props.images.length > VISIBLE_THUMBS)

const visibleThumbs = computed(() =>
  props.images
    .slice(thumbOffset.value, thumbOffset.value + VISIBLE_THUMBS)
    .map((src, i) => ({
      src,
      index: thumbOffset.value + i,
    })),
)

const mainImageSrc = computed(() =>
  optimizeImageUrl(props.currentImage, { width: 1200, quality: 'auto' }),
)

const mainImageSrcSet = computed(() => {
  if (!props.currentImage) return ''
  return [640, 960, 1200, 1600]
    .map((width) => `${optimizeImageUrl(props.currentImage, { width, quality: 'auto' })} ${width}w`)
    .join(', ')
})

function thumbSrc(src: string): string {
  return optimizeImageUrl(src, { width: 160, quality: 'auto' })
}

function thumbSrcSet(src: string): string {
  return [120, 160, 240]
    .map((width) => `${optimizeImageUrl(src, { width, quality: 'auto' })} ${width}w`)
    .join(', ')
}

function syncThumbOffset() {
  const total = props.images.length
  if (total <= VISIBLE_THUMBS) {
    thumbOffset.value = 0
    return
  }
  const idx = props.selectedIndex
  if (idx < thumbOffset.value) {
    thumbOffset.value = idx
  } else if (idx >= thumbOffset.value + VISIBLE_THUMBS) {
    thumbOffset.value = idx - VISIBLE_THUMBS + 1
  }
}

watch(() => props.selectedIndex, syncThumbOffset)
watch(() => props.images.length, syncThumbOffset)

function scrollThumbsPrev() {
  thumbOffset.value = Math.max(0, thumbOffset.value - 1)
}

function scrollThumbsNext() {
  const max = Math.max(0, props.images.length - VISIBLE_THUMBS)
  thumbOffset.value = Math.min(max, thumbOffset.value + 1)
}
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
  font-size: var(--fs-body-sm);
  background: var(--color-bg-alt);
}

.gallery-counter {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: var(--fs-body-sm);
  font-weight: 600;
  letter-spacing: 0.02em;
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
  font-size: var(--fs-body-sm);
}

.gallery-thumbs-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gallery-thumbs {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.625rem;
  min-width: 0;
}

.thumbs-nav {
  flex-shrink: 0;
  width: 2rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light);
  border-radius: 0.25rem;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    opacity var(--transition-fast);
}

.thumbs-nav:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.thumbs-nav:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.thumbs-nav i {
  font-size: var(--fs-caption);
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
