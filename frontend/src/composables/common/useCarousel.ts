import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Composable for carousel/slider functionality
 */
export function useCarousel(
  itemsCount: number,
  options?: {
    itemsPerView?: number
    autoPlay?: boolean
    autoPlayInterval?: number
  }
) {
  const itemsPerView = options?.itemsPerView ?? 3
  const autoPlay = options?.autoPlay ?? true
  const autoPlayInterval = options?.autoPlayInterval ?? 5000

  const currentIndex = ref(0)
  let autoPlayTimer: ReturnType<typeof setInterval> | null = null

  const maxIndex = computed(() => Math.max(0, itemsCount - itemsPerView))
  const visibleDots = computed(() => Math.ceil(itemsCount / itemsPerView))
  const currentDotIndex = computed(() => Math.floor(currentIndex.value / itemsPerView))
  const canGoPrev = computed(() => currentIndex.value > 0)
  const canGoNext = computed(() => currentIndex.value < maxIndex.value)

  const transformStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * (100 / itemsPerView)}%)`,
    '--items-per-view': itemsPerView,
  }))

  function nextSlide() {
    if (currentIndex.value < maxIndex.value) {
      currentIndex.value = Math.min(currentIndex.value + itemsPerView, maxIndex.value)
    } else {
      currentIndex.value = 0 // Loop back to start
    }
  }

  function prevSlide() {
    if (currentIndex.value > 0) {
      currentIndex.value = Math.max(currentIndex.value - itemsPerView, 0)
    } else {
      currentIndex.value = maxIndex.value // Loop to end
    }
  }

  function goToSlide(index: number) {
    currentIndex.value = index * itemsPerView
  }

  function startAutoPlay() {
    if (!autoPlay) return
    stopAutoPlay()
    autoPlayTimer = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer)
      autoPlayTimer = null
    }
  }

  onMounted(() => {
    startAutoPlay()
  })

  onUnmounted(() => {
    stopAutoPlay()
  })

  return {
    // State
    currentIndex,
    // Computed
    maxIndex,
    visibleDots,
    currentDotIndex,
    canGoPrev,
    canGoNext,
    transformStyle,
    // Methods
    nextSlide,
    prevSlide,
    goToSlide,
    startAutoPlay,
    stopAutoPlay,
  }
}
