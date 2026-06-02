import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { BlogPost } from '@/services/api/blog'
import { extractErrorMessage } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import { slugify } from '@/utils/slugify'
import { logger } from '@/utils/logger'
import { useBlogCacheStore } from '@/stores/blogCache'

/**
 * Composable for Blog listing page data fetching
 */
export function useBlogListData() {
  const blogCache = useBlogCacheStore()
  const posts = ref<BlogPost[]>([])
  const loading = ref(true)
  const error = ref('')

  async function fetchPosts(options?: { force?: boolean }) {
    const cached = blogCache.peekPosts()

    if (cached && !options?.force) {
      posts.value = cached
      error.value = ''
      loading.value = false
      if (!blogCache.isPostsFresh()) {
        void revalidatePosts()
      }
      return
    }

    loading.value = true
    error.value = ''
    try {
      posts.value = await blogCache.fetchPosts(undefined, options)
    } catch (e: unknown) {
      logger.error('Failed to fetch blog posts:', e)
      if (!cached) {
        posts.value = []
      }
      error.value = extractErrorMessage(e, 'Không thể tải bài viết.')
    } finally {
      loading.value = false
    }
  }

  async function revalidatePosts() {
    try {
      posts.value = await blogCache.fetchPosts(undefined, { force: true })
      error.value = ''
    } catch (e: unknown) {
      logger.error('Failed to refresh blog posts:', e)
    }
  }

  onMounted(() => {
    void fetchPosts()
  })

  onActivated(() => {
    void fetchPosts()
  })

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
  }
}

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

/**
 * Composable for Blog post detail page data fetching
 */
export function useBlogPostData() {
  const route = useRoute()
  const blogCache = useBlogCacheStore()
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

    const slugVal = slug.value
    const cached = blogCache.peekPost(slugVal)

    if (cached) {
      post.value = cached
      loading.value = false
      error.value = ''
      if (!blogCache.isPostFresh(slugVal)) {
        void revalidatePost(slugVal)
      }
      return
    }

    if (!post.value || post.value.slug !== slugVal) {
      loading.value = true
    }
    error.value = ''

    try {
      post.value = await blogCache.fetchPost(slugVal)
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Không tìm thấy bài viết.')
      logger.error('Failed to fetch blog post:', e)
    } finally {
      loading.value = false
    }
  }

  async function revalidatePost(slugVal: string) {
    try {
      const fresh = await blogCache.fetchPost(slugVal, { force: true })
      if (slug.value === slugVal) {
        post.value = fresh
      }
    } catch {
      /* giữ cache */
    }
  }

  watch(slug, fetchPost, { immediate: true })

  onActivated(() => {
    void fetchPost()
  })

  return {
    post,
    loading,
    error,
  }
}
