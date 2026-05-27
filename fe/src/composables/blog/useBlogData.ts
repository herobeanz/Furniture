import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi, type BlogPost } from '@/services/api/blog'
import { extractErrorMessage } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import { slugify } from '@/utils/slugify'
import { logger } from '@/utils/logger'

/**
 * Composable for Blog listing page data fetching
 */
export function useBlogListData() {
  const posts = ref<BlogPost[]>([])
  const loading = ref(true)
  const error = ref('')

  async function fetchPosts() {
    loading.value = true
    error.value = ''
    try {
      posts.value = await blogApi.getPosts()
    } catch (e: any) {
      error.value = extractErrorMessage(e, 'Không thể tải bài viết.')
      logger.error('Failed to fetch blog posts:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPosts()
  })

  return {
    posts,
    loading,
    error,
  }
}

/**
 * Composable for Blog post detail page data fetching
 */
function resolveRouteSlug(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' ? decodeURIComponent(value) : ''
}

function loadBlogPreview(slugParam: string): BlogPost | null {
  if (!slugParam) return null
  const normalized = slugify(slugParam)
  const candidates = [slugParam, normalized].filter(
    (s, i, arr) => s && arr.indexOf(s) === i,
  )
  for (const key of candidates) {
    const data = getPreviewData('blog', key)
    if (data) return data as BlogPost
  }
  return null
}

export function useBlogPostData() {
  const route = useRoute()
  const slug = computed(() => resolveRouteSlug(route.params.slug))
  const isPreview = computed(
    () =>
      route.path.endsWith('/preview') ||
      route.matched.some((r) => r.name === 'blog-post-preview'),
  )

  const post = ref<BlogPost | null>(null)
  const loading = ref(true)
  const error = ref('')

  async function fetchPost() {
    if (!slug.value) {
      loading.value = false
      error.value = isPreview.value
        ? 'Slug bài viết không hợp lệ.'
        : 'Không tìm thấy bài viết.'
      return
    }

    if (isPreview.value) {
      const previewData = loadBlogPreview(slug.value)
      if (previewData) {
        post.value = previewData
        loading.value = false
        error.value = ''
        return
      }
      loading.value = false
      error.value =
        'Không có dữ liệu xem trước. Quay lại form admin và bấm «Xem trước» lại.'
      return
    }

    loading.value = true
    error.value = ''
    try {
      post.value = await blogApi.getPost(slug.value)
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Không tìm thấy bài viết.')
      logger.error('Failed to fetch blog post:', e)
    } finally {
      loading.value = false
    }
  }

  watch(slug, fetchPost, { immediate: true })

  return {
    post,
    loading,
    error,
  }
}
