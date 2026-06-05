<template>
  <img
    v-if="resolvedSrc"
    :src="resolvedSrc"
    :srcset="srcSet || undefined"
    :sizes="srcSet ? sizes : undefined"
    :alt="alt"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchPriority"
    :class="imgClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveMediaUrl } from '@/utils/mediaUrl'
import {
  buildResponsiveSrcSet,
  optimizeImageUrl,
} from '@/utils/imageUrl'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt: string
    width?: number
    widths?: readonly number[]
    sizes?: string
    loading?: 'lazy' | 'eager'
    decoding?: 'async' | 'sync' | 'auto'
    fetchPriority?: 'high' | 'low' | 'auto'
    imgClass?: string
  }>(),
  {
    loading: 'lazy',
    decoding: 'async',
    fetchPriority: 'auto',
  },
)

const baseUrl = computed(() => resolveMediaUrl(props.src))

const defaultWidth = computed(() => {
  if (props.width) return props.width
  const list = props.widths
  return list?.length ? list[list.length - 1] : undefined
})

const resolvedSrc = computed(() =>
  optimizeImageUrl(baseUrl.value, {
    width: defaultWidth.value,
    quality: 'auto',
  }),
)

const srcSet = computed(() => {
  if (!props.widths?.length || !baseUrl.value) return ''
  return buildResponsiveSrcSet(baseUrl.value, props.widths)
})

const sizes = computed(() => props.sizes ?? '')
</script>
