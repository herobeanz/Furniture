import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/services/api/client'
import { extractErrorMessage, isNotFoundError } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'

/**
 * Composable for CMS page data fetching
 */
export function useCmsPage() {
  const route = useRoute()
  const slug = computed(() => route.params.slug as string)
  const isPreview = computed(() => route.name === 'cms-page-preview')

  const page = ref<{ title: string; content: string } | null>(null)
  const loading = ref(true)
  const error = ref('')
  const isNotFound = ref(false)

  async function fetchPage() {
    if (!slug.value || slug.value === 'lien-he') {
      loading.value = false
      return
    }
    
    // Check for preview data first
    if (isPreview.value) {
      const previewData = getPreviewData('cms', slug.value)
      if (previewData) {
        page.value = previewData as { title: string; content: string }
        loading.value = false
        return
      }
    }
    
    loading.value = true
    error.value = ''
    isNotFound.value = false
    try {
      page.value = await apiClient.get(`/cms/page/${slug.value}`) as { title: string; content: string }
    } catch (e: any) {
      if (isNotFoundError(e)) {
        isNotFound.value = true
      } else {
        error.value = extractErrorMessage(e, 'Không tìm thấy trang.')
      }
    } finally {
      loading.value = false
    }
  }

  watch(slug, fetchPage, { immediate: true })

  return {
    slug,
    page,
    loading,
    error,
    isNotFound,
  }
}
