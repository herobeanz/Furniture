import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { roomApi, type Room } from '@/services/api/rooms'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import type { Category } from '@/services/api/categories'

/**
 * Composable for Room page data fetching and state management
 */
export function useRoomData() {
  const route = useRoute()
  const roomSlug = computed(() => (route.params.roomSlug as string) ?? '')
  const isPreviewMode = computed(() => route.path.endsWith('/preview'))

  const room = ref<Room | null>(null)
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const loadingCategories = ref(false)
  const error = ref('')
  const isNotFound = ref(false)

  const breadcrumb = computed(() => {
    const items: { name: string; path: string }[] = []
    if (room.value) {
      items.push({ name: room.value.name, path: `/${roomSlug.value}` })
    }
    return items
  })

  async function fetchRoom() {
    if (!roomSlug.value) return
    loading.value = true
    error.value = ''
    isNotFound.value = false
    
    // Check for preview data first
    if (isPreviewMode.value) {
      const preview = getPreviewData('room', roomSlug.value)
      if (preview) {
        room.value = preview as Room
        loading.value = false
        await fetchCategories()
        return
      }
    }
    
    try {
      room.value = await roomApi.getRoom(roomSlug.value)
      await fetchCategories()
    } catch (e: any) {
      if (isNotFoundError(e, ['room not found'])) {
        isNotFound.value = true
      } else {
        error.value = extractErrorMessage(e, 'Không tìm thấy phòng.')
      }
      room.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    if (!room.value || error.value) return
    loadingCategories.value = true
    try {
      categories.value = await roomApi.getRoomCategories(roomSlug.value)
    } catch (e: any) {
      categories.value = []
    } finally {
      loadingCategories.value = false
    }
  }

  function reset() {
    room.value = null
    categories.value = []
    isNotFound.value = false
    error.value = ''
  }

  watch(roomSlug, () => {
    reset()
    if (roomSlug.value) {
      fetchRoom()
    }
  }, { immediate: true })

  return {
    // State
    room,
    categories,
    loading,
    loadingCategories,
    error,
    isNotFound,
    // Computed
    breadcrumb,
    roomSlug,
    // Methods
    reset,
  }
}
